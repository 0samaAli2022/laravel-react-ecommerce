import { useState } from 'react';
import { Order } from '@/types';
import { router } from '@inertiajs/react';
import CurrencyFormatter from '@/Components/Core/CurrencyFormatter';

export default function PaymentPage({ orders }: { orders: Order[] }) {
  const [selectedMethod, setSelectedMethod] = useState('cod');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.post(route('checkout.finishPayment'));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Choose Payment Method</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Options */}
          <div className="space-y-4">
            <label
              className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:border-blue-500 transition">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={selectedMethod === 'cod'}
                onChange={() => setSelectedMethod('cod')}
                className="form-radio text-blue-500"
              />
              <div>
                <p className="font-medium text-gray-700">Cash on Delivery</p>
                <p className="text-sm text-gray-500">Pay when the product arrives at your door.</p>
              </div>
            </label>

            {/* Additional methods could go here */}
            {/* Ex: Credit Card, PayPal, etc. */}
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Order Summary</h2>

            {orders.map((order) => (
              <div key={order.id} className="mb-8 border border-gray-200 rounded-xl p-4 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-medium text-gray-700">
                    Order #{order.id}
                  </h3>
                  <div className="text-sm text-gray-600">
                    Seller: {order.vendorUser.store_name}
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-3 flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium text-gray-800">
                          {item.product.title} × {item.quantity}
                        </div>
                        {item.description && (
                          <div className="text-xs text-gray-500 mt-1">
                            {item.description}
                          </div>
                        )}
                      </div>

                      <div className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                        <CurrencyFormatter amount={item.price * item.quantity} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 text-right">
        <span className="text-sm font-bold text-gray-900">
          Total: ${order.total_price}
        </span>
                </div>
              </div>
            ))}
          </div>


          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
}
