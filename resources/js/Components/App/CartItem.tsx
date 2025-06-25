import React from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import { CartItem as CartItemType } from '@/types';
import { productRoute } from '@/helpers';
import TextInput from '@/Components/Core/TextInput';
import CurrencyFormatter from '@/Components/Core/CurrencyFormatter';

function CartItem({ item }: { item: CartItemType }) {
  const deleteForm = useForm({
    option_ids: item.option_ids
  });

  const [error, setError] = React.useState('');
  const onDeleteClick = () => {
    deleteForm.post(route('cart.destroy', item.product_id), {
      preserveScroll: true
    });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (isNaN(newQuantity) || newQuantity < 1) {
      e.target.value = item.quantity.toString(); // Reset to current quantity if invalid
      return;
    }
    
    setError('');
    router.put(route('cart.update', item.product_id), {
      quantity: newQuantity,
      option_ids: item.option_ids
    }, {
      preserveScroll: true,
      onError: (errors) => {
        setError(Object.values(errors)[0]);
        e.target.value = item.quantity.toString(); // Reset to current quantity on error
      }
    });
  };
  return (
    <>
      <div key={item.id} className={'flex gap-6 p-4'}>
        <Link href={productRoute(item)} className={'w-32 min-w-32 flex justify-center self-start'}>
          <img src={item.image} alt="" className={'max-w-full max-h-full'} />
        </Link>
        <div className={'flex-1 flex flex-col'}>
          <div className={'flex-1'}>
            <h3 className={'font-semibold mb-3 text-sm'}>
              <Link href={productRoute(item)}>
                {item.title}
              </Link>
            </h3>
            <div className={'text-xs'}>
              {item.options.map((option) => (
                <div key={option.id}>
                  <strong className={'text-bold'}>
                    {option.type.name}:
                  </strong>
                  {option.name}
                </div>
              ))}
            </div>
          </div>
          <div className={'flex justify-between items-center mt-4'}>
            <div className={'flex items-center gap-2'}>
              <div className={'text-sm'}>
                Quantity:
              </div>
              <div className={error ? 'tooltip tooltip-open tooltip-error ' : ''} data-tip={error}>
                <TextInput
                  type={'number'}
                  defaultValue={item.quantity}
                  onBlur={handleQuantityChange}
                  className={'input input-bordered input-sm w-16'}
                />
              </div>
              <button onClick={() => onDeleteClick()}
                      className={'btn btn-sm btn-ghost'}>
                Delete
              </button>
              <button className={'btn btn-sm btn-ghost'}>
                Save for Later
              </button>
              <div className={'font-bold text-lg'}>
                <CurrencyFormatter amount={item.price * item.quantity} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={'divider'}></div>
    </>
  );
}

export default CartItem;
