import { registerAs } from '@nestjs/config';
import { join } from 'path';

export default registerAs('uploads', () => {
  const baseUploadPath =
    process.env.NODE_ENV === 'development'
      ? join(__dirname, '../..', 'static', 'uploads')
      : join(__dirname, '..', 'static', 'uploads');

  return {
    imgPath: join(baseUploadPath, 'img'),
    audioPath: join(baseUploadPath, '..', 'static', 'uploads', 'audio'),
  };
});
