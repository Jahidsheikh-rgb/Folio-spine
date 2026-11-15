'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (book, quantity = 1) => {
        const items = get().items;
        const existingIndex = items.findIndex((i) => i.book._id === book._id);

        if (existingIndex > -1) {
          const updated = [...items];
          const nextQty = Math.min(book.stock, updated[existingIndex].quantity + quantity);
          updated[existingIndex] = { ...updated[existingIndex], book, quantity: nextQty };
          set({ items: updated, isOpen: true });
        } else {
          set({
            items: [...items, { book, quantity: Math.min(book.stock, quantity) }],
            isOpen: true,
          });
        }
      },

      updateQuantity: (bookId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(bookId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.book._id === bookId
              ? { ...item, quantity: Math.min(item.book.stock, quantity) }
              : item
          ),
        });
      },

      removeItem: (bookId) => {
        set({
          items: get().items.filter((item) => item.book._id !== bookId),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((sum, item) => sum + item.book.price * item.quantity, 0),
    }),
    {
      name: 'bookshop-cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export default useCartStore;
