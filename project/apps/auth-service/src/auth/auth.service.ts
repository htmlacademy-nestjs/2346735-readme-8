import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    // if (!user) {
    //   throw new Error('Invalid email or password');
    // }

    const payload = { username: user.email, userId: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string) {
    // const user = await this.userService.findOneByEmail(email);
    // if (user && (await user.comparePassword(password))) {
    //   return user;
    // }
    return null;
  }
}
