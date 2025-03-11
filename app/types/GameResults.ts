
export interface GameResults {
  sentence: string;
  author?: string;
  wpmOverTime: number[];
  accuracyOverTime: number[];
  time: number;
  errors: number;
  correct: number;
  totalWords: number;
  totalCharacters: number;
  finalWpm?: number;
  finalAccuracy?: number;

}
