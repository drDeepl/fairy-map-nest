import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { AddAudioStoryRequestDto } from './AddAudioStoryRequestDto';
import { BaseAudioStoryRequestDto } from './BaseAudioStoryRequestDto';

export class EditAudioStoryRequestDto extends BaseAudioStoryRequestDto {}
