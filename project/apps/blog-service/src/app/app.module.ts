import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '@project/prisma';
import { BlogPostModule } from '../blog-post/blog-post.module';

@Module({
  imports: [
    PrismaModule.forRoot('apps/blog-post/prisma/schema.prisma'),
    BlogPostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
