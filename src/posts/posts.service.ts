import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, User } from '@prisma/client';
import { NotFoundError } from '@prisma/client/runtime';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaClient) {}

  async create(user: User, createPostDto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        user_id: user.id,
        ...createPostDto,
      },
    });
  }

  async findAll(userId: number) {
    return await this.prisma.post.findMany({
      where: {
        user_id: userId,
      },
    });
  }

  async findOne(id: number) {
    try {
      return await this.prisma.post.findFirstOrThrow({
        where: {
          id: id,
        },
        include: {
          comments: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.NotFoundError) {
        throw new NotFoundError('Not found');
      }
      return error;
    }
  }

  async update(id: number, user: User, updatePostDto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: id,
      },
    });

    if (!post || post.user_id !== user.id) {
      throw new ForbiddenException(
        'You are not allowed to perform this action!',
      );
    }

    return await this.prisma.post.update({
      where: {
        id: id,
      },
      data: {
        ...updatePostDto,
      },
    });
  }

  async remove(id: number, user: User) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: id,
      },
    });

    if (!post || post.user_id !== user.id) {
      throw new ForbiddenException(
        'You are not allowed to perform this action!',
      );
    }

    return this.prisma.post.delete({
      where: {
        id: id,
      },
    });
  }
}
