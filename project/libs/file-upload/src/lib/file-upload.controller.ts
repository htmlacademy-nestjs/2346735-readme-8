import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Body,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { ensureDir } from 'fs-extra';
import { diskStorage } from 'multer';
import * as mime from 'mime-types';
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: async (req, file, callback) => {
          const currentYear = new Date().getFullYear();
          const currentMonth = String(new Date().getMonth() + 1).padStart(
            2,
            '0'
          );

          const uploadPath = join(
            'uploads',
            currentYear.toString(),
            currentMonth
          );

          await ensureDir(uploadPath);

          callback(null, uploadPath);
        },
        filename: async (req, file, callback) => {
          const extension = mime.extension(file.mimetype);
          const uniqueName = `${randomUUID()}.${extension}`;

          callback(null, uniqueName);
        },
      }),
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
      fileFilter: (req, file, callback) => {
        const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];

        if (!allowedMimes.includes(file.mimetype)) {
          return callback(new Error('Тип файла не разрешен'), false);
        }

        callback(null, true);
      },
    })
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('File is not uploaded');
    }

    return {
      originalName: file.originalname,
      savedName: file.filename,
    };
  }
}
