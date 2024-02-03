export type ProfileData = {
    username: string | undefined,
    email: string | undefined,
    avatar: string | undefined,
    keyboard: string | undefined,
    accountCreated: string | undefined,
    isAdmin: boolean | undefined,
    isVerified: boolean | undefined,
    averageWPM: number | undefined,
    averageAccuracy: number | undefined,
    averageErrors: number | undefined,
    totalWords: number | undefined,
    totalGames: number | undefined,
    totalCharacters: number | undefined,
    totalErrors: number | undefined,
  }

  export type StatisticsData = {
    averageWPM: number | undefined,
    averageAccuracy: number | undefined,
    averageErrors: number | undefined,
    totalWords: number | undefined,
    totalGames: number | undefined,
    totalCharacters: number | undefined,
    totalCorrectCharacters: number | undefined,
    totalErrors: number | undefined,
  }