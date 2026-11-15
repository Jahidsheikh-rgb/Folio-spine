'use client';

import { create } from 'zustand';
import api from '@/lib/api';

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: true,

  initAuth: async () => {
    if (typeof window === 'undefined') return;
    const savedToken = localStorage.getItem('bookshop_token');
    if (!savedToken) {
      set({ user: null, token: null, isLoading: false });
      return;
    }

    try {
      set({ token: savedToken, isLoading: true });
      const res = await api.get('/auth/me');
      set({ user: res.data.data.user, isLoading: false });
    } catch {
      localStorage.removeItem('bookshop_token');
      set({ user: null, token: null, isLoading: false });
    }
  },

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, data } = res.data;
    localStorage.setItem('bookshop_token', token);
    set({ user: data.user, token });
    return data.user;
  },

  register: async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    const { token, data } = res.data;
    localStorage.setItem('bookshop_token', token);
    set({ user: data.user, token });
    return data.user;
  },

  logout: () => {
    localStorage.removeItem('bookshop_token');
    set({ user: null, token: null });
  },

  isAdmin: () => get().user?.role === 'admin',
}));

export default useAuthStore;
