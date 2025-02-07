import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';

import { SendEmailService } from './send-email.service';

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
  providers: [SendEmailService],
})
export class SendEmailModule {}
