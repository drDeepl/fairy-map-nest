import { join } from 'path';

interface BasePathAudioParams {
  userId: number;
  storyId: number;
  languageId: number;
}

export interface PreparePathUploadAudioParams extends BasePathAudioParams {
  baseUploadPath: string;
}

export function preparePathToAudioUpload(params: PreparePathUploadAudioParams) {
  console.log(process.env.APP_URL);
  return join(`${params.userId}`, `${params.storyId}`, `${params.languageId}`);
}

export interface PrepareSrcAudioParams extends BasePathAudioParams {}

// export function prepareSrcAudio(params: PrepareSrcAudioParams) {
//   `${this.configService.get('APP_URL')}/uploads/audio/${audio.userAudio.userId}/${audio.userAudio.language.id}/${audio.userAudio.name}`;
// }
