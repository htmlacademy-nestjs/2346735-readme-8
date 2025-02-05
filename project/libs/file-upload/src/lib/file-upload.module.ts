import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { FileUploadController } from './file-upload.controller';

@Module({
  imports: [MulterModule.register()],
  controllers: [FileUploadController],
})
export class FileUploadModule {}
