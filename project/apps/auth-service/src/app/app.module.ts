import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { resolve } from 'node:path';
import { AuthLibModule } from '@project/auth-lib';
@Module({
  imports: [
    AuthLibModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: resolve(__dirname, '..', '.env'),
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
