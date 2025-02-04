import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class SendEmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(params) {
    const { to, subject, template, context } = params;
    await this.mailerService.sendMail({
      to,
      subject,
      template, // Имя шаблона (без .hbs)
      context,
    });
  }
}
