import { ReactNode } from "@node_modules/@types/react";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  image: ReactNode;
  condition: (stats: UserStats) => boolean;
  unlockedAt?: Date;
}

export interface UserStats {
  totalGames: number;
  maxWpm: number;
  averageWpm: number;
  averageAccuracy: number;
  gamesPlayed: number;
  maxAccuracy: number;
} 