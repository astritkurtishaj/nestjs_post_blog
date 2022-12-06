import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { NotFoundError } from '@prisma/client/runtime';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaClient) {}

  async create(
    postId: number,
    userId: number,
    createCommentDto: CreateCommentDto,
  ) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundError('Not found');
    }

    return await this.prisma.comment.create({
      data: {
        post_id: postId,
        user_id: userId,
        body: createCommentDto.body,
      },
    });
  }

  async findAll(postId: number) {
    return await this.prisma.comment.findMany({
      where: {
        post_id: postId,
      },
    });
  }

  async findOne(params: any) {
    try {
      return await this.prisma.comment.findFirstOrThrow({
        where: {
          id: +params.id,
          post_id: +params.postId,
        },
      });
    } catch (error) {
      return error;
    }
  }

  async update(params: any, user: User, updateCommentDto: UpdateCommentDto) {
    const comment = await this.prisma.comment.findUniqueOrThrow({
      where: {
        id: +params.id,
      },
    });

    if (user.id !== comment.user_id) {
      throw new ForbiddenException(
        'You are not allowed to perform this action!',
      );
    }

    return await this.prisma.comment.update({
      where: {
        id: +params.id,
      },
      data: {
        ...updateCommentDto,
      },
    });
  }

  async remove(id: number, user: User) {
    const comment = await this.prisma.comment.findUniqueOrThrow({
      where: {
        id: id,
      },
    });

    if (user.id !== comment.user_id) {
      throw new ForbiddenException(
        'You are not allowed to perform this action!',
      );
    }

    await this.prisma.comment.delete({
      where: {
        id: id,
      },
    });
  }
}
