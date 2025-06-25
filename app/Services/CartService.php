<?php

namespace App\Services;

use App\Models\CartItem;
use App\Models\Product;
use App\Models\VariationTypeOption;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class CartService
{
    private ?array $cachedCartItems = null;

    protected const COOKIE_NAME = 'cartItems';
    protected const COOKIE_LIFETIME = 60 * 60 * 24 * 365; // 1 year

    public function addItemToCart(Product $product, array $optionIds = null, int $quantity = 1): void
    {
        if ($optionIds === null) {
            $optionIds = $product->variationTypes
                ->mapWithKeys(fn($variationType) => [$variationType->id => $variationType->options[0]?->id])
                ->toArray();
        }
        $price = $product->getPriceForOptions($optionIds);

        if (Auth::check()) {
            $this->saveItemToDatabase($product->id, $quantity, $price, $optionIds);
        } else {
            $this->saveItemToCookies($product->id, $quantity, $price, $optionIds);
        }
    }


    public function updateItemQuantity(int $productId, array $optionIds = null, int $quantity = 1): void
    {
        if (Auth::check()) {
            $this->updateItemQuantityInDatabase($productId, $optionIds, $quantity);
        } else {
            $this->updateItemQuantityInCookies($productId, $optionIds, $quantity);
        }
    }

    public
    function removeFromCart(int $productId, array $optionIds = null): void
    {
        if (Auth::check()) {
            $this->removeItemFromDatabase($productId, $optionIds);
        } else {
            $this->removeItemFromCookies($productId, $optionIds);
        }
    }

    public
    function getCartItems(): array
    {
        try {
            if ($this->cachedCartItems === null) {
                if (Auth::check()) {
                    $cartItems = $this->getCartItemsFromDatabase();
                } else {
                    $cartItems = $this->getCartItemsFromCookies();
                }

                $productIds = collect($cartItems)->map(fn($item) => $item['product_id']);
                $products = Product::whereIn('id', $productIds)
                    ->with('user.vendor')
                    ->forWebsite()
                    ->get()
                    ->keyBy('id');

                $cartItemsData = [];
                foreach ($cartItems as $cartItem) {
                    $product = data_get($products, $cartItem['product_id']);
                    if (!$product) continue;

                    $optionInfo = [];
                    $options = VariationTypeOption::with('variationType')
                        ->whereIn('id', $cartItem['option_ids'])
                        ->get()
                        ->keyBy('id');

                    $imageUrl = null;
                    foreach ($cartItem['option_ids'] as $optionId) {
                        $option = data_get($options, $optionId);
                        if (!$imageUrl) {
                            $imageUrl = $option->getFirstMediaUrl('images', 'small');
                        }

                        $optionInfo[] = [
                            'id' => $option->id,
                            'name' => $option->name,
                            'type' => [
                                'id' => $option->variationType->id,
                                'name' => $option->variationType->name,
                            ],
                        ];
                    }

                    $cartItemsData[] = [
                        'id' => $cartItem['id'],
                        'product_id' => $product->id,
                        'title' => $product->title,
                        'slug' => $product->slug,
                        'price' => $cartItem['price'],
                        'quantity' => $cartItem['quantity'],
                        'option_ids' => $cartItem['option_ids'],
                        'options' => $optionInfo,
                        'image' => $imageUrl ?: $product->getFirstMediaUrl('images', 'small'),
                        'user' => [
                            'id' => $product->created_by,
                            'name' => $product->user->vendor->store_name,
                        ],
                    ];
                }
                $this->cachedCartItems = $cartItemsData;

            }
            return $this->cachedCartItems;
        } catch (\Exception $e) {
            Log::error($e->getMessage() . PHP_EOL . $e->getTraceAsString());
        }

        return [];
    }

    public
    function getTotalQuantity()
    {
        $totalQuantity = 0;
        foreach ($this->getCartItems() as $item) {
            $totalQuantity += $item['quantity'];
        }
        return $totalQuantity;
    }

    public
    function getTotalPrice(): float
    {
        $totalPrice = 0;
        foreach ($this->getCartItems() as $item) {
            $totalPrice += $item['price'] * $item['quantity'];
        }
        return $totalPrice;
    }

    protected
    function updateItemQuantityInDatabase(int $productId, array $optionIds, int $quantity): void
    {
        $userId = Auth::id();

        $cartItem = CartItem::where('user_id', $userId)
            ->where('product_id', $productId)
            ->where('variation_type_option_ids', json_encode($optionIds))
            ->first();

        if ($cartItem) {
            $cartItem->update([
                'quantity' => $quantity,
            ]);
        }
    }

    protected
    function updateItemQuantityInCookies(int $productId, array $optionIds, int $quantity): void
    {
        $cartItems = $this->getCartItemsFromCookies();
        ksort($optionIds);
        $itemKey = $productId . '_' . json_encode($optionIds);

        if (isset($cartItems[$itemKey])) {
            $cartItems[$itemKey]['quantity'] = $quantity;
        }
        $this->saveItemToCookies($productId, $quantity, $cartItems[$itemKey]['price'], $optionIds);
    }

    protected
    function saveItemToDatabase(int $productId, int $quantity, $price, array $optionIds): void
    {
        $userId = Auth::id();
        ksort($optionIds);

        $cartItem = CartItem::where('user_id', $userId)
            ->where('product_id', $productId)
            ->where('variation_type_option_ids', json_encode($optionIds))
            ->first();

        if ($cartItem) {
            $cartItem->update([
                'quantity' => $quantity,
            ]);
        } else {
            CartItem::create([
                'user_id' => $userId,
                'product_id' => $productId,
                'quantity' => $quantity,
                'price' => $price,
                'variation_type_option_ids' => $optionIds,
            ]);
        }
    }

    protected
    function saveItemToCookies(int $productId, int $quantity, $price, array $optionIds): void
    {
        $cartItems = $this->getCartItemsFromCookies();
        ksort($optionIds);
        $itemKey = $productId . '_' . json_encode($optionIds);

        if (isset($cartItems[$itemKey])) {
            $cartItems[$itemKey]['quantity'] = $quantity;
            $cartItems[$itemKey]['price'] = $price;
        } else {
            $cartItems[$itemKey] = [
                'id' => Str::uuid(),
                'product_id' => $productId,
                'quantity' => $quantity,
                'price' => $price,
                'option_ids' => $optionIds,
            ];
        }
        Cookie::queue(self::COOKIE_NAME, json_encode($cartItems), self::COOKIE_LIFETIME);
    }

    protected
    function removeItemFromDatabase(int $productId, array $optionIds = null): void
    {
        $userId = Auth::id();
        ksort($optionIds);

        CartItem::where('user_id', $userId)
            ->where('product_id', $productId)
            ->where('variation_type_option_ids', json_encode($optionIds))
            ->delete();
    }

    protected
    function removeItemFromCookies(int $productId, array $optionIds = null): void
    {
        $cartItems = $this->getCartItemsFromCookies();
        ksort($optionIds);

        $itemKey = $productId . '_' . json_encode($optionIds);
        if (isset($cartItems[$itemKey])) {
            unset($cartItems[$itemKey]);
        }
        // update cookie value with new array without removed item
        Cookie::queue(self::COOKIE_NAME, json_encode($cartItems), self::COOKIE_LIFETIME);
    }

    protected
    function getCartItemsFromDatabase(): array
    {
        $userId = Auth::id();
        return CartItem::where('user_id', $userId)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'option_ids' => $item->variation_type_option_ids,
                ];
            })
            ->toArray();
    }

    protected function getCartItemsFromCookies(): array
    {
        $cartItems = Cookie::get(self::COOKIE_NAME);

        return $cartItems ? json_decode($cartItems, true) : [];
    }

    public function getCartItemsGrouped(): array
    {
        $cartItems = $this->getCartItems();
        return collect($cartItems)
            ->groupBy(fn($item) => $item['user']['id'])
            ->map(function ($items, $userId) {
                return [
                    'user' => $items->first()['user'],
                    'items' => $items->toArray(),
                    'totalQuantity' => $items->sum('quantity'),
                    'totalPrice' => $items->sum(fn($item) => $item['price'] * $item['quantity']),
                ];
            })->toArray();
    }

    public function moveCartItemsToDatabase(): void
    {
        $cartItems = $this->getCartItemsFromCookies();
        foreach ($cartItems as $item) {
            $this->saveItemToDatabase(
                $item['product_id'],
                $item['quantity'],
                $item['price'],
                $item['option_ids']
            );
        }
        Cookie::queue(Cookie::forget(self::COOKIE_NAME));
    }
}
