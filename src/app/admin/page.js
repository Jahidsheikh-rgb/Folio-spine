'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Plus,
  Trash2,
  BookOpen,
  PackageCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import useAuthStore from '@/store/useAuthStore';
import { formatCurrency, formatDate, GENRES } from '@/lib/utils';

export default function AdminStudioPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  const [activeTab, setActiveTab] = useState('books');
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Add Book Form
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: 'Technology',
    description: '',
    price: '',
    stock: '',
    publishedYear: new Date().getFullYear(),
    publisher: '',
  });

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      toast.error('Admin privileges required');
      router.push('/');
    }
  }, [user, isLoading, router]);

  const fetchAdminData = useCallback(async () => {
    if (!user || user.role !== 'admin') return;
    try {
      setLoadingData(true);
      const [booksRes, ordersRes] = await Promise.all([
        api.get('/books', { params: { limit: 50 } }),
        api.get('/orders', { params: { limit: 50 } }),
      ]);
      setBooks(booksRes.data.books || []);
      setOrders(ordersRes.data.orders || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingData(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const handleCreateBook = async (e) => {
    e.preventDefault();
    try {
      await api.post('/books', {
        ...newBook,
        price: Number(newBook.price),
        stock: Number(newBook.stock),
        publishedYear: Number(newBook.publishedYear),
      });
      toast.success('Book added to catalog!');
      setShowAddModal(false);
      setNewBook({
        title: '',
        author: '',
        isbn: '',
        genre: 'Technology',
        description: '',
        price: '',
        stock: '',
        publishedYear: new Date().getFullYear(),
        publisher: '',
      });
      fetchAdminData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteBook = async (bookId, title) => {
    if (!confirm(`Remove "${title}" from catalog?`)) return;
    try {
      await api.delete(`/books/${bookId}`);
      toast.success('Book removed');
      fetchAdminData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUpdateOrderStatus = async (orderId, orderStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { orderStatus });
      toast.success(`Order status updated to ${orderStatus}`);
      fetchAdminData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (isLoading || !user || user.role !== 'admin') return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-900 text-brand-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-ink-900">Admin Studio</h1>
            <p className="text-sm text-stone-500">
              Manage book inventory and fulfill customer orders.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600"
        >
          <Plus className="h-4 w-4" />
          Add New Book
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-2 border-b border-stone-200">
        <button
          onClick={() => setActiveTab('books')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
            activeTab === 'books'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-stone-500 hover:text-ink-900'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          Catalog Inventory ({books.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
            activeTab === 'orders'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-stone-500 hover:text-ink-900'
          }`}
        >
          <PackageCheck className="h-4 w-4" />
          Customer Orders ({orders.length})
        </button>
      </div>

      {/* Tab Content */}
      {loadingData ? (
        <div className="mt-8 h-64 animate-pulse rounded-2xl bg-white border border-stone-200" />
      ) : activeTab === 'books' ? (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-soft">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
              <tr>
                <th className="px-6 py-3.5">Title &amp; Author</th>
                <th className="px-6 py-3.5">Genre</th>
                <th className="px-6 py-3.5">Price</th>
                <th className="px-6 py-3.5">Stock</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {books.map((book) => (
                <tr key={book._id} className="hover:bg-stone-50/70">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-ink-900">{book.title}</p>
                    <p className="text-xs text-stone-500">{book.author}</p>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-stone-600">
                    {book.genre}
                  </td>
                  <td className="px-6 py-4 font-semibold text-ink-900">
                    {formatCurrency(book.price)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        book.stock > 5
                          ? 'bg-emerald-50 text-emerald-700'
                          : book.stock > 0
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {book.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteBook(book._id, book.title)}
                      className="rounded-lg p-2 text-stone-400 transition hover:bg-red-50 hover:text-red-600"
                      title="Delete Book"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-soft">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
              <tr>
                <th className="px-6 py-3.5">Order</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Total</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Fulfillment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-stone-50/70">
                  <td className="px-6 py-4 font-mono text-xs font-semibold">
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-ink-900">{order.user?.name || 'Customer'}</p>
                    <p className="text-xs text-stone-500">{order.user?.email}</p>
                  </td>
                  <td className="px-6 py-4 font-bold text-ink-900">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4 text-xs text-stone-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                      className="rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-ink-900 focus:border-brand-500 focus:outline-none"
                    >
                      {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(
                        (st) => (
                          <option key={st} value={st}>
                            {st.toUpperCase()}
                          </option>
                        )
                      )}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4 backdrop-blur-xs">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="font-serif text-2xl font-bold text-ink-900">Add Book to Catalog</h2>
            <form onSubmit={handleCreateBook} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-600">Title</label>
                  <input
                    required
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600">Author</label>
                  <input
                    required
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600">ISBN</label>
                  <input
                    required
                    value={newBook.isbn}
                    onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600">Genre</label>
                  <select
                    value={newBook.genre}
                    onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                  >
                    {GENRES.filter((g) => g !== 'All').map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={newBook.price}
                    onChange={(e) => setNewBook({ ...newBook, price: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600">Stock</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newBook.stock}
                    onChange={(e) => setNewBook({ ...newBook, stock: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600">Publisher</label>
                  <input
                    value={newBook.publisher}
                    onChange={(e) => setNewBook({ ...newBook, publisher: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-600">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newBook.description}
                    onChange={(e) =>
                      setNewBook({ ...newBook, description: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-ink-900 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-600"
                >
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
