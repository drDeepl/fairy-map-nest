import { HttpException, HttpStatus } from '@nestjs/common';

const fs = require('fs');
export enum Role {
  admin = 'admin',
  moder = 'moder',
  user = 'user',
}

export const diskStorageOptionsAudio = {
  destination: (req, file, callback) => {
    const userId = req.user.sub;
    const path = `./static/uploads/audio/${userId}`;
    fs.mkdirSync(path, { recursive: true });

    return callback(null, path);
  },
  filename: (req, file, callback) => {
    console.error(Object.keys(req))
    console.error(req.params)
    return callback(null, `${req.params.languageId}L${file.originalname}`);
  },
};

export const validateAudio = (req, file, callback) => {
  const allowedMimes = ['audio/mpeg', 'audio/mp3', 'audio/mp4'];
  const fileMime = file?.mimetype;
  console.log(file);

  if (allowedMimes.includes(fileMime)) {
    callback(null, true);
  } else {
    callback(new HttpException('Неправильный тип файла', HttpStatus.FORBIDDEN));
  }
};
