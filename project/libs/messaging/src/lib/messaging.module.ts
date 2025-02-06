import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MessagingService } from './messaging.service';
import { rabbitMQConfig } from './configs/rabbit-mq.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'libs/messaging/.env',
    }),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      useFactory: async (configService: ConfigService) =>
        rabbitMQConfig(configService),
      inject: [ConfigService],
    }),
  ],
  providers: [MessagingService],
  exports: [RabbitMQModule, MessagingService],
})
export class MessagingModule {}
