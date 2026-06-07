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

const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
const webhookKey = import.meta.env.VITE_N8N_WEBHOOK_KEY;

export const isReservationWebhookConfigured = (): boolean =>
  Boolean(webhookUrl && webhookKey);

export async function submitReservation(payload: ReservationPayload): Promise<void> {
  if (!webhookUrl || !webhookKey) {
    throw new Error('Webhook de reservas no configurado');
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-redirect-project-key': webhookKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Error al enviar reserva (${response.status})`);
  }
}
