import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async login(loginAuthDto: LoginAuthDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: loginAuthDto.email,
        },
      });

      if (!user) {
        throw new ForbiddenException('Credentials not matched!');
      }

      const pwdMatched = await argon.verify(
        user.password,
        loginAuthDto.password,
      );

      if (!pwdMatched) {
        throw new ForbiddenException('Credentials not matched!');
      }

      return this.signToken(user.id, user.email);
    } catch (error) {
      return error;
    }
  }
  async create(createAuthDto: CreateAuthDto) {
    try {
      const pwd = await argon.hash(createAuthDto.password);
      const user = await this.prisma.user.create({
        data: {
          email: createAuthDto.email,
          name: createAuthDto.name,
          password: pwd,
        },
        select: {
          email: true,
          name: true,
          id: true,
        },
      });
      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Credentials taken');
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.user.findFirst({
      where: {
        id: id,
      },
    });
  }

  async findUserWithAll(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        posts: {
          include: {
            comments: true,
          },
        },
      },
    });
  }

  async update(id: number, updateAuthDto: UpdateAuthDto) {
    return await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        ...updateAuthDto,
      },
      select: {
        email: true,
        name: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.user.delete({
      where: {
        id: id,
      },
    });
  }

  async signToken(userId: number, email: string) {
    const payload = {
      id: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return {
      token,
    };
  }
}
