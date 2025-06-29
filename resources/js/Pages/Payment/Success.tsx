import { Head, Link } from '@inertiajs/react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function PaymentSuccess() {
  return (
    <>
      <Head title="Payment Successful" />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center space-y-6">
          <CheckCircleIcon className="mx-auto text-green-500 w-16 h-16" />
          <h1 className="text-2xl font-bold text-gray-800">Payment Successful!</h1>
          <p className="text-gray-600">
            Thank you for your order. Your payment has been received and your order is being processed.
          </p>

          <Link
            href="/"
            className="inline-block mt-4 bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}
