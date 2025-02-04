import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogPostService } from './blog-post.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { OwnerGuard } from '@project/auth-lib';
@Controller('post')
export class BlogPostController {
  constructor(private readonly blogPostService: BlogPostService) {}

  @Post()
  create(@Body() createBlogPostDto: CreateBlogPostDto) {
    return this.blogPostService.create(createBlogPostDto);
  }

  @Post('repost')
  async repost(
    @Body() createBlogPostDto: CreateBlogPostDto,
    @Query('userId') userId: string
  ) {
    createBlogPostDto.originalPostId = createBlogPostDto.id;
    createBlogPostDto.originalUserId = createBlogPostDto.userId;
    createBlogPostDto.userId = userId;
    return this.blogPostService.create(createBlogPostDto);
  }

  @Get('count')
  count(@Query('userId') userId: string) {
    return this.blogPostService.getCountByUserId(userId);
  }

  @Get()
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: 'likesCount' | 'commentsCount',
    @Query('search') search: string,
    @Query('tags') tags: string[] = [],
    @Query('userId') userId = '',
    @Query('status') status = 'PUBLISHED',
    @Query('order') order = 'desc'
  ) {
    return this.blogPostService.findAll({
      page,
      limit,
      sortBy,
      search,
      tags,
      status,
      userId,
      order,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogPostService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(OwnerGuard)
  update(
    @Param('id') id: string,
    @Body() updateBlogPostDto: UpdateBlogPostDto
  ) {
    return this.blogPostService.update(id, updateBlogPostDto);
  }

  @Delete(':id')
  @UseGuards(OwnerGuard)
  remove(@Param('id') id: string) {
    return this.blogPostService.remove(id);
  }
}
