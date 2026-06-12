import {
  BadGatewayException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private readonly config: ConfigService) {}

  async submit(payload: CreateReservationDto): Promise<void> {
    const webhookUrl = this.config.get<string>('N8N_WEBHOOK_URL');
    const webhookKey = this.config.get<string>('N8N_WEBHOOK_KEY');

    if (!webhookUrl || !webhookKey) {
      throw new ServiceUnavailableException('Webhook de reservas no configurado');
    }

    let response: Response;

    try {
      response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-redirect-project-key': webhookKey,
        },
        body: JSON.stringify(payload),
      });
    } catch {
      throw new BadGatewayException('No se pudo contactar el servicio de reservas');
    }

    if (!response.ok) {
      throw new BadGatewayException(`Error al enviar reserva (${response.status})`);
    }
  }
}
