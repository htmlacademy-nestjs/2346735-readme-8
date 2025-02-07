import { HttpException, HttpStatus } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import axios from 'axios';
import { compare, hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED
      );
    }

    const payload = { username: user.email, userId: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    const { data: existingUser } = await axios.get(
      `${this.configService.get<string>(
        'USER_SERVICE_URL'
      )}/api/user-by-email?email=${email}`
    );

    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await hash(password, 10);

    const { data: newUser } = await axios.post(
      `${this.configService.get<string>('USER_SERVICE_URL')}/api/user`,
      { email, password: hashedPassword, name }
    );

    const payload = { username: newUser.email, userId: newUser.id };

    return {
      message: 'User registered successfully',
      token: this.jwtService.sign(payload),
    };
  }

  async changePassword({
    userId,
    changePasswordDto,
  }: {
    userId: string;
    changePasswordDto: ChangePasswordDto;
  }) {
    const { oldPassword, newPassword } = changePasswordDto;

    const { data: user } = await axios.get(
      `${this.configService.get<string>('USER_SERVICE_URL')}/api/user/${userId}`
    );

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Incorrect old password', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await hash(newPassword, 10);

    await axios.patch(
      `${this.configService.get<string>(
        'USER_SERVICE_URL'
      )}/api/user/${userId}`,
      {
        password: hashedPassword,
      }
    );

    return { message: 'Password changed successfully' };
  }

  async validateUser(
    email: string,
    password: string
  ): Promise<{ email: string; id: string } | null> {
    try {
      const { data: user } = await axios.get(
        `${this.configService.get<string>(
          'USER_SERVICE_URL'
        )}/api/user-by-email?email=${email}`
      );

      if (!user) {
        return null;
      }

      const isPasswordValid = await compare(password, user.password);

      return isPasswordValid ? user : null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
