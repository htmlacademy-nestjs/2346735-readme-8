import { Get, UseGuards, Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@project/auth-lib';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login to the system' })
  @ApiBody({ type: LoginDto })
  async login(@Body() user: LoginDto) {
    return this.authService.login(user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('change-password')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Change user password' })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(
    @Body() body: { userId: string; changePasswordDto: ChangePasswordDto }
  ) {
    return this.authService.changePassword(body);
  }

  @Get('/protected')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Access protected data' })
  getProtectedData() {
    return { data: 'This is protected data' };
  }
}
