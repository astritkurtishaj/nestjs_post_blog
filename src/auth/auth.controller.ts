import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Post('register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get('users')
  findAll() {
    return this.authService.findAll();
  }

  @Get('users/:id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }
  @Get('users/all/:id')
  findUserWithAll(@Param('id') id: string) {
    return this.authService.findUserWithAll(+id);
  }

  @HttpCode(204)
  @Patch('users/:id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @HttpCode(204)
  @Delete('users/:id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
