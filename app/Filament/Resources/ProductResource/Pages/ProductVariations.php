<?php

namespace App\Filament\Resources\ProductResource\Pages;

use App\Filament\Resources\ProductResource;
use Filament\Actions;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Database\Eloquent\Model;

class ProductVariations extends EditRecord
{
    protected static string $resource = ProductResource::class;

    protected static ?string $title = 'Variations';
    protected static ?string $navigationIcon = 'heroicon-o-clipboard-document-list';

    public function form(Form $form): Form
    {
        $types = $this->record->variationTypes;
        $fields = [];
        foreach ($types as $type) {
            $variationKey = 'variation_type_' . $type->id;

            $fields[] = \Filament\Forms\Components\Hidden::make("{$variationKey}.id")
                ->dehydrated(true);

            $fields[] = TextInput::make("{$variationKey}.name")
                ->label($type->name);
        }
        return $form
            ->schema([
                Repeater::make('variations')
                    ->itemLabel(fn($state) => collect($state)
                        ->filter(fn($v, $k) => str_starts_with($k, 'variation_type_'))
                        ->map(fn($v) => $v['name'] ?? '')
                        ->implode(' / '))
                    ->label(false)
                    ->collapsed()
                    ->addable(false)
                    ->defaultItems(1)
                    ->schema([
                        Section::make()
                            ->schema($fields)
                            ->columns(3),
                        TextInput::make('quantity')
                            ->label('Quantity')
                            ->numeric(),
                        TextInput::make('price')
                            ->label('Price')
                            ->numeric(),
                    ])
                    ->columns(2)
                    ->columnSpan(2)
                    ->deletable(false)
            ]);
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $variations = $this->record->variations->toArray();
        $data['variations'] = $this->mergeWithCartesianWithExisting($this->record->variationTypes, $variations);
        return $data;
    }

    private function mergeWithCartesianWithExisting($variationTypes, $existingData): array
    {
        $defaultQuantity = $this->record->quantity;
        $defaultPrice = $this->record->price;
        $cartesianProduct = $this->cartesianProduct($variationTypes, $defaultQuantity, $defaultPrice);
        $mergedResult = [];
        foreach ($cartesianProduct as $product) {
            $optionIds = collect($product)
                ->filter(fn($value, $key) => str_starts_with($key, 'variation_type_'))
                ->map(fn($option) => $option['id'])
                ->values()
                ->toArray();

            // Find matching entry in existing data
            $match = array_filter($existingData, function ($existingOption) use ($optionIds) {
                return $existingOption['variation_type_option_ids'] === $optionIds;
            });

            if (!empty($match)) {
                $existingEntry = reset($match);
                $product['id'] = $existingEntry['id'];
                $product['price'] = $existingEntry['price'];
                $product['quantity'] = $existingEntry['quantity'];
            } else {
                $product['price'] = $defaultPrice;
                $product['quantity'] = $defaultQuantity;
            }
            $mergedResult[] = $product;
        }
        return $mergedResult;
    }

    private function cartesianProduct($variationTypes, $defaultQuantity = null, $defaultPrice = null): array
    {
        $result = [[]];
        foreach ($variationTypes as $index => $variationType) {
            $temp = [];
            foreach ($variationType->options as $option) {
                foreach ($result as $combination) {
                    $newCombination = $combination + [
                            'variation_type_' . ($variationType->id) => [
                                'id' => $option->id,
                                'name' => $option->name,
                                'label' => $variationType->name,
                            ],
                        ];
                    $temp[] = $newCombination;
                }
            }
            $result = $temp;
        }

        foreach ($result as &$combination) {
            if (count($combination) === count($variationTypes)) {
                $combination['quantity'] = $defaultQuantity;
                $combination['price'] = $defaultPrice;
            }
        }

        return $result;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {// Initialize an array to hold the formatted data
        $formattedData = [];
        foreach ($data['variations'] as $option) {
            $variationTypeOptionIds = [];

            foreach ($this->record->variationTypes as $i => $variationType) {
                $key = 'variation_type_' . $variationType->id;
                $variationTypeOptionIds[] = $option[$key]['id'];
            }
            $quantity = $option['quantity'];
            $price = $option['price'];
            $formattedData[] = [
                'id' => $option['id'] ?? null,
                'variation_type_option_ids' => $variationTypeOptionIds,
                'quantity' => $quantity,
                'price' => $price,
            ];
        }

        $data['variations'] = $formattedData;
        return $data;
    }

    protected function handleRecordUpdate(Model $record, array $data): Model
    {
        $variations = $data['variations'];
        unset($data['variations']);

        $variations = collect($variations)
            ->map(fn($variation) => [
                'id' => $variation['id'],
                'variation_type_option_ids' => json_encode($variation['variation_type_option_ids']),
                'quantity' => $variation['quantity'],
                'price' => $variation['price'],

            ])->toArray();

        $record->variations()->upsert($variations, ['id'], [
            'variation_type_option_ids', 'quantity', 'price'
        ]);
        return $record;
    }
}
