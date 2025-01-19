import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'The age of the user',
    type: Number,
  })
  age: number;

  @ApiProperty({
    description: 'The email address of the user',
    type: String,
  })
  email: string;
}
