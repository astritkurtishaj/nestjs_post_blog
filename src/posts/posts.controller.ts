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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@GetUser() user: User, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(user, createPostDto);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.postsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @HttpCode(204)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(+id, user, updatePostDto);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.postsService.remove(+id, user);
  }
}
