import { StopwatchMode } from "./GameParameters";

export interface KeyStroke {
  key: string;
  timestamp: number;
  position: number; // Position dans le texte
  isError: boolean;
}

export interface GameResults {
  sentence: string;
  author?: string;
  mode: StopwatchMode;
  wpmOverTime: number[];
  accuracyOverTime: number[];
  time: number;
  errors: number;
  correct: number;
  totalWords: number;
  totalCharacters: number;
  finalWpm?: number;
  finalAccuracy?: number;
  keyStrokes?: KeyStroke[];
}
