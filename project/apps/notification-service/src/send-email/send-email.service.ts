import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class SendEmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(params) {
    await this.mailerService.sendMail(params);
  }
}
