import { Achievement, UserStats } from '@app/types/Achievement';

export const achievements: Achievement[] = [
  // Copier tous les achievements existants ici
  {
    id: 'play-100-games',
    name: 'Dedicated Typist',
    description: 'Play 100 games',
    condition: (stats: UserStats) => stats.profileStats.totalGames >= 100
  },
  {
    id: 'play-500-games',
    name: 'Typing Maniac',
    description: 'Play 500 games',
    condition: (stats: UserStats) => stats.profileStats.totalGames >= 500
  },
  {
    id: 'reach-100-wpm',
    name: 'Speed Demon',
    description: 'Reach 100 WPM in a game',
    condition: (stats: UserStats) => stats.profileStats.maxWpm >= 100
  },
  {
    id: 'reach-150-wpm',
    name: 'Keyboard Wizard',
    description: 'Reach 150 WPM in a game',
    condition: (stats: UserStats) => stats.profileStats.maxWpm >= 150
  },
  {
    id: 'pixel-perfect',
    name: 'Pixel Perfect',
    description: 'Get 100% accuracy in a game',
    condition: (stats: UserStats) => stats.profileStats.maxAccuracy >= 100
  },
  {
    id: 'chain-reaction',
    name: 'Chain Reaction',
    description: 'Get 100% accuracy 10 times in a row',
    condition: (stats: UserStats) => 
      stats.profileStats.last10Accuracies.length >= 10 && 
      stats.profileStats.last10Accuracies.every((accuracy: number) => accuracy === 100)
  },
  {
    id: 'misclick-marathon',
    name: 'Misclick marathon',
    description: 'Make more than 10 errors in a game',
    condition: (stats: UserStats) => stats.gameStats.errors > 10
  },
  {
    id: 'coffee-break',
    name: 'Coffee break',
    description: "Play for the first time in 3 days",
    condition: (stats: UserStats) => stats.profileStats.daysSinceLastGame >= 3 && stats.profileStats.totalGames > 0
  },
  {
    id: 'eequalsmc2',
    name: 'E=MC²',
    description: 'Type a quote from Albert Einstein',
    condition: (stats: UserStats) => stats.gameStats.author === 'Albert Einstein'
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Play after midnight',
    condition: () => {
      const now = new Date();
      const hours = now.getHours();
      return hours >= 0 && hours < 6;
    }
  },
  {
    id: 'endless-prose',
    name: 'Endless Prose',
    description: 'Type a veeeeeeery long sentence',
    condition: (stats: UserStats) => stats.gameStats.totalCharacters >= 200
  },
  {
    id: 'practice-makes-perfect',
    name: 'Practice makes perfect',
    description: 'Make 1000 errors',
    condition: (stats: UserStats) => stats.profileStats.totalErrors >= 1000
  },
  {
    id: "broken-keyboard",
    name: "Broken Keyboard",
    description: "Type 10000 characters.",
    condition: (stats: UserStats) => stats.profileStats.totalCharacters >= 10000
  },
  {
    id: "top-100",
    name: "Top 100",
    description: "Reach the top 100 in the global leaderboard",
    condition: (stats: UserStats) => stats.profileStats.globalRank <= 100
  },
  {
    id: "speed-god",
    name: "Speed God",
    description: "Reach 250 WPM in a game",
    condition: (stats: UserStats) => stats.profileStats.maxWpm >= 250
  },
  {
    id: "ashen-one",
    name: "Ashen One",
    description: "Type a Dark Souls III quote.",
    condition: (stats: UserStats) => stats.gameStats.author === 'Lothric, Younger Prince'
  },
  {
    id: "tarnished",
    name: "Tarnished",
    description: "Type a quote from Elden Ring.",
    condition: (stats: UserStats) => stats.gameStats.author === 'Malenia, Blade of Miquella'
  },



];

export function getAchievement(id: string): Achievement | undefined {
  return achievements.find(achievement => achievement.id === id);
}

export function checkUserAchievements(stats: UserStats, unlockedAchievements: string[]): string[] {
  return achievements
    .filter(achievement => 
      !unlockedAchievements.includes(achievement.id) && 
      achievement.condition && achievement.condition(stats)
    )
    .map(achievement => achievement.id);
} 