import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailerModule } from '@nestjs-modules/mailer';
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'localhost',
        port: 8025,
        secure: false,
        auth: {
          user: '',
          pass: '',
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
