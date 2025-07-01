<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatusEnum;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(CartService $cartService): \Inertia\Response
    {
        return Inertia::render('Cart/Index', [
            'cartItems' => $cartService->getCartItemsGrouped(),
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Product $product, CartService $cartService): RedirectResponse
    {
        $request->mergeIfMissing([
            'quantity' => 1
        ]);

        $data = $request->validate([
            'option_ids' => ['nullable', 'array'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $cartService->addItemToCart(
            $product,
            $data['option_ids'] ?? [],
            $data['quantity'],
            true // Always increment when adding from product page
        );

        return back()->with('success', 'Product added to cart.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product, CartService $cartService): RedirectResponse
    {
        $data = $request->validate([
            'quantity' => ['integer', 'min:1'],
        ]);

        $optionIds = $request->input('option_ids') ?: [];
        $quantity = $request->input('quantity');

        $cartService->updateItemQuantity(
            $product->id,
            $optionIds,
            $quantity
        );

        return back()->with('success', 'Product quantity updated.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Product $product, CartService $cartService): RedirectResponse
    {
        $optionIds = $request->input('option_ids');

        $cartService->removeFromCart(
            $product->id,
            $optionIds
        );

        return back()->with('success', 'Product removed from cart.');
    }

    public function checkout(Request $request, CartService $cartService): RedirectResponse
    {
        $vendorId = $request->input('vendor_id');

        $allCartItems = $cartService->getCartItemsGrouped();
        $existingOrders = Order::with('items')
            ->where('user_id', $request->user()->id)
            ->where('status', OrderStatusEnum::Draft)
            ->get();
        if ($existingOrders->count() > 0) {
            $existingOrders->each->delete();
        }


        DB::beginTransaction();

        try {
            $checkoutCartItems = $allCartItems;
            if ($vendorId) {
                $checkoutCartItems = [$allCartItems[$vendorId]];
            }
            $orders = [];
            foreach ($checkoutCartItems as $item) {
                $user = $item['user'];
                $cartItems = $item['items'];
                $order = Order::create([
                    'user_id' => $request->user()->id,
                    'vendor_user_id' => $user['id'],
                    'total_price' => $item['totalPrice'],
                    'status' => OrderStatusEnum::Draft,
                ]);

                $orders[] = $order;
                foreach ($cartItems as $cartItem) {
                    $description = collect($cartItem['options'])
                        ->map(fn($option) => "{$option['type']['name']}: {$option['name']}")
                        ->implode(', ');
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $cartItem['product_id'],
                        'quantity' => $cartItem['quantity'],
                        'price' => $cartItem['price'],
                        'variation_type_option_ids' => $cartItem['option_ids'],
                        'description' => $description
                    ]);
                }
            }
            foreach ($orders as $order) {
                $order->save();
            }
            DB::commit();
            return redirect()->route('checkout.payment', [
                'orderIds' => collect($orders)->pluck('id')->toArray(),
            ]);
        } catch (\Exception $e) {
            Log::error($e);
            DB::rollBack();
            return back()->with('error', $e->getMessage() ?: 'Failed to place order.');
        }
    }


}
