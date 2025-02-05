import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

import { BlogPostService } from './blog-post.service';
import { BlogPostController } from './blog-post.controller';

import { TagModule } from '../tag/tag.module';

import { rabbitMQConfig } from './configs/rabbit-mq.config';

@Module({
  imports: [
    TagModule,
    RabbitMQModule.forRootAsync({
      useFactory: async (configService: ConfigService) =>
        rabbitMQConfig(configService),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
  controllers: [BlogPostController],
  providers: [BlogPostService, JwtService],
})
export class BlogPostModule {}
