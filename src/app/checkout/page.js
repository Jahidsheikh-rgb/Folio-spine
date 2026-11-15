'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, CreditCard, ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import useCartStore from '@/store/useCartStore';
import useAuthStore from '@/store/useAuthStore';
import { formatCurrency } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { user, isLoading } = useAuthStore();

  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      toast.error('Please sign in to complete your order');
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-ink-900">Your bag is empty</h2>
        <p className="mt-2 text-sm text-stone-500">
          Add some books from the catalog before checking out.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-ink-900 px-6 py-3 text-sm font-semibold text-white"
        >
          Browse Catalog
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      setPlacingOrder(true);
      const payload = {
        items: items.map(({ book, quantity }) => ({
          bookId: book._id,
          quantity,
        })),
        shippingAddress,
        paymentMethod,
      };

      await api.post('/orders', payload);
      clearCart();
      toast.success('Order placed successfully!');
      router.push('/orders');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-ink-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Continue Shopping
      </Link>

      <h1 className="mt-4 font-serif text-3xl font-bold text-ink-900">Secure Checkout</h1>

      <form
        onSubmit={handlePlaceOrder}
        className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12"
      >
        {/* Left: Address & Payment */}
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-soft">
            <div className="flex items-center gap-2 text-ink-900">
              <MapPin className="h-5 w-5 text-brand-600" />
              <h2 className="font-serif text-lg font-bold">Shipping Address</h2>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-600">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress.street}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, street: e.target.value })
                  }
                  placeholder="221B Baker Street"
                  className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600">City</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, city: e.target.value })
                  }
                  placeholder="Dhaka"
                  className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600">
                  Postal Code
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress.postalCode}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                  }
                  placeholder="1230"
                  className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-600">Country</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.country}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, country: e.target.value })
                  }
                  placeholder="Bangladesh"
                  className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-soft">
            <div className="flex items-center gap-2 text-ink-900">
              <CreditCard className="h-5 w-5 text-brand-600" />
              <h2 className="font-serif text-lg font-bold">Payment Method</h2>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { id: 'card', label: 'Credit / Debit Card' },
                { id: 'mobile_banking', label: 'Mobile Banking' },
                { id: 'cod', label: 'Cash on Delivery' },
              ].map((method) => (
                <button
                  type="button"
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`rounded-xl border p-3.5 text-left text-xs font-semibold transition ${
                    paymentMethod === method.id
                      ? 'border-brand-600 bg-brand-50 text-brand-900'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                  }`}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
            <h2 className="font-serif text-lg font-bold text-ink-900">Order Summary</h2>

            <ul className="mt-4 divide-y divide-stone-100">
              {items.map(({ book, quantity }) => (
                <li key={book._id} className="flex justify-between py-3 text-sm">
                  <div className="pr-4">
                    <p className="font-medium text-ink-900 line-clamp-1">{book.title}</p>
                    <p className="text-xs text-stone-500">Qty: {quantity}</p>
                  </div>
                  <span className="font-semibold text-ink-900">
                    {formatCurrency(book.price * quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 border-t border-stone-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-stone-600">
                <span>Delivery</span>
                <span className="font-medium text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-ink-900">
                <span>Total</span>
                <span>{formatCurrency(getSubtotal())}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={placingOrder}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-ink-900 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:opacity-50"
            >
              <ShieldCheck className="h-4 w-4" />
              {placingOrder ? 'Processing Order...' : 'Confirm & Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
