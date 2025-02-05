import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '@project/prisma';
import { BlogPostModule } from '../blog-post/blog-post.module';
import { TagModule } from '../tag/tag.module';
import { TagService } from '../tag/tag.service';

import { FavoriteModule } from '../favorite/favorite.module';
import { FavoriteService } from '../favorite/favorite.service';

import { CommentModule } from '../comment/comment.module';
import { CommentService } from '../comment/comment.service';

import { MessagingModule } from '@project/messaging';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { resolve } from 'node:path';
import { AuthLibModule } from '@project/auth-lib';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule.forRoot('apps/blog-post/prisma/schema.prisma'),
    BlogPostModule,
    FavoriteModule,
    TagModule,
    CommentModule,
    AuthLibModule,
    MessagingModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1h'),
        },
      }),
    }),
    ConfigModule.forRoot({
      envFilePath: resolve(__dirname, '..', '.env'),
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConfigService,
    TagService,
    FavoriteService,
    CommentService,
    JwtService,
  ],
})
export class AppModule {}
