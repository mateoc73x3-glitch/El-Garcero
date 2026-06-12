export interface ReservationPayload {
  name: string;
  email: string;
  date: string;
  time: string;
  timeLabel: string;
  guests: number;
  reason: string;
  decoration: boolean;
}

export async function submitReservation(payload: ReservationPayload): Promise<void> {
  const response = await fetch('/api/reservations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Error al enviar reserva (${response.status})`);
  }
}
