import { Module } from '@nestjs/common';
import { BlogPostService } from './blog-post.service';
import { BlogPostController } from './blog-post.controller';
import { TagModule } from '../tag/tag.module';

@Module({
  controllers: [BlogPostController],
  providers: [BlogPostService],
  imports: [TagModule],
})
export class BlogPostModule {}
