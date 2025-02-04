import { Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { PrismaService } from '@project/prisma';
import { Favorite } from '@prisma/client';

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, postId: string): Promise<Favorite> {
    return this.prisma.favorite.create({
      data: { userId, postId },
    });
  }

  async remove(userId: string, postId: string): Promise<Favorite> {
    return this.prisma.favorite.delete({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });
  }

  async countByPost(postId: string): Promise<number> {
    return this.prisma.favorite.count({
      where: { postId },
    });
  }

  async findByUser(userId: string): Promise<Favorite[]> {
    return this.prisma.favorite.findMany({
      where: { userId },
    });
  }
}
