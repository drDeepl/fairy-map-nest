import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import * as fs from 'node:fs';

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

  getFileExtenstion(filename: string): string {
    return filename.split('.').pop();
  }

  fileWithParamsIsExists(
    languageId: number,
    originalname,
    destination: string,
  ): boolean {
    const extens = this.getFileExtenstion(originalname);
    const filename = `${languageId}@${getUuid(originalname)}.${extens}`;

    const files = fs.readdirSync(destination);
    try {
      console.log('FILES');
      console.log(files);

      const matchingFiles = files.filter((file) =>
        new RegExp(`^[${languageId}]`).test(file),
      );
      console.log(matchingFiles);
      return matchingFiles.length > 0;
    } catch (e) {
      throw new HttpException('Что-то пошло не так', HttpStatus.BAD_GATEWAY);
    } finally {
    }

    // if (fs.existsSync(`${destination}/${filename}`)) {
    //   isExists = true;
    // }
  }
}
