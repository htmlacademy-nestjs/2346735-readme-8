import { resolve } from 'node:path';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { SharedModule } from '@project/shared';
import { FileUploadModule } from '@project/file-upload';
import { AuthLibModule } from '@project/auth-lib';
import { MessagingModule } from '@project/messaging';

import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { SubscriptionModule } from './subscription/subscription.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    SharedModule,
    FileUploadModule,
    AuthLibModule,
    MessagingModule,
    // SubscriptionModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolve(__dirname, '../user/.env'),
    }),
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
  providers: [AppService],
})
export class AppModule {}
