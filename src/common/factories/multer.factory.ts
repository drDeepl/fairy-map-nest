import { ConfigService } from '@nestjs/config';
import { StoryService } from '../../app/modules/story/services/story.service';
import { Request } from 'express';
import { diskStorage, File } from 'multer';
import { extname, join } from 'path';
import {
  BadGatewayException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import * as fs from 'fs';
import { Language, Story } from '@prisma/client';
import { preparePathToAudioUpload } from '@/common/helpers/path-upload';
import { StoryDto } from '../../app/modules/story/dto/story/StoryDto';

function checkExistsDirCreateIfNotExists(pathToSave) {
  if (!fs.existsSync(pathToSave)) {
    fs.mkdirSync(pathToSave, { recursive: true });
  }
}

function generateFilename(file: File) {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const filename = `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`;
  return filename;
}
export const multerFactory = async (
  configService: ConfigService,
  storyService: StoryService,
) => {
  const imgDestination = (req, file, cb) => {
    const pathToSave = join(
      configService.get<string>('uploads.imgPath'),
      req.params.storyId,
    );

    checkExistsDirCreateIfNotExists(pathToSave);

    cb(null, pathToSave);
  };

  const imgFilename = async (req, file, cb) => {
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

    const filename = generateFilename(file);

    if (storyWithImg.img) {
      try {
        await fs.promises.unlink(join(pathToSave, storyWithImg.img.filename));
      } catch (error) {
        if (error.syscall === 'unlink') {
          cb(null, filename);
        } else {
          cb(
            new BadGatewayException('ошибка при добавлении обложки для сказки'),
          );
        }
      }
    } else {
      await fs.promises.mkdir(pathToSave, { recursive: true });
    }
    cb(null, filename);
  };

  const audioDestination = async (req, file, cb) => {
    const story: StoryDto | null = await storyService.getStoryById(
      +req.params.storyId,
    );

    if (!story) {
      cb(new BadRequestException('выбранной сказки не существует'));
    }

    const language: Language | null = await storyService.getLanguageById(
      +req.params.languageId,
    );

    if (language) {
      const user = req.user;
      const pathAudio = configService.get('uploads.audioPath');
      const pathToSave = preparePathToAudioUpload({
        baseUploadPath: pathAudio,
        userId: user.sub,
        storyId: req.params.storyId,
        languageId: req.params.languageId,
      });
      checkExistsDirCreateIfNotExists(pathToSave);
      cb(null, pathToSave);
    } else {
      cb(new BadRequestException('выбранного языка не существует'));
    }
  };

  const audioFilename = async (req, file, cb) => {
    const filename = generateFilename(file);
    cb(null, filename);
  };

  return {
    storage: diskStorage({
      destination: async (req: Request, file, cb) => {
        if (file.fieldname === 'file') {
          imgDestination(req, file, cb);
        } else if (file.fieldname === 'audio') {
          audioDestination(req, file, cb);
        } else {
          cb(new BadRequestException('неверное название поля'));
        }
      },
      filename: async (req, file, cb) => {
        if (file.fieldname === 'file') {
          imgFilename(req, file, cb);
        } else if (file.fieldname === 'audio') {
          audioFilename(req, file, cb);
        } else {
          cb(new BadRequestException('неверное название поля'));
        }
      },
    }),
  };
};
