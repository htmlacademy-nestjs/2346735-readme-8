import { Module } from '@nestjs/common';
import { BlogPostService } from './blog-post.service';
import { BlogPostController } from './blog-post.controller';
import { TagModule } from '../tag/tag.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TagModule],
  controllers: [BlogPostController],
  providers: [BlogPostService, JwtService],
})
export class BlogPostModule {}
