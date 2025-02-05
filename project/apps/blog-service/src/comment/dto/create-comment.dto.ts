import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'ID of the user who is creating the comment',
    type: String,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'ID of the post the comment is related to',
    type: String,
  })
  @IsString()
  postId: string;

  @ApiProperty({
    description: 'Content of the comment',
    type: String,
  })
  @IsString()
  content: string;
}
