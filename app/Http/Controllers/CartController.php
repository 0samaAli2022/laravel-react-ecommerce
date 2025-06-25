<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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

    public function checkout(CartService $cartService)
    {
//        return Inertia::render('Cart/Checkout', [
//            'cartItems' => $cartService->getCartItemsGrouped(),
//            'totalPrice' => $cartService->getTotalPrice(),
//        ]);
    }
}
