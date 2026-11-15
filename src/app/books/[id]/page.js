'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Star,
  ShoppingBag,
  BookOpen,
  Building2,
  Calendar,
  Hash,
  CheckCircle2,
  AlertCircle,
  Send,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import useCartStore from '@/store/useCartStore';
import useAuthStore from '@/store/useAuthStore';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function BookDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const { user } = useAuthStore();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Review form
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const loadBookAndReviews = useCallback(async () => {
    try {
      setLoading(true);
      const [bookRes, reviewsRes] = await Promise.all([
        api.get(`/books/${id}`),
        api.get(`/books/${id}/reviews`),
      ]);
      setBook(bookRes.data.data.book);
      setReviews(reviewsRes.data.data.reviews || []);
    } catch (err) {
      toast.error(err.message);
      router.push('/');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (id) loadBookAndReviews();
  }, [id, loadBookAndReviews]);

  const handleAddToCart = () => {
    if (!book || book.stock <= 0) return;
    addItem(book, quantity);
    toast.success(`Added ${quantity} × "${book.title}" to your bag`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to leave a review');
      router.push('/login');
      return;
    }
    try {
      setSubmittingReview(true);
      await api.post(`/books/${id}/reviews`, { rating: Number(rating), comment });
      toast.success('Review published!');
      setComment('');
      await loadBookAndReviews();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-pulse grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-4 aspect-[3/4] rounded-2xl bg-stone-200" />
          <div className="md:col-span-8 space-y-4">
            <div className="h-6 w-28 rounded bg-stone-200" />
            <div className="h-10 w-3/4 rounded bg-stone-200" />
            <div className="h-5 w-1/3 rounded bg-stone-200" />
            <div className="h-32 w-full rounded bg-stone-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!book) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-ink-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Catalog
      </Link>

      {/* Main Product Section */}
      <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-12">
        {/* Book Cover */}
        <div className="md:col-span-4">
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-card">
            <img
              src={book.coverImage || 'https://placehold.co/400x600?text=Book+Cover'}
              alt={book.title}
              className="aspect-[3/4] w-full object-cover"
            />
          </div>
        </div>

        {/* Metadata & Purchase Panel */}
        <div className="md:col-span-8 flex flex-col justify-between">
          <div>
            <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800">
              {book.genre}
            </span>

            <h1 className="mt-3 font-serif text-3xl font-bold text-ink-900 sm:text-4xl">
              {book.title}
            </h1>
            <p className="mt-2 text-lg font-medium text-stone-600">by {book.author}</p>

            {/* Rating Summary */}
            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-sm font-bold text-amber-700">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {book.averageRating > 0 ? book.averageRating.toFixed(1) : 'No ratings yet'}
              </div>
              <span className="text-sm text-stone-500">
                ({book.ratingsCount} customer {book.ratingsCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            <p className="mt-6 text-base leading-relaxed text-stone-700">
              {book.description}
            </p>

            {/* Spec Grid */}
            <div className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-stone-200 bg-white p-5 sm:grid-cols-4">
              <div>
                <span className="flex items-center gap-1.5 text-xs text-stone-400">
                  <Hash className="h-3.5 w-3.5" /> ISBN
                </span>
                <p className="mt-1 text-xs font-semibold text-ink-900">{book.isbn}</p>
              </div>
              <div>
                <span className="flex items-center gap-1.5 text-xs text-stone-400">
                  <Building2 className="h-3.5 w-3.5" /> Publisher
                </span>
                <p className="mt-1 text-xs font-semibold text-ink-900">
                  {book.publisher || 'Independent Press'}
                </p>
              </div>
              <div>
                <span className="flex items-center gap-1.5 text-xs text-stone-400">
                  <Calendar className="h-3.5 w-3.5" /> Published
                </span>
                <p className="mt-1 text-xs font-semibold text-ink-900">
                  {book.publishedYear || 'N/A'}
                </p>
              </div>
              <div>
                <span className="flex items-center gap-1.5 text-xs text-stone-400">
                  <BookOpen className="h-3.5 w-3.5" /> Availability
                </span>
                <p className="mt-1 text-xs font-semibold text-ink-900">
                  {book.stock > 0 ? `${book.stock} copies` : 'Out of stock'}
                </p>
              </div>
            </div>
          </div>

          {/* Add to Bag Box */}
          <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-3xl font-bold text-ink-900">
                  {formatCurrency(book.price)}
                </span>
                {book.stock > 0 ? (
                  <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" /> Ready to ship today
                  </p>
                ) : (
                  <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-red-600">
                    <AlertCircle className="h-4 w-4" /> Currently unavailable
                  </p>
                )}
              </div>

              {book.stock > 0 && (
                <div className="flex items-center gap-3">
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="rounded-xl border border-stone-300 bg-stone-50 px-3.5 py-3 text-sm font-semibold text-ink-900 focus:outline-none"
                  >
                    {[...Array(Math.min(10, book.stock))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Qty: {i + 1}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleAddToCart}
                    className="flex items-center gap-2 rounded-xl bg-ink-900 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Add to Bag
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 border-t border-stone-200 pt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Write a Review */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-soft">
            <h2 className="font-serif text-xl font-bold text-ink-900">Write a Reader Review</h2>
            <p className="mt-1 text-xs text-stone-500">
              Share your thoughts with fellow readers. Submitting updates your existing review if you already rated this book.
            </p>

            <form onSubmit={handleReviewSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                  Rating
                </label>
                <div className="mt-2 flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setRating(num)}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-bold transition ${
                        rating >= num
                          ? 'border-amber-400 bg-amber-50 text-amber-700'
                          : 'border-stone-200 bg-white text-stone-400'
                      }`}
                    >
                      {num}★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                  Comment
                </label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What stood out about this book?"
                  className="mt-1.5 w-full rounded-xl border border-stone-300 p-3 text-sm text-ink-900 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink-900 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {submittingReview ? 'Publishing...' : 'Publish Review'}
              </button>
            </form>
          </div>
        </div>

        {/* Review Feed */}
        <div className="lg:col-span-7">
          <h2 className="font-serif text-2xl font-bold text-ink-900">
            Reader Reviews ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-500">
              No reviews yet. Be the first reader to review <strong>{book.title}</strong>!
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-800">
                        {rev.user?.name?.[0]?.toUpperCase() || 'R'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink-900">
                          {rev.user?.name || 'Verified Reader'}
                        </p>
                        <p className="text-[11px] text-stone-400">{formatDate(rev.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {rev.rating}.0
                    </div>
                  </div>
                  {rev.comment && (
                    <p className="mt-3 text-sm leading-relaxed text-stone-700">{rev.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
