'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpen,
  ShoppingBag,
  User,
  LogOut,
  ShieldCheck,
  Package,
  Menu,
  X,
} from 'lucide-react';
import useAuthStore from '@/store/useAuthStore';
import useCartStore from '@/store/useCartStore';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, initAuth, logout } = useAuthStore();
  const { items, openCart } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    initAuth();
  }, [initAuth]);

  const totalCount = mounted
    ? items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#FAF9F6]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-900 text-brand-400 shadow-sm transition-transform group-hover:scale-105">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <span className="font-serif text-xl font-bold tracking-tight text-ink-900">
              Folio &amp; Spine
            </span>
            <span className="hidden sm:block text-[11px] font-medium uppercase tracking-widest text-stone-500">
              Curated Book Shop
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              pathname === '/'
                ? 'text-brand-600'
                : 'text-stone-600 hover:text-ink-900'
            }`}
          >
            Catalog
          </Link>

          {user && (
            <Link
              href="/orders"
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                pathname === '/orders'
                  ? 'text-brand-600'
                  : 'text-stone-600 hover:text-ink-900'
              }`}
            >
              <Package className="h-4 w-4" />
              My Orders
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link
              href="/admin"
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                pathname.startsWith('/admin')
                  ? 'bg-brand-600 text-white'
                  : 'bg-brand-100 text-brand-800 hover:bg-brand-200'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin Studio
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Cart Trigger */}
          <button
            onClick={openCart}
            aria-label="Open Shopping Bag"
            className="relative flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3.5 py-2 text-sm font-medium text-ink-900 shadow-sm transition hover:border-stone-300 hover:bg-stone-50"
          >
            <ShoppingBag className="h-4 w-4 text-brand-600" />
            <span className="hidden sm:inline">Bag</span>
            {totalCount > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-600 px-1.5 text-[11px] font-bold text-white">
                {totalCount}
              </span>
            )}
          </button>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3 pl-2">
                <div className="flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1.5 text-xs font-medium text-ink-800">
                  <User className="h-3.5 w-3.5 text-stone-500" />
                  <span>{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="rounded-lg p-2 text-stone-500 transition hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-3.5 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-ink-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-ink-800"
                >
                  Join Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-stone-600 hover:bg-stone-100 md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-stone-200 bg-white px-4 py-4 space-y-3 md:hidden">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-ink-900 hover:bg-stone-50"
          >
            Catalog
          </Link>
          {user && (
            <Link
              href="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-ink-900 hover:bg-stone-50"
            >
              My Orders
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700"
            >
              Admin Studio
            </Link>
          )}
          <div className="border-t border-stone-100 pt-3">
            {user ? (
              <div className="flex items-center justify-between px-3">
                <span className="text-sm font-medium text-stone-700">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-600"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg border border-stone-200 py-2 text-center text-sm font-medium text-ink-900"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg bg-ink-900 py-2 text-center text-sm font-medium text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
