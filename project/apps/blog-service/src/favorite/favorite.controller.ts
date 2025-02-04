import { Controller, Post, Delete, Get, Param, Body } from '@nestjs/common';
import { FavoriteService } from './favorite.service';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post(':postId')
  create(@Param('postId') postId: string, @Body('userId') userId: string) {
    return this.favoriteService.create(userId, postId);
  }

  @Delete(':postId')
  remove(@Param('postId') postId: string, @Body('userId') userId: string) {
    return this.favoriteService.remove(userId, postId);
  }

  @Get(':postId/count')
  count(@Param('postId') postId: string) {
    return this.favoriteService.countByPost(postId);
  }

  @Get(':userId')
  findByUser(@Param('userId') userId: string) {
    return this.favoriteService.findByUser(userId);
  }
}
