import { EthnicGroupDto } from '@/app/modules/ethnic-group/dto/EthnicGroupDto';
import { PrismaService } from '@/prisma/prisma.service';

import { MAX_STORIES_FOR_ETHNIC_GROUP, PCodeMessages } from '@/util/Constants';
import { PrintNameAndCodePrismaException } from '@/util/ExceptionUtils';
import { MessageException } from '@/util/MessageException';
import { DataBaseExceptionHandler } from '@/util/exception/DataBaseExceptionHandler';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  NotImplementedException,
  StreamableFile,
} from '@nestjs/common';
import { Language, RatingAudio, Story, StoryAudio } from '@prisma/client';
import { File } from 'multer';

import { AddAudioStoryDto } from '../dto/audio-story/AddAudioStoryDto';

import { ImageStoryDto } from '../dto/image-story/ImageStoryDto';

import { AddRatingAudioStoryDto } from '../dto/rating-audio-story/AddRatingAudioStoryDto';
import { AddedRatingAudioStoryDto } from '../dto/rating-audio-story/AddedRatingAudioStoryDto';
import { RatingAudioStoryDto } from '../dto/rating-audio-story/RatingAudioStoryDto';
import { RatingAudioStoryWithUserAudio } from '../dto/rating-audio-story/RatingAudioStoryWithUserAudioId';
import { AddStoryDto } from '../dto/story/AddStoryDto';
import { EditStoryDto } from '../dto/story/EditStoryDto';
import { StoryDto } from '../dto/story/StoryDto';
import { AddTextStoryDto } from '../dto/text-story/AddTextStoryDto';
import { TextStoryDto } from '../dto/text-story/TextStoryDto';
import { StoryWithTextDto } from '../dto/story/story-with-text.dto';
import { ConfigService } from '@nestjs/config';
import { promises as fsPromises } from 'fs';
import * as fs from 'node:fs';
import { join } from 'path';
import { StoryBookResponseDto } from '../dto/story/response/story-with-img.response.dto';
import { StoryExtendImg } from '../dto/story/interfaces/story-extend-img';
import { AddAudioStoryAdminParams } from '../interfaces/add-audio-story-admin.params';
import { AudioStoryResponseDto } from '../dto/audio-story/response/audio-story.response.dto';
import { AuthorAudioStoryResponseDto } from '../../user/dto/response/author-audio-story.response.dto';
import { AudioResponseDto } from '../dto/audio-story/response/audio-response.dto';
import { LanguageDto } from '../../ethnic-group/dto/LanguageDto';
import { PreviewAudioStoryResponseDto } from '../dto/audio-story/response/preview-audio-story.response.dto';
import {
  preparePathToAudioUpload,
  prepareSrcAudio,
} from '@/common/helpers/path-upload';
import { PageOptionsRequestDto } from '@/common/dto/request/page-options.request.dto';
import { PageResponseDto } from '@/common/dto/response/page.response.dto';
import { PageMetaDto } from '@/common/dto/page-meta.dto';

@Injectable()
export class StoryService {
  private readonly logger = new Logger('StoryService');
  private readonly msgException = new MessageException();
  private readonly dbExceptionHandler = new DataBaseExceptionHandler(
    PCodeMessages,
  );

