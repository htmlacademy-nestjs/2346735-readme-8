import { Module } from '@nestjs/common';
import { BlogPostService } from './blog-post.service';
import { BlogPostController } from './blog-post.controller';
// import { PrismaModule } from '@project/prisma';
// import { BlogPostModule } from './blog-post/blog-post.module';

@Module({
  // imports: [PrismaModule],
  controllers: [BlogPostController],
  providers: [BlogPostService],
})
export class BlogPostModule {}
