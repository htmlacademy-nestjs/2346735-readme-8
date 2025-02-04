import { Module } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'libs/auth-lib/.env',
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1h'),
        },
      }),
    }),
  ],
  providers: [AuthGuard, JwtStrategy],
  exports: [AuthGuard, JwtStrategy, ConfigModule, PassportModule],
})
export class AuthLibModule {}
