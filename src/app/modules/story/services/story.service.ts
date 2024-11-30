import { EthnicGroupDto } from '@/app/modules/ethnic-group/dto/EthnicGroupDto';
import { PrismaService } from '@/prisma/prisma.service';
import { UserAudioEntity } from '@/app/modules/user-audio/entity/UserAudioEntity';
import {
  MAX_STORIES_FOR_ETHNIC_GROUP,
  PCodeMessages,
  basePathUpload,
  getUuid,
} from '@/util/Constants';
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
import {
  ImgStory,
  PrismaClient,
  RatingAudio,
  Story,
  StoryAudio,
} from '@prisma/client';
import { File } from 'multer';

import { basename, extname } from 'node:path';
import { AddAudioStoryDto } from '../dto/audio-story/AddAudioStoryDto';
import { AudioStoryLanguageDto } from '../dto/audio-story/AudioStoryLanguageDto';
import { AudioStoryEntity } from '../dto/audio-story/entity/AudioStoryEntity';
import { CreatedImageStoryDto } from '../dto/image-story/CreatedImageStory';
import { ImageStoryDto } from '../dto/image-story/ImageStoryDto';
import { ImageStoryEntity } from '../dto/image-story/entity/ImageStoryEntity';
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
import { StoryWithImgResponseDto } from '../dto/story/response/story-with-img.response.dto';
import { StoryExtendImg } from '../dto/story/interfaces/story-extend-img';
import { isThursday } from 'date-fns';

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

  async getStories(): Promise<StoryDto[]> {
    return this.prisma.story.findMany({
      select: {
        id: true,
        name: true,
        ethnicGroup: true,
        audioId: true,
      },
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
            story['audioid'],
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

  async getStoriesByEthnicGroup(ethnicGroupId: number): Promise<StoryDto[]> {
    return this.prisma.story.findMany({
      select: {
        id: true,
        name: true,
        ethnicGroup: true,
        audioId: true,
      },
      where: {
        ethnicGroupId: ethnicGroupId,
      },
    });
  }

  async getStoryById(storyId: number): Promise<StoryDto | null> {
    try {
      const story: StoryDto | null = await this.prisma.story.findUnique({
        select: {
          id: true,
          name: true,
          ethnicGroup: true,
          audioId: true,
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

  async getLanguagesForStory(
    storyId: number,
  ): Promise<AudioStoryLanguageDto[]> {
    const story = await this.prisma.story.findUnique({
      where: {
        id: storyId,
      },
    });
    if (story.audioId === null) {
      return [];
    }
    try {
      return await this.prisma.storyAudio.findMany({
        select: {
          id: true,
          userAudioId: true,
          moderateScore: true,
          language: {
            select: {
              id: true,
              name: true,
            },
          },
          authors: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        where: {
          id: story.audioId,
        },
      });
    } catch (error) {
      PrintNameAndCodePrismaException(error, this.logger);
      throw this.dbExceptionHandler.handleError(error);
    }
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
                audioId: true,
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
              audioId: true,
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
        const coversStoriesPath = join(
          this.configService.get('uploads.imgPath'),
          `${story.id}`,
        );

        fsPromises.mkdir(coversStoriesPath, { recursive: true });

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

  async setUserAudioToStory(
    moderatorId: number,
    storyId: number,
    dto: AddAudioStoryDto,
  ): Promise<void> {
    const userAudio = await this.prisma.userAudioStory.findUnique({
      where: {
        id: dto.userAudioId,
      },
    });

    if (userAudio === null) {
      throw new HttpException(
        'Выбранной аудиозаписи не существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const audioStory: AudioStoryEntity = await this.prisma.storyAudio.create({
        data: {
          author: dto.userId,
          userAudioId: dto.userAudioId,
          moderateScore: dto.moderateScore,
          languageId: userAudio.languageId,
        },
      });
      await this.prisma.ratingAudio.create({
        data: {
          userId: moderatorId,
          storyAudioId: audioStory.id,
          rating: dto.moderateScore,
        },
      });
      await this.prisma.story.update({
        where: {
          id: storyId,
        },
        data: {
          audioId: audioStory.id,
        },
      });
    } catch (error) {
      PrintNameAndCodePrismaException(error, this.logger);
      throw this.dbExceptionHandler.handleError(error);
    }
  }

  async getAudioStoryById(audioId: number): Promise<StreamableFile> {
    try {
      const audioStory: AudioStoryEntity =
        await this.prisma.storyAudio.findUnique({
          where: { id: audioId },
        });
      // FIX after added UserAudioRepository
      const userAudio: UserAudioEntity =
        await this.prisma.userAudioStory.findUnique({
          where: {
            id: audioStory.userAudioId,
          },
        });
      if (userAudio) {
        const file = fs.createReadStream(
          join(process.cwd(), userAudio.pathAudio),
        );
        return new StreamableFile(file);
      }
      // FIX end =============================================
    } catch (error) {
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
  ): Promise<ImgStory> {
    try {
      const storyImg = await this.prisma.imgStory.findUnique({
        where: {
          storyId: storyId,
        },
      });
      if (!storyImg) {
        return this.prisma.imgStory.create({
          data: {
            filename: file.filename,
            storyId: storyId,
          },
        });
      } else {
        return this.prisma.imgStory.update({
          where: {
            id: storyImg.id,
          },
          data: {
            filename: file.filename,
          },
        });
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
    console.log(storyAudio);
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
        console.log(totalRatingAudio);
        return new AddedRatingAudioStoryDto(
          dto.rating,
          totalRatingAudio._avg.rating,
        );
      });
    } catch (error) {
      PrintNameAndCodePrismaException(error, this.logger);
      throw this.dbExceptionHandler.handleError(error);
    }
  }
}
