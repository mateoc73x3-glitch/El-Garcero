import { create } from 'zustand';
import type { ReservationInput } from '../types/domain';

interface ReservationState {
  reservations: ReservationInput[];
  addReservation: (reservation: ReservationInput) => void;
}

export const useReservationStore = create<ReservationState>((set) => ({
  reservations: [],
  addReservation: (reservation) =>
    set((state) => ({
      reservations: [reservation, ...state.reservations],
    })),
}));
