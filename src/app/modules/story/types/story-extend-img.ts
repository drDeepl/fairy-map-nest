import { EthnicGroup, ImgStory, Story } from '@prisma/client';

export interface StoryExtendImg {
  id: number;
  name: string;
  audioId: number | null;
  ethnicGroup: EthnicGroup;
  img: ImgStory | null;
}
