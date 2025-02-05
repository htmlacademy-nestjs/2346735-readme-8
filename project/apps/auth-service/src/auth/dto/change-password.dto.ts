import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Old password of the user',
    type: String,
  })
  @IsString()
  oldPassword: string;

  @ApiProperty({
    description: 'New password of the user (minimum 6 characters)',
    type: String,
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
