'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Calendar, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import useAuthStore from '@/store/useAuthStore';
import { formatCurrency, formatDate } from '@/lib/utils';

const statusStyles = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

export default function OrdersPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      api
        .get('/orders/my-orders')
        .then((res) => setOrders(res.data.data.orders || []))
        .catch((err) => toast.error(err.message))
        .finally(() => setLoading(false));
    }
  }, [user, isLoading, router]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
          <Package className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink-900">Order History</h1>
          <p className="text-sm text-stone-500">Track your book deliveries and receipts.</p>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl bg-white border border-stone-200" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-stone-300 bg-white p-12 text-center">
          <p className="font-serif text-xl font-bold text-ink-900">No orders yet</p>
          <p className="mt-1 text-sm text-stone-500">
            Once you place an order, its fulfillment status will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-soft"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 bg-stone-50/80 px-6 py-4">
                <div className="flex flex-wrap items-center gap-6 text-xs">
                  <div>
                    <span className="uppercase tracking-wider text-stone-400">Order ID</span>
                    <p className="mt-0.5 font-mono font-semibold text-ink-900">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <span className="flex items-center gap-1 uppercase tracking-wider text-stone-400">
                      <Calendar className="h-3 w-3" /> Placed On
                    </span>
                    <p className="mt-0.5 font-semibold text-ink-900">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div>
                    <span className="uppercase tracking-wider text-stone-400">Total</span>
                    <p className="mt-0.5 font-bold text-ink-900">
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                    statusStyles[order.orderStatus] || 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {order.orderStatus}
                </span>
              </div>

              {/* Order Items */}
              <div className="divide-y divide-stone-100 px-6 py-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2.5 text-sm">
                    <div>
                      <p className="font-semibold text-ink-900">{item.title}</p>
                      <p className="text-xs text-stone-500">
                        Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                    <span className="font-semibold text-ink-900">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Shipping Footer */}
              <div className="flex items-center gap-2 border-t border-stone-100 bg-stone-50/40 px-6 py-3 text-xs text-stone-500">
                <MapPin className="h-3.5 w-3.5 text-stone-400" />
                <span>
                  Delivering to: {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                  {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
