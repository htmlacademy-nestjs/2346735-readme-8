import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class MessagingService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async publish(exchange: string, routingKey: string, message: any) {
    await this.amqpConnection.publish(exchange, routingKey, message);
  }
}
