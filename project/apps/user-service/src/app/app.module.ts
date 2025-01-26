import path from 'path';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { SharedModule } from '@project/shared';

const ENV_USERS_FILE_PATH = path.resolve(__dirname, '../user/.env');

@Module({
  imports: [
    SharedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ENV_USERS_FILE_PATH,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        console.log(configService.get<string>('MONGO_USER'));
        console.log(configService.get<string>('MONGO_PASSWORD'));
        console.log(configService.get<string>('MONGO_HOST'));
        console.log(configService.get<number>('MONGO_PORT'));
        console.log(configService.get<string>('MONGO_DB'));

        const uri = `mongodb://${configService.get<string>(
          'MONGO_USER'
        )}:${configService.get<string>(
          'MONGO_PASSWORD'
        )}@${configService.get<string>(
          'MONGO_HOST'
        )}:${configService.get<number>(
          'MONGO_PORT'
        )}/${configService.get<string>('MONGO_DB')}`;
        console.log(uri);

        // return {
        //   uri: `mongodb://${configService.get<string>(
        //     'MONGO_USER'
        //   )}:${configService.get<string>(
        //     'MONGO_PASSWORD'
        //   )}@${configService.get<string>(
        //     'MONGO_HOST'
        //   )}:${configService.get<number>('MONGO_PORT')}/admin`,
        // };

        return {
          uri: `mongodb://${configService.get<string>(
            'MONGO_USER'
          )}:${configService.get<string>(
            'MONGO_PASSWORD'
          )}@${configService.get<string>(
            'MONGO_HOST'
          )}:${configService.get<number>(
            'MONGO_PORT'
          )}/${configService.get<string>('MONGO_DB')}?authSource=admin`,
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
