import { useState } from 'react';
import { Order } from '@/types';
import { router } from '@inertiajs/react';

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
          <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
            <h2 className="font-semibold text-gray-700 mb-4">Order Summary</h2>

            {orders.map((order) => (
              <div key={order.id} className="mb-6">
                <h3 className="font-medium text-gray-600 mb-2">
                  Order #{order.id}
                </h3>

                <ul className="space-y-2 text-sm text-gray-700">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <div>
                        {item.product.title} × {item.quantity}
                      </div>
                      <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                    </li>
                  ))}
                </ul>

                <div className="mt-2 text-right font-bold text-gray-800">
                  Total: ${order.total_price}
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
