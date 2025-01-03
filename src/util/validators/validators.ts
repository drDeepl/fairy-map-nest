import { HttpException, HttpStatus } from '@nestjs/common';

export const validatorImgFile = (req, file, callback) => {
  console.warn('VALIDATE DATA');
  const allowedMimes = ['image/jpg', 'image/png', 'image/jpeg'];
  const fileMime = file?.mimetype;
  if (allowedMimes.includes(fileMime)) {
    callback(null, true);
  } else {
    callback(
      new HttpException('не подходящий тип файла', HttpStatus.FORBIDDEN),
    );
  }
};
