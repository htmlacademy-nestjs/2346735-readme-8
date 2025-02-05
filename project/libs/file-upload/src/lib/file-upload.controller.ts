import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import { ensureDir } from 'fs-extra';

import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';

import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';
import * as mime from 'mime-types';

@ApiTags('file-upload')
@Controller('file-upload')
export class FileUploadController {
  @Post('upload')
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'The file to be uploaded',
    type: 'multipart/form-data',
  })
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
        fileSize: 2 * 1024 * 1024, // 2 MB limit
      },
      fileFilter: (req, file, callback) => {
        const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];

        if (!allowedMimes.includes(file.mimetype)) {
          return callback(new Error('Invalid file type'), false);
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
