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
import { UserModule } from '../user/user.module';

import { mongooseConfig } from './configs/mongoose.config';

@Module({
  imports: [
    SharedModule,
    FileUploadModule,
    AuthLibModule,
    MessagingModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolve(__dirname, '../user/.env'),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        mongooseConfig(configService),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
