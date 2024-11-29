import { ConfigService } from '@nestjs/config';
import { StoryService } from '../../story/services/story.service';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import {
  Logger,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { StoryDto } from '../../story/dto/story/StoryDto';
import fs from 'fs';

export const multerImgFactory = async (
  configService: ConfigService,
  storyService: StoryService,
) => {
  const logger = new Logger(multerImgFactory.name);
  return {
    storage: diskStorage({
      destination: async (req: Request, file, cb) => {
        const uploadPath = configService.get<string>('uploads.imgPath');
        const pathToSave = join(uploadPath, req.params.storyId);
        // cb(null, uploadPath)
        const story: StoryDto | null = await storyService.getStoryById(
          +req.params.storyId,
        );
        if (!story) {
          cb(new NotFoundException('выбранная сказка не найдена'));
        }
        logger.debug(
          'current url',
          `${req.protocol}://${req.hostname}/${configService.get('APP_URL')}`,
        );
        logger.debug('file', file);
        logger.debug('story', story);

        cb(new NotImplementedException('фича в разработке'));
      },
      filename: (req, file, cb) => {
        logger.debug(JSON.stringify(file));
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(
          null,
          `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
        );
      },
    }),
  };
};
