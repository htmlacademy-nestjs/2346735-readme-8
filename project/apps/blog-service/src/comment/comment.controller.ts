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

import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

import { UpdateCommentDto } from './dto/update-comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiTags('comments')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiBody({
    description: 'User ID, Post ID, and content for the new comment',
    type: Object,
  })
  async create(@Body() body: CreateCommentDto) {
    return this.commentService.create(body.userId, body.postId, body.content);
  }

  @Put(':id')
  @UseGuards(OwnerGuard)
  @ApiOperation({ summary: 'Replace an existing comment' })
  @ApiParam({ name: 'id', description: 'Comment ID', type: String })
  @ApiBody({
    description: 'New content for the comment',
    type: Object,
  })
  async replace(@Param('id') id: string, @Body() body: UpdateCommentDto) {
    return this.commentService.update(id, body.content);
  }

  @Patch(':id')
  @UseGuards(OwnerGuard)
  @ApiOperation({ summary: 'Update an existing comment' })
  @ApiParam({ name: 'id', description: 'Comment ID', type: String })
  @ApiBody({
    description: 'Updated content for the comment (optional)',
    type: Object,
  })
  async update(@Param('id') id: string, @Body() body: UpdateCommentDto) {
    if (body.content) {
      return this.commentService.update(id, body.content);
    }
    return { message: 'No changes provided' };
  }

  @Delete(':id')
  @UseGuards(OwnerGuard)
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({ name: 'id', description: 'Comment ID', type: String })
  async remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }

  @Get('post/:postId')
  @ApiOperation({ summary: 'Get all comments for a post' })
  @ApiParam({ name: 'postId', description: 'Post ID', type: String })
  async findByPost(@Param('postId') postId: string) {
    return this.commentService.findByPost(postId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all comments by a user' })
  @ApiParam({ name: 'userId', description: 'User ID', type: String })
  async findByUser(@Param('userId') userId: string) {
    return this.commentService.findByUser(userId);
  }
}
