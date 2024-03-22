import { HttpException, HttpStatus } from '@nestjs/common';
import * as fs from 'node:fs';

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
    if (
      fileUtils.fileWithParamsIsExists(
        req.params.languageId,
        file.originalname,
        audioPath,
      )
    ) {
      return callback(
        new HttpException(
          'Озвучка с выбранными параметрами уже существует',
          HttpStatus.FORBIDDEN,
        ),
      );
    } else {
      return callback(null, true);
    }
  } else {
    return callback(
      new HttpException('Неправильный тип файла', HttpStatus.FORBIDDEN),
    );
  }
};
