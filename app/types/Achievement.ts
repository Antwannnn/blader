import { ReactNode } from "@node_modules/@types/react";
import { GameResults } from "./GameResults";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  image?: ReactNode;
  condition?: (stats: UserStats) => boolean;
  unlockedAt?: Date;
}

export interface UserStats {
  gameStats: GameResults;
  profileStats: any;
} 