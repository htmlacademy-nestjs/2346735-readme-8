import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';

import axios from 'axios';

@Injectable()
export class SendEmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) {}

  async getRecipients() {
    // здесь фильтруем выборку, если надо не всех юзеров
    const { data } = await axios.get(
      `${this.configService.get<string>('USER_SERVICE_URL')}/api/user`
    );
    return data;
  }

  async getPosts() {
    // здесь фильтруем выборку, если надо не все посты
    const { data } = await axios.get(
      `${this.configService.get<string>('POST_SERVICE_URL')}/api/post`
    );
    return data;
  }

  @RabbitSubscribe({
    exchange: 'typoteka.users',
    routingKey: 'user.create',
    queue: 'user_notify_queue',
  })
  async sendNewUserMail(user) {
    const recipients = await this.getRecipients();

    const params = {
      to: '',
      subject: 'New user at our platform!',
      template: 'new-user',
      context: {
        name: '',
        newUsername: user.name,
      },
    };

    for (const user of recipients) {
      params.to = user.email;
      params.context.name = user.name;
      await this.mailerService.sendMail(params);
    }
  }

  @RabbitSubscribe({
    exchange: 'typoteka.posts',
    routingKey: 'post.create',
    queue: 'post_notify_queue',
  })
  async sendNewPostMail(post) {
    // здесь можно получать тех кто подписан на пользователя по post.userId
    const recipients = await this.getRecipients();

    const params = {
      to: '',
      subject: 'New post at our platform!',
      template: 'new-post',
      context: {
        name: '',
        postTitle: post.title,
      },
    };

    for (const user of recipients) {
      params.to = user.email;
      params.context.name = user.name;
      await this.mailerService.sendMail(params);
    }
  }

  @Cron('0 0 12 * * *')
  async sendDailyPostMail() {
    const recipients = await this.getRecipients();

    // Здесь посылаем фильтры если нужно
    const posts = await this.getPosts();

    const params = {
      to: '',
      subject: 'Check new posts!',
      template: 'dayli-posts',
      context: {
        name: '',
        posts,
      },
    };

    for (const user of recipients) {
      params.to = user.email;
      params.context.name = user.name;
      await this.mailerService.sendMail(params);
    }
  }
}
