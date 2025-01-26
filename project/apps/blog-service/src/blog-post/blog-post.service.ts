import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project/prisma';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

@Injectable()
export class BlogPostService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBlogPostDto: CreateBlogPostDto) {
    return this.prisma.post.create({
      data: {
        title: createBlogPostDto.title,
        description: createBlogPostDto.description,
        content: createBlogPostDto.content,
        userId: createBlogPostDto.userId,
        categories: {
          connect: createBlogPostDto.categoryIds.map((id) => ({ id })),
        },
      },
    });
  }

  async findAll({ page = 1, limit = 2, sortBy, search }) {
    const skip = (page - 1) * limit;
    const orderBy = sortBy ? { [sortBy]: 'desc' } : undefined;

    const where = search
      ? { title: { contains: search, mode: 'insensitive' } }
      : undefined;

    const [data, total] = await Promise.all([
      this.prisma.post.findMany({
        // @ts-expect-error mode insensitive with contains prisma issue https://github.com/prisma/prisma/issues/18413
        where,
        include: {
          categories: true,
          comments: true,
          favorite: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      // @ts-expect-error mode insensitive with contains prisma issue https://github.com/prisma/prisma/issues/18413
      this.prisma.post.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // async findAll() {
  //   return this.prisma.post.findMany({
  //     include: {
  //       categories: true,
  //       comments: true,
  //       favorite: true,
  //     },
  //   });
  // }

  async findOne(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        categories: true,
        comments: true,
        favorite: true,
      },
    });
  }

  async update(id: string, updateBlogPostDto: UpdateBlogPostDto) {
    return this.prisma.post.update({
      where: { id },
      data: {
        title: updateBlogPostDto.title,
        description: updateBlogPostDto.description,
        content: updateBlogPostDto.content,
        categories: {
          set: updateBlogPostDto.categoryIds.map((id) => ({ id })),
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.post.delete({
      where: { id },
    });
  }
}
