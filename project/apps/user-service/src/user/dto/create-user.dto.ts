import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The email address of the user',
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 12)
  password: string;

  @ApiProperty({
    description: 'The avatar of the user',
    type: String,
  })
  @IsString()
  @IsOptional()
  avatar?: string;
}
