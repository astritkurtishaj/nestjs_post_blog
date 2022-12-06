import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreateAuthDto } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  email?: string;
}
