import { LengthParameter, GameTypeParameter } from "./GameParameters";

export interface GameResults {
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
