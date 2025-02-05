import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MessagingService } from './messaging.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'libs/messaging/.env',
    }),
    RabbitMQModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        exchanges: [
          {
            name: config.get<string>('RABBIT_EXCHANGE'),
            type: 'direct',
          },
        ],
        uri: `amqp://${config.get<string>('RABBIT_USER')}:${config.get<string>(
          'RABBIT_PASSWORD'
        )}@${config.get<string>('RABBIT_HOST')}:${config.get<string>(
          'RABBIT_PORT'
        )}`,
        connectionInitOptions: { wait: false },
        enableControllerDiscovery: true,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MessagingService],
  exports: [RabbitMQModule, MessagingService],
})
export class MessagingModule {}
