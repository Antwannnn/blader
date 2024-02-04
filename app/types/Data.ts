export type UserData = {
    username: string | undefined,
    email: string | undefined,
    avatar: string | undefined,
    keyboard: string | undefined,
    bio: string | undefined,
    badges: string[] | undefined,
    accountCreated: string | undefined,
    isAdmin: boolean | undefined,
    isVerified: boolean | undefined,
  }

  export type StatisticsData = {
    averageWPM: number | undefined,
    averageAccuracy: number | undefined,
    averageErrors: number | undefined,
    totalWords: number | undefined,
    totalGames: number | undefined,
    totalCharacters: number | undefined,
    totalErrors: number | undefined,
  }