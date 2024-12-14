import { join } from 'path';

interface BasePathAudioParams {
  userId: number;
  storyId: number;
  languageId: number;
}

export interface PreparePathUploadAudioParams extends BasePathAudioParams {
  baseUploadPath: string;
}

export interface PrepareSrcAudioParams extends BasePathAudioParams {
  appUrl: string;
  filename: string;
}

export function preparePathToAudioUpload(params: PreparePathUploadAudioParams) {
  console.log(process.env.APP_URL);
  return join(
    params.baseUploadPath,
    `${params.storyId}`,
    `${params.userId}`,
    `${params.languageId}`,
  );
}

export function prepareSrcAudio(params: PrepareSrcAudioParams): string {
  return `${params.appUrl}/uploads/audio/${params.storyId}/${params.userId}/${params.languageId}/${params.filename}`;
}
