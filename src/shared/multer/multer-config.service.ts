import { validatorImgFile } from '@/util/validators/validators';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MulterOptionsFactory,
  MulterModuleOptions,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(private configService: ConfigService) {}

  createMulterOptions(): MulterModuleOptions {
    return {
      fileFilter: validatorImgFile,
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = this.configService.get<string>('img');
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
    };
  }
}
