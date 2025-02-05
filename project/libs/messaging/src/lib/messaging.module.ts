// import { Module } from '@nestjs/common';
// import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
// import { MessagingService } from './messaging.service';
// import { ConfigModule, ConfigService } from '@nestjs/config';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//       envFilePath: 'libs/messaging/.env',
//     }),
//     RabbitMQModule.forRootAsync({
//       useFactory: async (config: ConfigService) => ({
//         exchanges: [
//           {
//             name: config.get<string>(`rabbit.queue`),
//             type: 'direct',
//           },
//         ],
//         uri: `amqp://${config.get<string>('rabbit.user')}:${config.get<string>(
//           'rabbit.password'
//         )}@${config.get<string>('rabbit.host')}:${config.get<string>(
//           'rabbit.port'
//         )}`,
//         connectionInitOptions: { wait: false },
//         enableControllerDiscovery: true,
//       }),
//       inject: [ConfigService],
//     }),
//   ],
//   providers: [MessagingService],
//   exports: [RabbitMQModule, ConfigService, MessagingService],
// })
// export class MessagingModule {}

import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { MessagingService } from './messaging.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
            name: config.get<string>('RABBIT_QUEUE'),
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
