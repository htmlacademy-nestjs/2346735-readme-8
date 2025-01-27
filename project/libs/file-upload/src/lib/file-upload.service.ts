import { Injectable } from '@nestjs/common';
import { diskStorage, DiskStorageOptions } from 'multer';
import { ensureDir } from 'fs-extra';
import { Request } from 'express';
import * as mime from 'mime-types';

@Injectable()
export class FileUploadService {}
