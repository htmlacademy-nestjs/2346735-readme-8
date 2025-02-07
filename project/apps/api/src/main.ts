// API Gateway example

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { RequestIdInterceptor } from '@project/interceptors';

import { AppModule } from './app/app.module';

const GLOBAL_PREFIX = 'api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(GLOBAL_PREFIX);

  app.useGlobalInterceptors(new RequestIdInterceptor());

  const port = process.env.PORT;

  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${GLOBAL_PREFIX}`
  );
}

bootstrap();
