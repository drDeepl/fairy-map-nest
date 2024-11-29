import {
  BadGatewayException,
  Injectable,
  Logger,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MulterOptionsFactory,
  MulterModuleOptions,
} from '@nestjs/platform-express';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { StoryService } from '@/app/modules/story/services/story.service';

@Injectable()
export class MulterImageConfigService implements MulterOptionsFactory {
  private readonly logger = new Logger(MulterImageConfigService.name);

  constructor(
    private configService: ConfigService,
    private storyService: StoryService,
  ) {}

  createMulterOptions(): MulterModuleOptions {
    console.log(this.createMulterOptions.name);
    return {
      storage: diskStorage({
        destination: (req: Request, file, cb) => {
          const uploadPath = this.configService.get<string>('uploads.imgPath');
          console.log(console.log(req.params));
          const pathToSave = join(uploadPath, req.params.storyId);
          // cb(null, uploadPath)
          const story = this.storyService
            .getStoryById(+req.params.storyId)
            .then((story) => {
              this.logger.debug('story', story);
            });
          cb(new NotImplementedException('фича находится в разработке'));
        },
        filename: (req, file, cb) => {
          this.logger.debug(JSON.stringify(file));
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
    };
  }
}
