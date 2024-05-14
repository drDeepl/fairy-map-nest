import { HttpException, HttpStatus } from '@nestjs/common';
import * as fs from 'node:fs';

import { ConfigService } from '@nestjs/config';
import { FileUtils } from './FileUtils';
import { extname } from 'path';
export const getUuid = require('uuid-by-string');

const fileUtils = new FileUtils();

export const MAX_STORIES_FOR_ETHNIC_GROUP: number = 10;

export enum Role {
  admin = 'admin',
  moder = 'moder',
  user = 'user',
}
export const basePathUpload = './static/uploads';
export const uploadsPath = './static/uploads/audio/';

export const diskStorageOptionsAudio = {
  destination: (req, file, callback) => {
    console.warn('DESTINATION');

    const path = uploadsPath + '/' + req.user.sub;
    // const path = `./static/uploads/audio/${userId}`;
    console.log('DESTINATION');
    console.error(file);
    if (!fs.existsSync(path)) {
      fs.mkdirSync(uploadsPath, { recursive: true });
    }
    return callback(null, path);
  },
  filename: (req, file, callback) => {
    console.warn('FILENAME');
    const extens = file.originalname.split('.')[1];
    const filename = `${req.params.languageId}@${getUuid(file.originalname)}.${extens}`;

    return callback(null, filename);
  },
};

export const diskStorageImg = {
  destination: (req, file, callback) => {
    console.warn('DESTINATION');
    console.error(file);
    console.log(Object.keys(req));
    const path = `${basePathUpload}/img/${req.params.storyId}`;
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
    return callback(null, path);
  },
  filename: (req, file, callback) => {
    console.warn('FILENAME');
    const filename = `${getUuid(file.originalname)}${extname(file.originalname)}`;
    return callback(null, filename);
  },
};

export const validateAudio = (req, file, callback) => {
  console.warn('VALIDATE DATA');
  const allowedMimes = ['audio/mpeg', 'audio/mp3', 'audio/mp4'];
  const fileMime = file?.mimetype;
  const audioPath = uploadsPath + req.user.sub + '/';
  if (allowedMimes.includes(fileMime)) {
    if (!fs.existsSync(audioPath)) {
      fs.mkdirSync(audioPath, { recursive: true });
    }
    if (
      fileUtils.fileWithParamsIsExists(
        req.params.languageId,
        file.originalname,
        audioPath,
      )
    ) {
      callback(
        new HttpException(
          'Озвучка с выбранными параметрами уже существует',
          HttpStatus.FORBIDDEN,
        ),
      );
    } else {
      callback(null, true);
    }
  } else {
    callback(new HttpException('Неправильный тип файла', HttpStatus.FORBIDDEN));
  }
  console.log('END VALIDATE');
  return;
};

export const statusCodeMessages = {
  P2002: 'статус с таким названием уже существует',
  P2025: 'выбранного статус не существует',
};

export const PCodeMessages = {
  P2003: 'не найдена запись, указанная в параметре',
  P2002: 'выбранная запись уже существует',
  P2025: 'выбранной записи не существует',
};

export enum REQUEST_STATUS {
  SEND = 'отправлено',
  SUCCESSED = 'одобрено',
  CANCELLED = 'отклонено',
}

export const jwtFactory = {
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get('JWT_SECRET'),
    signOptions: { expiresIn: configService.get('JWT_EXP_H') },
  }),
  inject: [ConfigService],
};
