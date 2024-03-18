import { HttpException, HttpStatus } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
const getUuid = require('uuid-by-string');

export enum Role {
  admin = 'admin',
  moder = 'moder',
  user = 'user',
}
const path = './static/uploads/audio/';
export const diskStorageOptionsAudio = {
  destination: (req, file, callback) => {
    console.warn('DESTINATION');
    const userId = req.user.sub;
    // const path = `./static/uploads/audio/${userId}`;
    console.log('DESTINATION');
    console.error(file);
    if (!existsSync(path + userId)) {
      mkdirSync(path, { recursive: true });
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
  console.log(path + req.user.sub);
  const allowedMimes = ['audio/mpeg', 'audio/mp3', 'audio/mp4'];
  const fileMime = file?.mimetype;

  if (allowedMimes.includes(fileMime)) {
    const extens = file.originalname.split('.')[1];
    const filename = `${req.params.languageId}@${getUuid(file.originalname)}.${extens}`;
    const pathToAudio = path + '/' + req.user.sub + '/' + filename;
    if (existsSync(pathToAudio)) {
      new HttpException(
        'Озвучка с выбранными параметрами уже существует',
        HttpStatus.FORBIDDEN,
      );
    }
    callback(null, true);
  } else {
    callback(new HttpException('Неправильный тип файла', HttpStatus.FORBIDDEN));
  }
};
