import path from 'path';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { SharedModule } from '@project/shared';
// import { SubscriptionModule } from './subscription/subscription.module';
import { FileUploadModule } from '@project/file-upload';
import { AuthLibModule } from '@project/auth-lib';
import { MessagingModule } from '@project/messaging';
import { AmqpConnection, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { UserService } from '../user/user.service';
const ENV_USERS_FILE_PATH = path.resolve(__dirname, '../user/.env');

@Module({
  imports: [
    SharedModule,
    FileUploadModule,
    AuthLibModule,
    MessagingModule,
    // SubscriptionModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ENV_USERS_FILE_PATH,
    }),
    // RabbitMQModule.forRootAsync({
    //   useFactory: async (config: ConfigService) => ({
    //     exchanges: [
    //       {
    //         name: config.get<string>('RABBIT_QUEUE'),
    //         type: 'direct',
    //       },
    //     ],
    //     uri: `amqp://${config.get<string>('RABBIT_USER')}:${config.get<string>(
    //       'RABBIT_PASSWORD'
    //     )}@${config.get<string>('RABBIT_HOST')}:${config.get<string>(
    //       'RABBIT_PORT'
    //     )}`,
    //     connectionInitOptions: { wait: false },
    //     enableControllerDiscovery: true,
    //   }),
    //   // imports: [ConfigModule],
    //   inject: [ConfigService],
    // }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          uri: `mongodb://${configService.get<string>(
            'MONGO_USER'
          )}:${configService.get<string>(
            'MONGO_PASSWORD'
          )}@${configService.get<string>(
            'MONGO_HOST'
          )}:${configService.get<number>(
            'MONGO_PORT'
          )}/${configService.get<string>(
            'MONGO_DB'
          )}?authSource=${configService.get<string>('MONGO_AUTH_BASE')}`,
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [AppController],
  // providers: [AppService, UserService],
  providers: [AppService],
})
export class AppModule {}
