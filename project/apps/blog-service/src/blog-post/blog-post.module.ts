import { Module } from '@nestjs/common';
import { BlogPostService } from './blog-post.service';
import { BlogPostController } from './blog-post.controller';
import { TagModule } from '../tag/tag.module';
import { JwtService } from '@nestjs/jwt';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TagModule,
    RabbitMQModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        exchanges: [
          {
            name: config.get<string>('RABBIT_EXCHANGE'),
            type: 'direct',
          },
        ],
        uri: `amqp://${config.get<string>('RABBIT_USER')}:${config.get<string>(
          'RABBIT_PASSWORD'
        )}@${config.get<string>('RABBIT_HOST')}:${config.get<string>(
          'RABBIT_PORT'
        )}`,
        connectionInitOptions: { wait: false },
        enableControllerDiscovery: true,
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
  controllers: [BlogPostController],
  providers: [BlogPostService, JwtService],
})
export class BlogPostModule {}
