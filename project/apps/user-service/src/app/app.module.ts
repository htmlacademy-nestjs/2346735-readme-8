import path from 'path';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { SharedModule } from '@project/shared';
import { SubscriptionModule } from './subscription/subscription.module';

const ENV_USERS_FILE_PATH = path.resolve(__dirname, '../user/.env');

@Module({
  imports: [
    SharedModule,
    SubscriptionModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ENV_USERS_FILE_PATH,
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
