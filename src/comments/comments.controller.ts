import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@UseGuards(JwtGuard)
@Controller(':postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(
    @Param('postId') postId: string,
    @GetUser() user: User,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(+postId, user.id, createCommentDto);
  }

  @Get()
  findAll(@Param('postId') postId: string) {
    return this.commentsService.findAll(+postId);
  }

  @Get(':id')
  findOne(@Param() params: string) {
    return this.commentsService.findOne(params);
  }

  @Patch(':id')
  update(
    @Param() params: string,
    @GetUser() user: User,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(params, user, updateCommentDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.commentsService.remove(+id, user);
  }
}
