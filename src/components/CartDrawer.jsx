'use client';

import { useRouter } from 'next/navigation';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import useCartStore from '@/store/useCartStore';
import { formatCurrency } from '@/lib/utils';

export default function CartDrawer() {
  const router = useRouter();
  const { items, isOpen, closeCart, updateQuantity, removeItem, getSubtotal } =
    useCartStore();

  if (!isOpen) return null;

  const subtotal = getSubtotal();

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-ink-900/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Panel */}
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-brand-600" />
            <h2 className="font-serif text-xl font-bold text-ink-900">Your Reading Bag</h2>
          </div>
          <button
            onClick={closeCart}
            className="rounded-lg p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-ink-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full bg-stone-100 p-4 text-stone-400">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <p className="font-serif text-lg font-semibold text-ink-900">
                Your bag is empty
              </p>
              <p className="mt-1 max-w-xs text-sm text-stone-500">
                Explore our curated collection of software engineering, fiction, and science titles.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-stone-100">
              {items.map(({ book, quantity }) => (
                <li key={book._id} className="flex gap-4 py-4">
                  <img
                    src={book.coverImage || 'https://placehold.co/120x180?text=Book'}
                    alt={book.title}
                    className="h-24 w-16 flex-shrink-0 rounded-lg border border-stone-200 object-cover"
                  />

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between gap-2">
                        <h4 className="font-serif text-sm font-bold text-ink-900 line-clamp-2">
                          {book.title}
                        </h4>
                        <button
                          onClick={() => removeItem(book._id)}
                          className="text-stone-400 hover:text-red-500"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-stone-500">{book.author}</p>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      {/* Quantity Stepper */}
                      <div className="flex items-center rounded-lg border border-stone-200 bg-stone-50">
                        <button
                          onClick={() => updateQuantity(book._id, quantity - 1)}
                          className="p-1.5 text-stone-600 hover:text-ink-900"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-ink-900">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(book._id, quantity + 1)}
                          disabled={quantity >= book.stock}
                          className="p-1.5 text-stone-600 hover:text-ink-900 disabled:opacity-40"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-ink-900">
                        {formatCurrency(book.price * quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-stone-200 bg-stone-50/70 px-6 py-5">
            <div className="flex items-center justify-between text-sm text-stone-600">
              <span>Shipping</span>
              <span className="font-medium text-emerald-600">Free Standard Delivery</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-base font-bold text-ink-900">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-ink-900 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600"
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
