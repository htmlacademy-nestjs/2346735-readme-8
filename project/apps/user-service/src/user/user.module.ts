import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        exchanges: [
          {
            name: config.get<string>('RABBIT_QUEUE'),
            type: 'direct',
          },
        ],
        uri: `amqp://${config.get<string>('RABBIT_USER')}:${config.get<string>(
          'RABBIT_PASSWORD'
        )}@${config.get<string>('RABBIT_HOST')}:${config.get<string>(
          'RABBIT_PORT'
        )}`,
        connectionInitOptions: { wait: false },
        enableControllerDiscovery: true,
      }),
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
