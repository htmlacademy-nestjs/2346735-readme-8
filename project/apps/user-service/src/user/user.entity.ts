import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { IUser } from './user.interface';

@Schema({ timestamps: true })
export class User extends Document implements IUser {
  @Prop({ required: true })
  @ApiProperty({
    description: 'The name of the user',
    type: String,
    example: 'John Doe',
  })
  @IsString()
  @Length(3, 50)
  name: string;

  @Prop({ required: true, unique: true })
  @ApiProperty({
    description: 'The email of the user',
    type: String,
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @Prop({ required: true })
  @ApiProperty({
    description: 'The password of the user',
    type: String,
    example: 'password123',
  })
  @IsString()
  @Length(6, 12)
  password: string;

  @Prop({ required: false })
  @ApiProperty({
    description: 'The avatar URL of the user',
    type: String,
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsString()
  // Ограничения: не больше 500 килобайт, формат jpg или png. в multer
  avatar: string;

  async hashPassword() {
    if (this.isModified('password') || this.isNew) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

export { UserSchema };
