<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatusEnum;
use App\Http\Resources\OrderViewResource;
use App\Models\CartItem;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function payment(Request $request): \Inertia\Response
    {
        $orderIds = $request->query('orderIds', []);
        $orders = Order::with('items.product')
            ->whereIn('id', $orderIds)
            ->where('status', OrderStatusEnum::Draft)
            ->where('user_id', $request->user()->id)
            ->get();

        return Inertia::render('Payment/Payment',
            [
                'orders' => OrderViewResource::collection($orders)->collection->toArray(),
            ]
        );
    }

    public function finishPayment(Request $request): \Inertia\Response
    {
        $orders = Order::with('items.product')
            ->where('status', OrderStatusEnum::Draft)
            ->get();
        $totalAmount = $orders->sum('total_price');
        $productsToDeletedFromCart = [];
        try {
            foreach ($orders as $order) {
                $order->website_commission = $order->total_price / 100 * config('app.platform_fee_pct');
                $order->vendor_subtotal = $order->total_price - $order->website_commission;
                $order->status = OrderStatusEnum::Paid;
                $order->save();

                $productsToDeletedFromCart =
                    [
                        ...$productsToDeletedFromCart,
                        ...$order->items->map(fn($item) => $item->product_id)->toArray(),
                    ];
                foreach ($order->items as $item) {
                    $options = $item->variation_type_option_ids;
                    $product = $item->product;

                    if ($options) {
                        sort($options);
                        $variation = $product->variations
                            ->where('variation_type_option_ids', $options)
                            ->first();
                        if ($variation && $variation->quantity != null) {
                            $variation->quantity -= $item->quantity;
                            $variation->save();
                        }
                    } else if ($product->quantity != null) {
                        $product->quantity -= $item->quantity;
                        $product->save();
                    }
                }

                CartItem::query()
                    ->where('user_id', $order->user_id)
                    ->whereIn('product_id', $productsToDeletedFromCart)
                    ->where('saved_for_later', false)
                    ->delete();
            }
            return Inertia::render('Payment/Success', [
                'orderNumber' => $order->id, // or order number if you use one
            ]);
        } catch (\Exception $e) {
            return Inertia::render('Payment/Failure');
        }
    }
}
