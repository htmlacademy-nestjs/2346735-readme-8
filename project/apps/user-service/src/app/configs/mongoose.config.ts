import { ConfigService } from '@nestjs/config';

export const mongooseConfig = async (configService: ConfigService) => ({
  uri: `mongodb://${configService.get<string>(
    'MONGO_USER'
  )}:${configService.get<string>('MONGO_PASSWORD')}@${configService.get<string>(
    'MONGO_HOST'
  )}:${configService.get<number>('MONGO_PORT')}/${configService.get<string>(
    'MONGO_DB'
  )}?authSource=${configService.get<string>('MONGO_AUTH_BASE')}`,
});
