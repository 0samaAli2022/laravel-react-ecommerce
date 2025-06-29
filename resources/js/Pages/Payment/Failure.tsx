import { Head, Link } from '@inertiajs/react';
import { XCircleIcon } from '@heroicons/react/24/solid';

export default function PaymentFailure() {
  return (
    <>
      <Head title="Payment Failed" />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center space-y-6">
          <XCircleIcon className="mx-auto text-red-500 w-16 h-16" />
          <h1 className="text-2xl font-bold text-gray-800">Payment Failed</h1>
          <p className="text-gray-600">
            Oops! Something went wrong during your payment. Please try again or choose another payment method.
          </p>

          <div className="flex flex-col gap-3 mt-4">
            <Link
              href={route('cart.index')}
              className="inline-block bg-yellow-500 text-white py-2 px-6 rounded-full hover:bg-yellow-600 transition"
            >
              Try Again
            </Link>
            <Link
              href={route('cart.index')}
              className="inline-block bg-gray-200 text-gray-700 py-2 px-6 rounded-full hover:bg-gray-300 transition"
            >
              Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
