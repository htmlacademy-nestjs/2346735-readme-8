import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('send')
  async sendEmail(@Query('to') to: string) {
    await this.appService.sendWelcomeEmail({
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
