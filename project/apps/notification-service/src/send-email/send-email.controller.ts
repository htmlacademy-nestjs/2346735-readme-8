import { Controller, Get, Query } from '@nestjs/common';
import { SendEmailService } from './send-email.service';
@Controller()
export class SendEmailController {
  constructor(private readonly sendEmailService: SendEmailService) {}

  @Get('send')
  async sendEmail(@Query('to') to: string) {
    await this.sendEmailService.sendWelcomeEmail({
      to,
      subject: 'Welcome to our platform!',
      template: 'welcome',
      context: {
        name: 'nameeeeee',
        email: 'afaefaefaefasfasef',
        plan: 'pfafaefasefasefasef',
      },
    });

    return { message: 'Email sent successfully' };
  }
}
