import {
  Get,
  UseGuards,
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@project/auth-lib';
// import { AuthGuard } from './auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() user: LoginDto) {
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('change-password')
  @UseGuards(AuthGuard)
  async changePassword(
    @Body() userId: string,
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    if (!userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return this.authService.changePassword(userId, changePasswordDto);
  }

  @Get('/protected')
  @UseGuards(AuthGuard)
  getProtectedData() {
    return { data: 'This is protected data' };
  }
}
