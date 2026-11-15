'use client';

import Link from 'next/link';
import { Star, ShoppingBag, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import useCartStore from '@/store/useCartStore';
import { formatCurrency } from '@/lib/utils';

export default function BookCard({ book }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (book.stock <= 0) return;
    addItem(book, 1);
    toast.success(`Added "${book.title}" to bag`);
  };

  return (
    <Link
      href={`/books/${book._id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
    >
      {/* Book Cover Showcase */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
        <img
          src={book.coverImage || 'https://placehold.co/400x600?text=Book+Cover'}
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Genre Pill */}
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-ink-800 shadow-sm backdrop-blur-sm">
          {book.genre}
        </span>

        {/* Stock Badge */}
        {book.stock === 0 ? (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-red-600/95 px-2.5 py-1 text-[11px] font-semibold text-white">
            <AlertCircle className="h-3 w-3" />
            Sold Out
          </span>
        ) : book.stock <= 5 ? (
          <span className="absolute right-3 top-3 rounded-full bg-amber-500/95 px-2.5 py-1 text-[11px] font-semibold text-white">
            Only {book.stock} left
          </span>
        ) : null}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          {/* Rating Row */}
          <div className="mb-1.5 flex items-center gap-1.5 text-xs text-stone-500">
            <div className="flex items-center text-amber-500">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="ml-1 font-semibold text-ink-900">
                {book.averageRating > 0 ? book.averageRating.toFixed(1) : 'New'}
              </span>
            </div>
            <span>•</span>
            <span>
              {book.ratingsCount} {book.ratingsCount === 1 ? 'review' : 'reviews'}
            </span>
          </div>

          <h3 className="font-serif text-lg font-bold leading-snug text-ink-900 line-clamp-2 group-hover:text-brand-600 transition-colors">
            {book.title}
          </h3>
          <p className="mt-1 text-sm text-stone-500 line-clamp-1">{book.author}</p>
        </div>

        {/* Footer Price & CTA */}
        <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4">
          <div>
            <span className="text-lg font-bold text-ink-900">
              {formatCurrency(book.price)}
            </span>
            {book.stock > 5 && (
              <p className="flex items-center gap-1 text-[11px] text-emerald-600">
                <CheckCircle2 className="h-3 w-3" /> In stock
              </p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={book.stock <= 0}
            className="flex items-center gap-1.5 rounded-xl bg-ink-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            {book.stock > 0 ? 'Add' : 'Out'}
          </button>
        </div>
      </div>
    </Link>
  );
}
