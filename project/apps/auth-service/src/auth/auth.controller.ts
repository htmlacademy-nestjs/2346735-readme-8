import { Get, UseGuards, Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() user: any) {
    return this.authService.login(user);
  }

  @Get('/protected')
  @UseGuards(AuthGuard)
  getProtectedData() {
    return 'This is protected data';
  }
}
