import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.entity';

import { rabbitMQConfig } from './configs/rabbit-mq.config';

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      useFactory: async (configService: ConfigService) =>
        rabbitMQConfig(configService),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
