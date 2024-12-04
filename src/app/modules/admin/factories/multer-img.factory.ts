import { ConfigService } from '@nestjs/config';
import { StoryService } from '../../story/services/story.service';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { NotFoundException } from '@nestjs/common';

import * as fs from 'fs';

export const multerImgFactory = async (
  configService: ConfigService,
  storyService: StoryService,
) => {
  return {
    storage: diskStorage({
      destination: async (req: Request, file, cb) => {
        const pathToSave = join(
          configService.get<string>('uploads.imgPath'),
          req.params.storyId,
        );

        if (!fs.existsSync(pathToSave)) {
          fs.mkdirSync(pathToSave, { recursive: true });
        }

        cb(null, pathToSave);
      },
      filename: async (req, file, cb) => {
        const pathToSave = join(
          configService.get<string>('uploads.imgPath'),
          req.params.storyId,
        );

        const storyWithImg = await storyService.getStoryWithImg(
          +req.params.storyId,
        );

        if (!storyWithImg) {
          cb(new NotFoundException('выбранная сказка не найдена'));
        }

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const filename = `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`;

        if (storyWithImg.img) {
          // fs.mkdirSync(pathToSave, { recursive: true });
          fs.promises.unlink(join(pathToSave, storyWithImg.img.filename));
        }
        cb(null, filename);
      },
    }),
  };
};
