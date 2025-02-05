import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({
    description: 'The title of the tag',
    type: String,
  })
  @IsString()
  title: string;
}
