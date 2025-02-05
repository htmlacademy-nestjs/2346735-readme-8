import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';

import { SendEmailController } from './send-email.controller';
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
  controllers: [SendEmailController],
  providers: [SendEmailService],
})
export class SendEmailModule {}
