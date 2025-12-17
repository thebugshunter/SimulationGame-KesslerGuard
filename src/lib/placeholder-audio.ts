import data from './placeholder-audio.json';

export type AudioPlaceholder = {
  id: string;
  description: string;
  audioUrl: string;
};

export const PlaceHolderAudio: AudioPlaceholder[] = data.placeholderAudio;
