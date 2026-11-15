'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, SlidersHorizontal, Sparkles, BookOpenCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '@/lib/api';
import { GENRES } from '@/lib/utils';
import BookCard from '@/components/BookCard';

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Query filters
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [page, setPage] = useState(1);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        page,
        limit: 8,
        sort: sortBy,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (selectedGenre !== 'All') params.genre = selectedGenre;
      if (inStockOnly) params.inStock = 'true';

      const res = await api.get('/books', { params });
      setBooks(res.data.books || []);
      setPagination(res.data.pagination || { page: 1, pages: 1, total: 0 });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, debouncedSearch, selectedGenre, inStockOnly]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return (
    <div>
      {/* Editorial Hero Banner */}
      <section className="relative overflow-hidden border-b border-stone-200/80 bg-gradient-to-br from-brand-50 via-[#FAF9F6] to-stone-100 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3.5 py-1 text-xs font-semibold text-brand-700 shadow-xs">
              <Sparkles className="h-3.5 w-3.5" />
              Independent Curated Bookshelf
            </div>
            <h1 className="mt-5 font-serif text-4xl font-bold tracking-tight text-ink-900 sm:text-5xl lg:text-[54px] lg:leading-[1.1]">
              Stories &amp; systems worth keeping on your desk.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
              Discover seminal software architecture handbooks, gripping science fiction, and timeless non-fiction with instant inventory availability.
            </p>

            {/* Search Bar */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by title, author, or keyword..."
                  className="w-full rounded-2xl border border-stone-300 bg-white py-3.5 pl-12 pr-4 text-sm text-ink-900 shadow-soft placeholder:text-stone-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Controls & Grid */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Genre Filter Pills + Sort Controls */}
        <div className="flex flex-col justify-between gap-4 border-b border-stone-200 pb-6 lg:flex-row lg:items-center">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => {
                  setSelectedGenre(genre);
                  setPage(1);
                }}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  selectedGenre === genre
                    ? 'bg-ink-900 text-white shadow-sm'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300 hover:text-ink-900'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-medium text-stone-700">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => {
                  setInStockOnly(e.target.checked);
                  setPage(1);
                }}
                className="rounded border-stone-300 text-brand-600 focus:ring-brand-500"
              />
              In Stock Only
            </label>

            <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5 text-stone-400" />
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent text-xs font-semibold text-ink-900 focus:outline-none"
              >
                <option value="-createdAt">Newest Arrivals</option>
                <option value="-averageRating">Highest Rated</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Status Info */}
        <div className="mt-6 flex items-center justify-between text-xs text-stone-500">
          <span>
            Showing <strong className="text-ink-900">{books.length}</strong> of{' '}
            <strong className="text-ink-900">{pagination.total}</strong> books
          </span>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            <strong>Backend Connection Issue:</strong> {error}. Make sure your Node.js API server is running on port 5000.
          </div>
        )}

        {/* Loading Skeletons */}
        {loading ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse overflow-hidden rounded-2xl border border-stone-200 bg-white"
              >
                <div className="aspect-[3/4] bg-stone-200" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-20 rounded bg-stone-200" />
                  <div className="h-5 w-3/4 rounded bg-stone-200" />
                  <div className="h-4 w-1/2 rounded bg-stone-200" />
                </div>
              </div>
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-white py-16 text-center">
            <BookOpenCheck className="h-10 w-10 text-stone-400" />
            <h3 className="mt-3 font-serif text-xl font-bold text-ink-900">No books matched your filters</h3>
            <p className="mt-1 text-sm text-stone-500">
              Try clearing your search term or selecting a different genre.
            </p>
            <button
              onClick={() => {
                setSearchInput('');
                setSelectedGenre('All');
                setInStockOnly(false);
                setPage(1);
              }}
              className="mt-5 rounded-xl bg-ink-900 px-4 py-2 text-xs font-semibold text-white"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-3">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex items-center gap-1 rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-ink-900 transition hover:bg-stone-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <span className="text-xs font-medium text-stone-600">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              disabled={page >= pagination.pages}
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              className="flex items-center gap-1 rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-ink-900 transition hover:bg-stone-50 disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
