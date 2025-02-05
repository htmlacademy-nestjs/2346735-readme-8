import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { AuthLibModule } from '@project/auth-lib';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [AuthLibModule],
  controllers: [CommentController],
  providers: [CommentService, JwtService],
})
export class CommentModule {}
