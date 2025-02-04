import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { SendEmailService } from './send-email.service';
import { join } from 'node:path';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: configService.get<number>('MAIL_PORT'),
          secure: false,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        template: {
          dir:
            process.env.NODE_ENV === 'production'
              ? join(
                  __dirname,
                  '..',
                  '..',
                  'dist',
                  'libs',
                  'send-email',
                  'templates'
                )
              : join(
                  __dirname,
                  '..',
                  '..',
                  'libs',
                  'send-email',
                  'src',
                  'lib',
                  'templates'
                ),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [SendEmailService],
  exports: [MailerModule],
})
export class SendEmailModule {}
