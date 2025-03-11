import { Achievement } from "./Achievement"

export type UserData = {
    username: string | undefined,
    email: string | undefined,
    avatar: string | undefined,
    keyboard: string | undefined,
    bio: string | undefined,
    badges: Achievement[] | undefined,
    accountCreated: string | undefined,
    isAdmin: boolean | undefined,
    isVerified: boolean | undefined,
  }

  export type StatisticsData = {
    averageWpm: number | undefined,
    averageAccuracy: number | undefined,
    averageErrors: number | undefined,
    wpmOverTime: {
        wpm: number,
        createdAt: string,
        index: number,
    }[],
    accuracyOverTime: {
        accuracy: number,
        createdAt: string,
        index: number,
    }[],
    errorsOverTime: {
        errors: number,
        createdAt: string,
        index: number,
    }[],
    totalWords: number | undefined,
    totalGames: number | undefined,
    totalCharacters: number | undefined,
    totalErrors: number | undefined,
    preferedLengthParameter: string | undefined,
    preferedSentenceParameter: string | undefined,
    createdAt: string | undefined,
  }