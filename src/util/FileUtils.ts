import { HttpException, HttpStatus } from '@nestjs/common';
import { unlink } from 'fs';
export class FileUtils {
  throwRM(err: string) {
    console.error('RM OR THROW');
    console.error(err);
    throw new HttpException(
      'Ошибка при удалении озвучки',
      HttpStatus.FORBIDDEN,
    );
  }
}
