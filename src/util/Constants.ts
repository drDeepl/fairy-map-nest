import { HttpException, HttpStatus } from '@nestjs/common';
import * as fs from 'node:fs';

import { ConfigService } from '@nestjs/config';
import { FileUtils } from './FileUtils';
export const getUuid = require('uuid-by-string');

const fileUtils = new FileUtils();

export enum Role {
  admin = 'admin',
  moder = 'moder',
  user = 'user',
}
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
