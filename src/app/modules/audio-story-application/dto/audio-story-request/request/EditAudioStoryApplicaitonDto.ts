import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { AddAudioStoryApplicationDto } from './AddAudioStoryRequestDto';
import { BaseAudioStoryApplicationDto } from '../BaseAudioStoryApplicationDto';

export class EditAudioStoryApplicaitonDto extends BaseAudioStoryApplicationDto {}
