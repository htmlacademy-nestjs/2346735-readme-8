import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Get,
  Put,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { OwnerGuard } from '@project/auth-lib';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async create(
    @Body() body: { userId: string; postId: string; content: string }
  ) {
    return this.commentService.create(body.userId, body.postId, body.content);
  }

  @Put(':id')
  @UseGuards(OwnerGuard)
  async replace(@Param('id') id: string, @Body() body: { content: string }) {
    return this.commentService.update(id, body.content);
  }

  @Patch(':id')
  @UseGuards(OwnerGuard)
  async update(@Param('id') id: string, @Body() body: { content?: string }) {
    if (body.content) {
      return this.commentService.update(id, body.content);
    }
    return { message: 'No changes provided' };
  }

  @Delete(':id')
  @UseGuards(OwnerGuard)
  async remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }

  @Get('post/:postId')
  async findByPost(@Param('postId') postId: string) {
    return this.commentService.findByPost(postId);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.commentService.findByUser(userId);
  }
}
