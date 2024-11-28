import { registerAs } from '@nestjs/config';
import { join } from 'path';

export default registerAs('uploads', () => ({
  imgPath: join(__dirname, '..', 'static', 'uploads', 'img'),
  audioPath: join(__dirname, '..', 'static', 'uploads', 'audio'),
}));
