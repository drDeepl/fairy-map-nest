import { PrismaService } from '@/prisma/prisma.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { AddStoryDto } from './dto/story/AddStoryDto';
import { PrintNameAndCodePrismaException } from '@/util/ExceptionUtils';
import { MessageException } from '@/util/MessageException';
import { EditStoryDto } from './dto/story/EditStoryDto';
import { StoryDto } from './dto/story/StoryDto';
import { TextStoryDto } from './dto/text-story/TextStoryDto';
import { AddTextStoryDto } from './dto/text-story/AddTextStoryDto';
import {
  MAX_STORIES_FOR_ETHNIC_GROUP,
  PCodeMessages,
  basePathUpload,
  getUuid,
} from '@/util/Constants';
import { DataBaseExceptionHandler } from '@/util/exception/DataBaseExceptionHandler';
import { AudioStoryRequestEntity } from '@/audio-story-request/entity/AudioStoryRequestEntity';
import { AddAudioStoryDto } from './dto/audio-story/AddAudioStoryDto';
import { AudioStoryEntity } from './dto/audio-story/entity/AudioStoryEntity';
import { UserAudioService } from '@/user-audio/user-audio.service';
import { UserAudioRepository } from '@/user-audio/user-audio.repository';
import { UserAudioEntity } from '@/user-audio/entity/UserAudioEntity';
import * as fs from 'node:fs';
import { join } from 'path';
import { ImageStoryEntity } from './dto/image-story/entity/ImageStoryEntity';
import { File } from 'multer';
import { basename, extname } from 'node:path';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreatedImageStoryDto } from './dto/image-story/CreatedImageStory';
import { create } from 'node:domain';
import { ImageStoryDto } from './dto/image-story/ImageStoryDto';
import { AddedRatingAudioStoryDto } from './dto/rating-audio-story/AddedRatingAudioStoryDto';
import { AddRatingAudioStoryDto } from './dto/rating-audio-story/AddRatingAudioStoryDto';
import { RatingAudioStoryDto } from './dto/rating-audio-story/RatingAudioStoryDto';
import { AudioStoryLanguageDto } from './dto/audio-story/AudioStoryLanguageDto';

@Injectable()
export class StoryService {
  private readonly logger = new Logger('StoryService');
  private readonly msgException = new MessageException();
  private readonly dbExceptionHandler = new DataBaseExceptionHandler(
    PCodeMessages,
  );

  constructor(private prisma: PrismaService) {}

  async getStories(): Promise<StoryDto[]> {
    this.logger.debug('GET STORIES');
    return this.prisma.story.findMany({
      select: {
        id: true,
        name: true,
        ethnicGroup: true,
        audioId: true,
      },
    });
  }

  async getStoriesByEthnicGroup(ethnicGroupId: number): Promise<StoryDto[]> {
    this.logger.debug('GET STORIES BY ETHNIC GROUP ID');
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

  async getStoryById(storyId: number): Promise<StoryDto> {
    return await this.prisma.story
      .findUnique({
        select: {
          id: true,
          name: true,
          ethnicGroup: true,
          audioId: true,
        },
        where: {
          id: storyId,
        },
      })
      .catch((error) => {
        PrintNameAndCodePrismaException(error, this.logger);
        throw this.dbExceptionHandler.handleError(error);
      });
  }
  async getLanguagesForStory(
    storyId: number,
  ): Promise<AudioStoryLanguageDto[]> {
    this.logger.debug('GET LANGUAGES FOR STORY');
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
    this.logger.debug('ADD STORY');
    const maxCountStories = MAX_STORIES_FOR_ETHNIC_GROUP;
    return this.prisma.story
      .count({
        where: {
          ethnicGroupId: dto.ethnicGroupId,
        },
      })
      .then((result) => {
        this.logger.warn(`Count stories for ethnic group ${result}`);
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
    this.logger.debug('EDIT STORY');
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
    this.logger.debug('DELETE STORY BY ID');
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
    this.logger.debug('ADD TEXT STORY');
    return await this.prisma.textStory
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

  async getTextByStoryId(storyId: number): Promise<TextStoryDto> {
    this.logger.debug('GET TEXT STORY BY ID');
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
    this.logger.debug('SET USER AUDIO TO STORY');
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
    this.logger.debug('GET AUDIO BY AUDIO ID');
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
    this.logger.debug('GET IMG STORY BY ID');
    try {
      const imgStoryData = await this.prisma.imgStory.findUnique({
        where: {
          storyId: storyId,
        },
      });
      console.log(imgStoryData);
      if (imgStoryData) {
        const imgStoryDto: ImageStoryDto = new ImageStoryDto();
        imgStoryDto.filename = basename(imgStoryData.path);
        imgStoryDto.buffer = fs.readFileSync(imgStoryData.path);
        console.log(imgStoryDto);
        return imgStoryDto;
      }
      throw new NotFoundException();
    } catch (error) {
      PrintNameAndCodePrismaException(error, this.logger);
      throw this.dbExceptionHandler.handleError(error);
    }
  }

  async setImgForStory(storyId: number, file: File) {
    this.logger.debug('Setting image for story');
    console.log(file);
    const path = `${basePathUpload}/img/${storyId}/${getUuid(file.originalname)}${extname(file.originalname)}`;
    this.logger.debug('SET IMG FOR STORY');
    return this.prisma.imgStory
      .create({
        data: {
          filename: file.originalname,
          path: path,
          storyId: storyId,
        },
      })
      .then((createdImg: ImageStoryEntity) => {
        fs.writeFileSync(createdImg.path, file.buffer);
        const createdImgDto: CreatedImageStoryDto = new CreatedImageStoryDto();
        createdImgDto.id = createdImg.id;
        createdImgDto.storyId = createdImg.storyId;
        return createdImgDto;
      })
      .catch((error) => {
        PrintNameAndCodePrismaException(error, this.logger);
        throw this.dbExceptionHandler.handleError(error);
      });
  }

  async deleteStoryImgByStoryId(storyId: number): Promise<void> {
    this.logger.debug('DELETE STORY IMG BY STORY ID');
    try {
      const deletedStoryImg = await this.prisma.imgStory.delete({
        where: {
          storyId: storyId,
        },
      });
      fs.unlinkSync(deletedStoryImg.path);
      console.log(deletedStoryImg);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getRatingByAudioId(id: number): Promise<RatingAudioStoryDto> {
    this.logger.debug('GET RATING BY AUDIO ID');
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

  async addRatingAudioStoryById(
    userId: number,
    dto: AddRatingAudioStoryDto,
  ): Promise<AddedRatingAudioStoryDto> {
    this.logger.debug('ADD RATING AUDIO STORY BY ID');
    const currentRating = await this.prisma.ratingAudio.findFirst({
      where: {
        storyAudioId: dto.audioId,
        userId: userId,
      },
    });
    try {
      if (currentRating === null) {
        await this.prisma.ratingAudio.create({
          data: {
            storyAudioId: dto.audioId,
            userId: userId,
            rating: dto.rating,
          },
        });
      } else {
        await this.prisma.ratingAudio.update({
          where: {
            id: currentRating.id,
          },
          data: {
            rating: dto.rating,
          },
        });
      }
      const totalRatingAudio = await this.prisma.ratingAudio.aggregate({
        _avg: {
          rating: true,
        },
        where: {
          storyAudioId: dto.audioId,
        },
      });
      await this.prisma.storyAudio.update({
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
    } catch (error) {
      PrintNameAndCodePrismaException(error, this.logger);
      throw this.dbExceptionHandler.handleError(error);
    }
  }
}
