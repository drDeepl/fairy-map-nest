import { HttpException, HttpStatus } from '@nestjs/common';
import { unlink, existsSync } from 'fs';
const getUuid = require('uuid-by-string');
export class FileUtils {
  throwRM(err: string) {
    console.error('RM OR THROW');
    console.error(err);
    throw new HttpException(
      'Ошибка при удалении озвучки',
      HttpStatus.FORBIDDEN,
    );
  }

  fileWithParamsIsExists(
    languageId: number,
    originalname,
    destination: string,
  ): boolean {
    const extens = originalname.split('.')[1];
    const filename = `${languageId}@${getUuid(originalname)}.${extens}`;
    if (existsSync(`${destination}/${filename}`)) {
      return true;
    }
    return false;
  }
}
