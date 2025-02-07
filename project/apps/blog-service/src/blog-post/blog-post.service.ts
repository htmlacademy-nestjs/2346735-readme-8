import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '@project/prisma';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Prisma } from '@prisma/client';

@Injectable()
export class BlogPostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly amqpConnection: AmqpConnection
  ) {}

  async create(createBlogPostDto: CreateBlogPostDto) {
    //  c тегами ещё можно сделать чтоб их триммить и привродить к нижнему регистру
    //  перед проверкой и сохранением, но это, думаю, ладно, для тестового проекта и так сойдёт

    try {
      let params = {};

      if (!createBlogPostDto.tags.length) {
        delete createBlogPostDto.tags;
      }

      const tagTitles =
        createBlogPostDto.tags?.length > 0 ? createBlogPostDto.tags : null;

      const createdPost = {
        data: Object.entries(createBlogPostDto).reduce((acc, [key, value]) => {
          if (value !== undefined) acc[key] = value;
          return acc;
        }, {}),
      };

      if (tagTitles?.length) {
        const existingTags = await this.prisma.tag.findMany({
          where: { title: { in: tagTitles } },
        });

        const existingTagTitles = existingTags.map((tag) => tag.title);

        const newTagTitles = tagTitles.filter(
          (title) => !existingTagTitles.includes(title)
        );

        if (newTagTitles.length > 0) {
          const newTags = await Promise.all(
            newTagTitles.map((title) =>
              this.prisma.tag.create({ data: { title } })
            )
          );

          const allTagIds = [...existingTags, ...newTags].map((tag) => ({
            id: tag.id,
          }));

          // @ts-expect-error it is okkkk
          createdPost.data.tags = {
            connect: allTagIds,
          };

          params = { include: { tags: true } };
        }
      }

      await this.amqpConnection.publish(
        this.configService.get<string>('RABBIT_EXCHANGE'),
        'post.create',
        createdPost
      );

      // @ts-expect-error it is okkkk
      return this.prisma.post.create({
        ...createdPost,
        ...params,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Пост с таким заголовком уже существует');
      } else if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Некорректные данные для поста');
      } else {
        throw new InternalServerErrorException('Не удалось создать пост');
      }
    }
  }

  async findAll({
    page = 1,
    limit = 10,
    sortBy,
    search,
    order = 'desc',
    tags,
    userId,
    status = 'PUBLISHED',
  }) {
    const skip = (page - 1) * limit;
    console.log('limit', limit);
    console.log('page', page);
    console.log('skip', skip);

    const validSortFields = {
      likesCount: { favorite: { _count: order } },
      commentsCount: { comments: { _count: order } },
      createdAt: { createdAt: order },
      title: { title: order },
    };

    const orderBy =
      sortBy && validSortFields[sortBy]
        ? validSortFields[sortBy]
        : { createdAt: 'desc' };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      status,
    };

    if (userId) {
      where.userId = userId;
    }

    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    if (tags?.length) {
      where.tags = {
        some: {
          title: { in: tags },
        },
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          comments: true,
          favorite: true,
          status: true,
          type: true,
          userId: true,
          _count: {
            select: {
              comments: true,
              favorite: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.post.count({ where }),
    ]);

    const userIds = [...new Set(data.map((post) => post.userId))];

    const { data: users } = await axios.post(
      `${this.configService.get<string>('USER_SERVICE_URL')}/api/batch`,
      { userIds }
    );

    const usersMap = new Map(users.map((user) => [user._id, user]));

    data.forEach((item) => {
      // @ts-expect-error it is okkkk
      item.user = usersMap.get(item.userId) || null;
      // @ts-expect-error it is okkkk
      item.isRepost = !!item.originalPostId && !!item.originalUserId;
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        tags: true,
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
        tags: {
          set: updateBlogPostDto.tags.map((id) => ({ id })),
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.post.delete({
      where: { id },
    });
  }

  async getPostCountByUserId(userId: string) {
    const postCount = await this.prisma.post.count({ where: { userId } });
    return { postCount };
  }
}
