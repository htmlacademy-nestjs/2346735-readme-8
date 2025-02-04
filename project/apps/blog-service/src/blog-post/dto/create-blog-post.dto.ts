import {
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
  IsArray,
  IsEnum,
} from 'class-validator';
import { PostStatus, PostType } from '@prisma/client';
export class CreateBlogPostDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 50)
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  originalPostId?: string;

  @IsString()
  @IsOptional()
  originalUserId?: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(PostStatus)
  @IsNotEmpty()
  status: PostStatus;

  @IsEnum(PostType)
  @IsNotEmpty()
  type: PostType;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  photoSrc?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  announcement?: string;

  @IsString()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  videoUrl?: string;
}
