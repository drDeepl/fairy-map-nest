import { ImgStory, Story } from '@prisma/client';

export interface StoryExtendImg extends Story {
  img: ImgStory | null;
}