  constructor(
    private prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  prepareSrcImg(storyId: number, filename: string): string {
    return `${this.configService.get('APP_URL')}/uploads/img/${storyId}/${filename}`;
  }

  async getStories(
    query: PageOptionsRequestDto,
  ): Promise<PageResponseDto<StoryBookResponseDto>> {
    const [stories, itemCount] = await this.prisma.$transaction([
      this.prisma.story.findMany({
        skip: query.skip,
        take: query.take,
        select: {
          id: true,
          name: true,
          ethnicGroup: true,
          img: true,
          text: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.story.count(),
    ]);
    const storiesDto = stories.map((story) => {
      const srcImg: string | null = story.img
        ? this.prepareSrcImg(story.id, story.img.filename)
        : null;
      return new StoryBookResponseDto(
        { ...story, text: story.text.text },
        srcImg,
      );
    });

    const pageMetaDto = new PageMetaDto({ pageOptionsDto: query, itemCount });
    return new PageResponseDto(storiesDto, pageMetaDto);
  }

  async getStoriesByAuthorAudioStory(
    userId: number,
  ): Promise<StoryBookResponseDto[]> {
    const storiesByAuthorAudioStory = await this.prisma.storyAudio.findMany({
      select: {
        id: true,
        author: true,
        story: {
          include: {
            img: true,
            ethnicGroup: true,
          },
        },
      },
      distinct: ['storyId'],
      where: {
        author: userId,
      },
    });

    return storiesByAuthorAudioStory.map((audioStory) => {
      const srcImg: string | null = audioStory.story.img
        ? this.prepareSrcImg(audioStory.story.id, audioStory.story.img.filename)
        : null;

      return new StoryBookResponseDto(audioStory.story, srcImg);
    });
  }

  async getStoryByName(name: string): Promise<StoryDto[]> {
    try {
      const stories = await this.prisma.$queryRaw<StoryDto[]>`
      SELECT stories.id,
      stories.name,
      stories.audio_id as audioId,
      ethnic_groups.id as ethnicGroupId,
      ethnic_groups.name as ethnicGroupName,
      ethnic_groups.language_id as ethnicGroupLanguageId
       FROM stories INNER JOIN ethnic_groups ON stories.ethnic_group_id = ethnic_groups.id
       WHERE stories.name ~* ${name}`;
      return stories.map(
        (story) =>
          new StoryDto(
            story['id'],
            story['name'],
            new EthnicGroupDto(
              story['ethnicgroupid'],
              story['ethnicgroupname'],
              story['ethnicgrouplanguageid'],
            ),
          ),
      );
    } catch (error) {
      PrintNameAndCodePrismaException(error, this.logger);
      throw this.dbExceptionHandler.handleError(error);
    }
  }

  async getStoriesByEthnicGroup(
    ethnicGroupId: number,
    query: PageOptionsRequestDto,
  ): Promise<PageResponseDto<StoryBookResponseDto>> {
    const [stories, itemCount] = await this.prisma.$transaction([
      this.prisma.story.findMany({
        skip: query.skip,
        take: query.take,
        select: {
          id: true,
          name: true,
          ethnicGroup: true,

          img: true,
        },
        where: {
          ethnicGroupId: ethnicGroupId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.story.count(),
    ]);

    const storiesDto = stories.map((story) => {
      const srcImg: string | null = story.img
        ? this.prepareSrcImg(story.id, story.img.filename)
        : null;

      return new StoryBookResponseDto(story, srcImg);
    });

    const pageMetaDto = new PageMetaDto({ pageOptionsDto: query, itemCount });

    return new PageResponseDto(storiesDto, pageMetaDto);
  }

  async getStoryById(storyId: number): Promise<StoryDto | null> {
    try {
      const story: StoryDto | null = await this.prisma.story.findUnique({
        select: {
          id: true,
          name: true,
          ethnicGroup: true,
        },
        where: {
          id: storyId,
        },
      });
      return story;
    } catch (error) {
      PrintNameAndCodePrismaException(error, this.logger);
      throw this.dbExceptionHandler.handleError(error);
    }
  }

  async getAudiosByEthnicGroup(
    ethnicGroupId: number,
  ): Promise<PreviewAudioStoryResponseDto[]> {
    try {
      const stories = await this.prisma.story.findMany({
        select: {
          id: true,
          name: true,
          img: true,
          audios: {
            select: {
              id: true,
              moderateScore: true,
              authors: true,
              userAudio: {
                select: {
                  userId: true,
                  name: true,
                  language: true,
                },
              },
            },
          },
        },
        where: {
          ethnicGroupId: ethnicGroupId,
        },
      });
      const storiesDto: PreviewAudioStoryResponseDto[] = stories.map(
        (story) => {
          const audios: AudioResponseDto[] = story.audios.map((audio) => {
            const appUrl = String(this.configService.get('APP_URL'));
            const srcAudio = prepareSrcAudio({
              appUrl: appUrl,
              storyId: story.id,
              userId: audio.userAudio.userId,
              languageId: audio.userAudio.language.id,
              filename: audio.userAudio.name,
            });
            const languageDto = new LanguageDto();
            languageDto.id = audio.userAudio.language.id;
            languageDto.name = audio.userAudio.language.name;
            return new AudioResponseDto({
              id: audio.id,
              language: languageDto,
              srcAudio: srcAudio,
              author: new AuthorAudioStoryResponseDto(audio.authors),
              moderateScore: audio.moderateScore,
            });
          });

          let srcImg = null;

          if (story.img) {
            srcImg = this.prepareSrcImg(story.id, story.img.filename);
          }

          return new PreviewAudioStoryResponseDto({
            ...story,
            srcImg: srcImg,
            audios: audios,
          });
        },
      );

      return storiesDto.filter((story) => story.audios.length > 0);
    } catch (error) {
      PrintNameAndCodePrismaException(error, this.logger);
      throw this.dbExceptionHandler.handleError(error);
    }
  }

  async getLanguageById(languageId: number): Promise<Language | null> {
    return this.prisma.language.findUnique({
      where: {
        id: languageId,
      },
    });
  }

  async addStory(dto: AddStoryDto): Promise<StoryDto> {
    const maxCountStories = MAX_STORIES_FOR_ETHNIC_GROUP;

    return this.prisma.story
      .count({
        where: {
          ethnicGroupId: dto.ethnicGroupId,
        },
      })
      .then((result) => {
        if (result < maxCountStories) {
          return this.prisma.story
            .create({
              select: {
                id: true,
                name: true,
                ethnicGroup: true,
              },
              data: {
                name: dto.name,
                ethnicGroupId: dto.ethnicGroupId,
              },
            })
            .catch((error) => {
              PrintNameAndCodePrismaException(error, this.logger);
              if (error.code == 'P2002') {
                throw new HttpException(
                  'сказка с таким названием уже существует',
                  HttpStatus.FORBIDDEN,
                );
              }
              if (error.code === 'P2003') {
                throw new HttpException(
                  'выбранной этнической группы не существует',
                  HttpStatus.FORBIDDEN,
                );
              } else {
                throw new HttpException(
                  this.msgException.UnhandledError,
                  HttpStatus.BAD_GATEWAY,
                );
              }
            });
        }
        throw new HttpException(
          `Превышен лимит сказок для одной этнической группы. Максимальное количество: ${maxCountStories}`,
          HttpStatus.FORBIDDEN,
        );
      });
  }

  async editStory(id: number, dto: EditStoryDto) {
    return this.prisma.story
      .update({
        where: {
          id: id,
        },
        data: {
          name: dto.name,
          ethnicGroupId: dto.ethnicGroupId,
        },
      })
      .catch((error) => {
        PrintNameAndCodePrismaException(error, this.logger);
        if (error.code == 'P2002') {
          throw new HttpException(
            'сказка с таким названием уже существует',
            HttpStatus.FORBIDDEN,
          );
        }
        if (error.code == 'P2003') {
          throw new HttpException(
            'выбранной этнической группы не существует',
            HttpStatus.FORBIDDEN,
          );
        } else {
          throw new HttpException(
            this.msgException.UnhandledError,
            HttpStatus.BAD_GATEWAY,
          );
        }
      });
  }

  async deleteStoryById(id: number) {
    return this.prisma.story
      .delete({
        where: {
          id: id,
        },
      })
      .catch((error) => {
        PrintNameAndCodePrismaException(error, this.logger);
        if (error.code == 'P2025') {
          throw new HttpException(
            'выбранной сказки не существует',
            HttpStatus.FORBIDDEN,
          );
        } else {
          throw new HttpException(
            this.msgException.UnhandledError,
            HttpStatus.BAD_GATEWAY,
          );
        }
      });
  }

  async addTextStory(
    storyId: number,
    dto: AddTextStoryDto,
  ): Promise<TextStoryDto> {
    return this.prisma.textStory
      .create({
        data: {
          storyId: storyId,
          text: dto.text,
        },
      })
      .catch((error) => {
        PrintNameAndCodePrismaException(error, this.logger);
        throw this.dbExceptionHandler.handleError(error);
      });
  }

  async addStoryWithText(dto: AddStoryDto): Promise<StoryWithTextDto> {
    return this.prisma.$transaction(async (tx) => {
      const maxCountStories = MAX_STORIES_FOR_ETHNIC_GROUP;
      try {
        const currentCountStories = await tx.story.count({
          where: {
            ethnicGroupId: dto.ethnicGroupId,
          },
        });

        if (currentCountStories >= maxCountStories) {
          throw new HttpException(
            `Превышен лимит сказок для одной этнической группы. Максимальное количество: ${maxCountStories}`,
            HttpStatus.FORBIDDEN,
          );
        }
        const story = await tx.story
          .create({
            select: {
              id: true,
              name: true,
              ethnicGroup: true,
            },
            data: {
              name: dto.name,
              ethnicGroupId: dto.ethnicGroupId,
            },
          })
          .catch((error) => {
            PrintNameAndCodePrismaException(error, this.logger);
            if (error.code == 'P2002') {
              throw new HttpException(
                'сказка с таким названием уже существует',
                HttpStatus.FORBIDDEN,
              );
            }
            if (error.code === 'P2003') {
              throw new HttpException(
                'выбранной этнической группы не существует',
                HttpStatus.FORBIDDEN,
              );
            } else {
              throw new HttpException(
                this.msgException.UnhandledError,
                HttpStatus.BAD_GATEWAY,
              );
            }
          });
        // const coversStoriesPath = join(
        //   this.configService.get('uploads.imgPath'),
        //   `${story.id}`,
        // );

        // fsPromises.mkdir(coversStoriesPath, { recursive: true });

        const textStory = await tx.textStory
          .create({
            data: {
              storyId: story.id,
              text: dto.text,
            },
          })
          .catch((error) => {
            PrintNameAndCodePrismaException(error, this.logger);
            throw this.dbExceptionHandler.handleError(error);
          });

        return new StoryWithTextDto(story, textStory.text);
      } catch (error) {
        throw this.dbExceptionHandler.handleError(error);
      }
    });
  }

  async getStoryWithImg(storyId: number): Promise<StoryExtendImg | null> {
    try {
      return this.prisma.story.findUnique({
        where: {
          id: storyId,
        },
        include: {
          img: true,
        },
      });
    } catch (error) {
      throw this.dbExceptionHandler.handleError(error);
    }
  }

  async getTextByStoryId(storyId: number): Promise<TextStoryDto> {
    return await this.prisma.textStory
      .findUnique({
        where: {
          storyId: storyId,
        },
      })
      .catch((error) => {
        PrintNameAndCodePrismaException(error, this.logger);
        throw this.dbExceptionHandler.handleError(error);
      });
  }

  async addAudioStory(
    params: AddAudioStoryAdminParams,
  ): Promise<AudioStoryResponseDto> {
    return await this.prisma.$transaction(async (transactionClient) => {
      const userAudio = await transactionClient.userAudioStory.create({
        data: {
          name: params.filename,
          userId: params.userId,
          languageId: params.languageId,
          originalName: params.originalName,
          pathAudio: params.pathAudio,
        },
      });

      const storyAudio = await transactionClient.storyAudio.create({
        select: {
          id: true,
          authors: true,
          storyId: true,
          language: true,
          moderateScore: true,
        },
        data: {
          author: params.userId,
          languageId: params.languageId,
          moderateScore: 0,
          storyId: params.storyId,
          userAudioId: userAudio.id,
        },
      });
      const appUrl = this.configService.get('APP_URL');
      return new AudioStoryResponseDto({
        ...storyAudio,
        srcAudio: prepareSrcAudio({
          appUrl: appUrl,
          storyId: storyAudio.storyId,
          userId: userAudio.userId,
          languageId: userAudio.languageId,
          filename: userAudio.name,
        }),
        author: new AuthorAudioStoryResponseDto(storyAudio.authors),
      });
    });
  }

  async getAudiosForStory(storyId: number): Promise<AudioStoryResponseDto[]> {
    const audioStories = await this.prisma.storyAudio.findMany({
      where: {
        storyId: storyId,
      },
      include: {
        language: true,
        authors: true,
        userAudio: true,
      },
    });

    const appUrl = this.configService.get('APP_URL');

    return audioStories.map(
      (audioStory) =>
        new AudioStoryResponseDto({
          ...audioStory,
          srcAudio: prepareSrcAudio({
            appUrl: appUrl,
            storyId: storyId,
            userId: audioStory.userAudio.userId,
            languageId: audioStory.userAudio.languageId,
            filename: audioStory.userAudio.name,
          }),
          author: new AuthorAudioStoryResponseDto(audioStory.authors),
        }),
    );
  }

  async setUserAudioToStory(
    storyId: number,
    dto: AddAudioStoryDto,
  ): Promise<void> {
    try {
      const userAudio = await this.prisma.userAudioStory.findUnique({
        where: {
          id: dto.userAudioId,
        },
      });

      if (!userAudio) {
        throw new NotFoundException('файл озвучки не найден');
      }

      await this.prisma.storyAudio.create({
        data: {
          author: dto.userId,
          storyId: storyId,
          languageId: userAudio.languageId,
          moderateScore: dto.moderateScore,
          userAudioId: userAudio.id,
        },
      });

      // await this.prisma.storyAudio.create({
      //   data:{

      //   }
      // })
      // throw new NotImplementedException(
      //   'добавление озвучки пользователя находится в разработке',
      // );
    } catch (error) {
      if (error instanceof NotImplementedException) throw error;
      PrintNameAndCodePrismaException(error, this.logger);
      throw this.dbExceptionHandler.handleError(error);
    }
  }

  async getAudioStoryById(audioId: number): Promise<StreamableFile> {
    try {
      const audioStory = await this.prisma.storyAudio.findUnique({
        where: { id: audioId },
        include: {
          userAudio: true,
        },
      });

      if (!audioStory) {
        throw new NotFoundException('Выбранная озвучка не найдена');
      }

      const baseUplaodPathAudio = this.configService.get('uploads.audioPath');

      const pathAudio = preparePathToAudioUpload({
        baseUploadPath: baseUplaodPathAudio,
        userId: audioStory.author,
        storyId: audioStory.storyId,
        languageId: audioStory.languageId,
      });

      const file = await fs.promises.readFile(
        `${pathAudio}\\${audioStory.userAudio.name}`,
      );

      return new StreamableFile(file);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      PrintNameAndCodePrismaException(error, this.logger);
      throw this.dbExceptionHandler.handleError(error);
    }
  }

  async getImgStoryById(storyId: number): Promise<ImageStoryDto> {
    try {
      const imgStoryData = await this.prisma.imgStory.findUnique({
        where: {
          storyId: storyId,
        },
      });
      if (imgStoryData) {
        const imgPath = join(
          this.configService.get('upload.imgPath'),
          `${imgStoryData.storyId}`,
          imgStoryData.filename,
        );
        const imgStoryDto: ImageStoryDto = new ImageStoryDto();
        imgStoryDto.filename = imgStoryData.filename;
        imgStoryDto.buffer = fs.readFileSync(imgPath);
        return imgStoryDto;
      }
      throw new NotFoundException();
    } catch (error) {
      PrintNameAndCodePrismaException(error, this.logger);
      throw this.dbExceptionHandler.handleError(error);
    }
  }

  async createImgForStoryOrUpdateIfExists(
    storyId: number,
    file: File,
  ): Promise<StoryBookResponseDto> {
    try {
      const srcUrl = `${this.configService.get('APP_URL')}/uploads/img/${storyId}`;
      const storyImg = await this.prisma.imgStory.findUnique({
        where: {
          storyId: storyId,
        },
      });
      if (!storyImg) {
        const createdImgStory = await this.prisma.imgStory.create({
          data: {
            filename: file.filename,
            storyId: storyId,
          },
          include: {
            story: {
              select: {
                id: true,
                name: true,
                ethnicGroup: true,
              },
            },
          },
        });
        return new StoryBookResponseDto(
          createdImgStory.story,
          `${srcUrl}/${createdImgStory.filename}`,
        );
      } else {
        const updatedStoryImg = await this.prisma.imgStory.update({
          where: {
            id: storyImg.id,
          },
          data: {
            filename: file.filename,
          },
          include: {
            story: {
              select: {
                id: true,
                name: true,
                ethnicGroup: true,
              },
            },
          },
        });
        return new StoryBookResponseDto(
          updatedStoryImg.story,
          `${srcUrl}/${updatedStoryImg.filename}`,
        );
      }
    } catch (error) {
      PrintNameAndCodePrismaException(error, this.logger);
      throw this.dbExceptionHandler.handleError(error);
    }
  }

  async deleteStoryImgByStoryId(storyId: number): Promise<void> {
    try {
      const deletedStoryImg = await this.prisma.imgStory.delete({
        where: {
          storyId: storyId,
        },
      });
      const imgPath = join(
        this.configService.get('uploads.imgPath'),
        `${deletedStoryImg.storyId}`,
        deletedStoryImg.filename,
      );
      fs.unlinkSync(imgPath);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getRatingByAudioId(id: number): Promise<RatingAudioStoryDto> {
    try {
      const avgRatingAudio = await this.prisma.ratingAudio.aggregate({
        _avg: {
          rating: true,
        },
        where: {
          storyAudioId: id,
        },
      });
      return new RatingAudioStoryDto(id, avgRatingAudio._avg.rating);
    } catch (error) {
      PrintNameAndCodePrismaException(error, this.logger);
      throw this.dbExceptionHandler.handleError(error);
    }
  }

  async getRatingByAudioIdForCurrentUser(
    userId: number,
    userAudioId: number,
  ): Promise<RatingAudioStoryWithUserAudio> {
    const storyAudio: StoryAudio = await this.prisma.storyAudio.findUnique({
      where: {
        userAudioId: userAudioId,
      },
    });

    if (storyAudio == null) {
      throw new BadRequestException('Оценка не найдена');
    }
    try {
      const ratingAudio: RatingAudio = await this.prisma.ratingAudio.findFirst({
        where: {
          storyAudioId: storyAudio.id,
          userId: userId,
        },
      });
      return new RatingAudioStoryWithUserAudio(
        ratingAudio.id,
        ratingAudio.storyAudioId,
        ratingAudio.userId,
        ratingAudio.rating,
        storyAudio.userAudioId,
      );
    } catch (error) {
      // if (error.name === 'BadRequestException') {
      //   throw new BadRequestException(error.message);
      // }
      PrintNameAndCodePrismaException(error, this.logger);
      throw this.dbExceptionHandler.handleError(error);
    }
  }

  async addRatingAudioStoryById(
    userId: number,
    dto: AddRatingAudioStoryDto,
  ): Promise<AddedRatingAudioStoryDto> {
    const currentRating = await this.prisma.ratingAudio.findFirst({
      where: {
        storyAudioId: dto.audioId,
        userId: userId,
      },
    });

    try {
      return await this.prisma.$transaction(async (transactionClient) => {
        if (currentRating === null) {
          await transactionClient.ratingAudio.create({
            data: {
              storyAudioId: dto.audioId,
              userId: userId,
              rating: dto.rating,
            },
          });
        } else {
          await transactionClient.ratingAudio.update({
            where: {
              id: currentRating.id,
            },
            data: {
              rating: dto.rating,
            },
          });
        }
        const totalRatingAudio = await transactionClient.ratingAudio.aggregate({
          _avg: {
            rating: true,
          },
          where: {
            storyAudioId: dto.audioId,
          },
        });
        await transactionClient.storyAudio.update({
          where: {
            id: dto.audioId,
          },
          data: {
            moderateScore: totalRatingAudio._avg.rating,
          },
        });

        return new AddedRatingAudioStoryDto({
          audioId: dto.audioId,
          ratingCurrentUser: dto.rating,
          ratingAudioStory: totalRatingAudio._avg.rating,
        });
      });
    } catch (error) {
      console.log(error);
      PrintNameAndCodePrismaException(error, this.logger);
      throw this.dbExceptionHandler.handleError(error);
    }
  }
}
