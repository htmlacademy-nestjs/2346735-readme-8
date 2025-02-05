import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SendEmailModule } from '../send-email/send-email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { resolve } from 'node:path';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    SendEmailModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: resolve(__dirname, '..', '.env'),
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
