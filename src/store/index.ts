import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Booking, BookingStatus } from '../models';
import { ADMIN_CREDENTIALS } from '../services/data';

// ── BOOKING STORE ─────────────────────────────────────────────────
interface BookingStore {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Booking;
  updateStatus: (id: string, status: BookingStatus) => void;
  deleteBooking: (id: string) => void;
  getBookingsByDate: (date: string) => Booking[];
  getBookedTimes: (date: string, professionalId: string) => string[];
}

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      bookings: [],

      addBooking: (data) => {
        const booking: Booking = {
          ...data,
          id: `bk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          createdAt: new Date().toISOString(),
        };
        set(s => ({ bookings: [...s.bookings, booking] }));
        return booking;
      },

      updateStatus: (id, status) =>
        set(s => ({
          bookings: s.bookings.map(b => b.id === id ? { ...b, status } : b),
        })),

      deleteBooking: (id) =>
        set(s => ({ bookings: s.bookings.filter(b => b.id !== id) })),

      getBookingsByDate: (date) =>
        get().bookings.filter(b => b.date === date),

      getBookedTimes: (date, professionalId) =>
        get().bookings
          .filter(b => b.date === date && b.professionalId === professionalId && b.status !== 'cancelled')
          .map(b => b.time),
    }),
    { name: 'lumie-bookings' }
  )
);

// ── AUTH STORE ────────────────────────────────────────────────────
interface AuthStore {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,

      login: (username, password) => {
        const ok =
          username === ADMIN_CREDENTIALS.username &&
          password === ADMIN_CREDENTIALS.password;
        if (ok) set({ isAuthenticated: true });
        return ok;
      },

      logout: () => set({ isAuthenticated: false }),
    }),
    { name: 'lumie-auth' }
  )
);
