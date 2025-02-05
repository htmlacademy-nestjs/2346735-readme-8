import { Controller, Post, Delete, Get, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

import { FavoriteService } from './favorite.service';

@ApiTags('favorites')
@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post(':postId')
  @ApiOperation({ summary: 'Add a post to user favorites' })
  @ApiParam({ name: 'postId', description: 'ID of the post', type: String })
  @ApiBody({ description: 'User ID', type: String })
  create(@Param('postId') postId: string, @Body('userId') userId: string) {
    return this.favoriteService.create(userId, postId);
  }

  @Delete(':postId')
  @ApiOperation({ summary: 'Remove a post from user favorites' })
  @ApiParam({ name: 'postId', description: 'ID of the post', type: String })
  @ApiBody({ description: 'User ID', type: String })
  remove(@Param('postId') postId: string, @Body('userId') userId: string) {
    return this.favoriteService.remove(userId, postId);
  }

  @Get(':postId/count')
  @ApiOperation({ summary: 'Get the count of users who favorited a post' })
  @ApiParam({ name: 'postId', description: 'ID of the post', type: String })
  count(@Param('postId') postId: string) {
    return this.favoriteService.countByPost(postId);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get all favorites by user ID' })
  @ApiParam({ name: 'userId', description: 'ID of the user', type: String })
  findByUser(@Param('userId') userId: string) {
    return this.favoriteService.findByUser(userId);
  }
}
