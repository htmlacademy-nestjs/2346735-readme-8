import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project/prisma';
import { Comment } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    postId: string,
    content: string
  ): Promise<Comment> {
    return this.prisma.comment.create({
      data: { userId, postId, content },
    });
  }

  async update(commentId: string, content: string): Promise<Comment> {
    return this.prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });
  }

  async remove(commentId: string): Promise<Comment> {
    return this.prisma.comment.delete({
      where: { id: commentId },
    });
  }

  async findByPost(postId: string): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUser(userId: string): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
