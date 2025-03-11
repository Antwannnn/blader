import { Achievement, UserStats } from '@app/types/Achievement';

export const achievements: Achievement[] = [
    {
      id: 'play-100-games',
      name: 'Dedicated Typist',
      description: 'Play 100 games',
      image: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" stroke-width="3"/>
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" stroke-dasharray="3,2"/>
          <rect width="80" height="40" x="60" y="70" fill="none" stroke="currentColor" stroke-width="3" rx="5" ry="5"/>
          <path stroke="currentColor" stroke-width="2" d="M70 80h15M90 80h15M110 80h15M70 90h15M90 90h15M110 90h15M80 100h40"/>
          <text x="100" y="140" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle">100</text>
          <text x="100" y="160" font-family="Arial, sans-serif" font-size="16" text-anchor="middle">GAMES</text>
        </svg>
      ),
      condition: (stats: UserStats) => stats.totalGames >= 100
    },
    {
      id: 'play-500-games',
      name: 'Typing Maniac',
      description: 'Play 500 games',
      image: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="transparent" stroke="currentColor" stroke-width="3"/>
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" stroke-dasharray="3,2"/>
          <rect width="80" height="40" x="60" y="70" fill="none" stroke="currentColor" stroke-width="3" rx="5" ry="5"/>
          <path stroke="currentColor" stroke-width="2" d="M70 80h15M90 80h15M110 80h15M70 90h15M90 90h15M110 90h15M80 100h40"/>
          <text x="100" y="140" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle">500</text>
          <text x="100" y="160" font-family="Arial, sans-serif" font-size="16" text-anchor="middle">GAMES</text>
        </svg>
      ),
      condition: (stats: UserStats) => stats.totalGames >= 500
    },
    {
      id: 'reach-100-wpm',
      name: 'Speed Demon',
      description: 'Reach 100 WPM in a game',
      image: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="transparent" stroke="currentColor" stroke-width="3"/>
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" stroke-dasharray="3,2"/>
          <path fill="none" stroke="currentColor" stroke-width="3" d="m100 75-15 35h30Z"/>
          <path stroke="currentColor" stroke-width="3" d="M100 75v20"/>
          <path fill="none" stroke="currentColor" stroke-width="2" d="M70 90a40 40 0 0 1 60 0"/>
          <text x="100" y="140" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle">100+</text>
          <text x="100" y="160" font-family="Arial, sans-serif" font-size="16" text-anchor="middle">WPM</text>
        </svg>
      ),
      condition: (stats: UserStats) => stats.maxWpm >= 100
    },
    {
      id: 'reach-150-wpm',
      name: 'Keyboard Wizard',
      description: 'Reach 150 WPM in a game',
      image: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="90" fill="transparent" stroke="currentColor" stroke-width="3"/>
        <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" stroke-dasharray="3,2"/>
        <path fill="none" stroke="currentColor" stroke-width="3" d="m100 75-20 35h40Z"/>
        <path stroke="currentColor" stroke-width="3" d="M100 75v15"/>
        <path fill="none" stroke="currentColor" stroke-width="2" d="M65 90a45 45 0 0 1 70 0"/>
        <path stroke="currentColor" stroke-width="1.5" d="m75 70 10 5M125 70l-10 5M60 85h10M140 85h-10"/>
        <text x="100" y="140" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle">150+</text>
        <text x="100" y="160" font-family="Arial, sans-serif" font-size="16" text-anchor="middle">WPM</text>
      </svg>
      ),
      condition: (stats: UserStats) => stats.maxWpm >= 150
    },
    {
      id: 'Pixel Perfect',
      name: 'Pixel Perfect',
      description: 'Get 100% accuracy in a game',
      image: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="transparent" stroke="currentColor" stroke-width="3"/>
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" stroke-dasharray="3,2"/>
          <circle cx="100" cy="85" r="25" fill="none" stroke="currentColor" stroke-width="2"/>
          <circle cx="100" cy="85" r="15" fill="none" stroke="currentColor" stroke-width="2"/>
          <circle cx="100" cy="85" r="5"/>
          <path stroke="currentColor" stroke-width="2" d="M100 60v5M100 105v5M75 85h5M120 85h5"/>
          <text x="100" y="140" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle">100%</text>
          <text x="100" y="160" font-family="Arial, sans-serif" font-size="16" text-anchor="middle">PRECISION</text>
        </svg>
      ),
      condition: (stats: UserStats) => stats.maxAccuracy >= 100
    },
    {
      id: 'Chain Reaction',
      name: 'Chain Reaction',
      description: 'Get 100% accuracy 10 times in a row',
      image: (        
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="90" fill="transparent" stroke="currentColor" stroke-width="3"/>
        <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" stroke-dasharray="3,2"/>
        <circle cx="100" cy="85" r="25" fill="none" stroke="currentColor" stroke-width="2"/>
        <circle cx="100" cy="85" r="15" fill="none" stroke="currentColor" stroke-width="2"/>
        <circle cx="100" cy="85" r="5"/>
        <path stroke="currentColor" stroke-width="2" d="M75 85H65M125 85h10M65 85l5-5M65 85l5 5M135 85l-5-5M135 85l-5 5"/>
        <text x="100" y="140" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle">10×</text>
        <text x="100" y="160" font-family="Arial, sans-serif" font-size="16" text-anchor="middle">PERFECT</text>
      </svg>
      ),
      condition: (stats: UserStats) => stats.gamesPlayed >= 10 && stats.averageAccuracy >= 100
    }
  ];

export function getAchievement(id: string): Achievement | undefined {
    return achievements.find(achievement => achievement.id === id);
}