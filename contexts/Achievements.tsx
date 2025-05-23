import { Achievement } from '@app/types/Achievement';

export const achievements: Achievement[] = [
    {
      id: 'play-100-games',
      name: 'Dedicated Typist',
      description: 'Play 100 games',
      image: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="3"/>
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeDasharray="3,2"/>
          <rect width="80" height="40" x="60" y="70" fill="none" stroke="currentColor" strokeWidth="3" rx="5" ry="5"/>
          <path stroke="currentColor" strokeWidth="2" d="M70 80h15M90 80h15M110 80h15M70 90h15M90 90h15M110 90h15M80 100h40"/>
          <text x="100" y="140" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" textAnchor="middle">100</text>
          <text x="100" y="160" fontFamily="Arial, sans-serif" fontSize="16" textAnchor="middle">GAMES</text>
        </svg>
      ),
    },
    {
      id: 'play-500-games',
      name: 'Typing Maniac',
      description: 'Play 500 games',
      image: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="transparent" stroke="currentColor" strokeWidth="3"/>
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeDasharray="3,2"/>
          <rect width="80" height="40" x="60" y="70" fill="none" stroke="currentColor" strokeWidth="3" rx="5" ry="5"/>
          <path stroke="currentColor" strokeWidth="2" d="M70 80h15M90 80h15M110 80h15M70 90h15M90 90h15M110 90h15M80 100h40"/>
          <text x="100" y="140" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" textAnchor="middle">500</text>
          <text x="100" y="160" fontFamily="Arial, sans-serif" fontSize="16" textAnchor="middle">GAMES</text>
        </svg>
      ),
    },
    {
      id: 'reach-100-wpm',
      name: 'Speed Demon',
      description: 'Reach 100 WPM in a game',
      image: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="transparent" stroke="currentColor" strokeWidth="3"/>
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeDasharray="3,2"/>
          <path fill="none" stroke="currentColor" strokeWidth="3" d="m100 75-15 35h30Z"/>
          <path stroke="currentColor" strokeWidth="3" d="M100 75v20"/>
          <path fill="none" stroke="currentColor" strokeWidth="2" d="M70 90a40 40 0 0 1 60 0"/>
          <text x="100" y="140" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" textAnchor="middle">100+</text>
          <text x="100" y="160" fontFamily="Arial, sans-serif" fontSize="16" textAnchor="middle">WPM</text>
        </svg>
      ),
    },
    {
      id: 'reach-150-wpm',
      name: 'Keyboard Wizard',
      description: 'Reach 150 WPM in a game',
      image: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="90" fill="transparent" stroke="currentColor" stroke-width="3"/>
        <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeDasharray="3,2"/>
        <path fill="none" stroke="currentColor" strokeWidth="3" d="m100 75-20 35h40Z"/>
        <path stroke="currentColor" strokeWidth="3" d="M100 75v15"/>
        <path fill="none" stroke="currentColor" strokeWidth="2" d="M65 90a45 45 0 0 1 70 0"/>
        <path stroke="currentColor" strokeWidth="1.5" d="m75 70 10 5M125 70l-10 5M60 85h10M140 85h-10"/>
        <text x="100" y="140" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" textAnchor="middle">150+</text>
        <text x="100" y="160" fontFamily="Arial, sans-serif" fontSize="16" textAnchor="middle">WPM</text>
      </svg>
      ),
    },
    {
      id: 'pixel-perfect',
      name: 'Pixel Perfect',
      description: 'Get 100% accuracy in a game',
      image: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="transparent" stroke="currentColor" strokeWidth="3"/>
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeDasharray="3,2"/>
          <circle cx="100" cy="85" r="25" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="100" cy="85" r="15" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="100" cy="85" r="5"/>
          <path stroke="currentColor" strokeWidth="2" d="M100 60v5M100 105v5M75 85h5M120 85h5"/>
          <text x="100" y="140" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" textAnchor="middle">100%</text>
          <text x="100" y="160" fontFamily="Arial, sans-serif" fontSize="16" textAnchor="middle">PRECISION</text>
        </svg>
      ),
    },
    {
      id: 'chain-reaction',
      name: 'Chain Reaction',
      description: 'Get 100% accuracy 10 times in a row',
      image: (        
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="90" fill="transparent" stroke="currentColor" strokeWidth="3"/>
        <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeDasharray="3,2"/>
        <circle cx="100" cy="85" r="25" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="100" cy="85" r="15" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="100" cy="85" r="5"/>
        <path stroke="currentColor" strokeWidth="2" d="M75 85H65M125 85h10M65 85l5-5M65 85l5 5M135 85l-5-5M135 85l-5 5"/>
        <text x="100" y="140" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" textAnchor="middle">10×</text>
        <text x="100" y="160" fontFamily="Arial, sans-serif" fontSize="16" textAnchor="middle">PERFECT</text>
      </svg>
      ),

    },
    {
      id: 'misclick-marathon',
      name: 'Misclick marathon',
      description: 'Make more than 10 errors in a game',
      image: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="transparent" stroke="currentColor" strokeWidth="3"/>
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeDasharray="3,2"/>
          <path stroke="currentColor" strokeWidth="3" d="m80 65 40 40M120 65l-40 40"/>
          <text x="100" y="140" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" textAnchor="middle">10+</text>
          <text x="100" y="160" fontFamily="Arial, sans-serif" fontSize="16" textAnchor="middle">ERRORS</text>
        </svg>
      ),
    },
    {
      id: 'coffee-break',
      name: 'Coffee break',
      description: "Play for the first time in 3 days",
      image: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="transparent" stroke="currentColor" strokeWidth="3"/>
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeDasharray="3,2"/>
          <path fill="none" stroke="currentColor" strokeWidth="2" d="M75 70h50l-5 35H80ZM125 80c10 5 10 15 0 20"/>
          <path stroke="currentColor" strokeWidth="2" d="M85 65h30"/>
          <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M90 60c5-10 5-5 0-10M100 60c5-10 5-5 0-10M110 60c5-10 5-5 0-10"/>
          <text x="100" y="140" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" textAnchor="middle">3</text>
          <text x="100" y="160" fontFamily="Arial, sans-serif" fontSize="16" textAnchor="middle">DAYS</text>
        </svg>
      ),
    },
    {
      id: 'eequalsmc2',
      name: 'E=MC²',
      description: 'Type a quote from Albert Einstein',
      image: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="transparent" stroke="currentColor" strokeWidth="3"/>
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeDasharray="3,2"/>
          <ellipse cx="100" cy="75" fill="none" stroke="currentColor" strokeWidth="2" rx="25" ry="30"/>
          <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M80 55c-5-5-10-8-15-5 5-8 15-5 15 5zM90 50c-3-8-8-10-12-8 3-5 12-2 12 8zM100 48c0-8-5-10-8-8 0-5 8-3 8 8zM110 50c3-8 8-10 12-8-3-5-12-2-12 8zM120 55c5-5 10-8 15-5-5-8-15-5-15 5z"/>
          <path fill="none" stroke="currentColor" strokeWidth="2" d="M90 90c5 5 15 5 20 0"/>
          <circle cx="90" cy="80" r="5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="110" cy="80" r="5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          <path stroke="currentColor" strokeWidth="1.5" d="M95 80h10"/>
          <text x="100" y="140" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold" textAnchor="middle">E=MC²</text>
        </svg>
      ),
    },
    {
      id: 'night-owl',
      name: 'Night Owl',
      description: 'Play after midnight',
      image: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="transparent" stroke="currentColor" strokeWidth="3"/>
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeDasharray="3,2"/>
          <path fill="currentColor" d="m40 50 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1ZM150 40l2 5 6 1-4 4 1 6-5-3-5 3 1-6-4-4 6-1ZM160 70l1 3h4l-3 3 1 4-3-2-3 2 1-4-3-3h4ZM60 30l1 3h4l-3 3 1 4-3-2-3 2 1-4-3-3h4ZM130 120l1 3h4l-3 3 1 4-3-2-3 2 1-4-3-3h4ZM70 110l1 3h4l-3 3 1 4-3-2-3 2 1-4-3-3h4ZM70 80c0-20 15-35 35-35-15 0-30 15-30 35s15 35 30 35c-20 0-35-15-35-35Z"/>
          <text x="100" y="150" fontFamily="Arial, sans-serif" fill='currentColor' fontSize="16" fontWeight="bold" textAnchor="middle">NIGHT OWL</text>
        </svg>
      ),
    },
    {
      id: 'endless-prose',
      name: 'Endless Prose',
      description: 'Type a veeeeeeery long sentence',
      image: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="transparent" stroke="currentColor" strokeWidth="3"/>
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeDasharray="3,2"/>
          <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M60 70v50c15-10 35-10 40-10V60c-5 0-25 0-40 10ZM140 70v50c-15-10-35-10-40-10V60c5 0 25 0 40 10Z"/>
          <path stroke="currentColor" d="M70 75h20M70 80h20M70 85h20M70 90h20M70 95h20M70 100h20M70 105h20M110 75h20M110 80h20M110 85h20M110 90h20M110 95h20M110 100h20M110 105h20"/>
          <text x="100" y="150" fill="currentColor" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" textAnchor="middle">ENDLESS PROSE</text>
        </svg>
      ),
    },
    {
      id: 'practice-makes-perfect',
      name: 'Practice makes perfect',
      description: 'Make 1000 errors',
      image: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="transparent" stroke="currentColor" strokeWidth="3"/>
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeDasharray="3,2"/>
          <path stroke="currentColor" strokeWidth="1.5" d="m60 65 8 8m-8 0 8-8M75 50l8 8m-8 0 8-8M100 40l8 8m-8 0 8-8M125 50l8 8m-8 0 8-8M145 65l8 8m-8 0 8-8M50 85l8 8m-8 0 8-8M70 70l8 8m-8 0 8-8M90 60l8 8m-8 0 8-8M110 60l8 8m-8 0 8-8M130 70l8 8m-8 0 8-8M150 85l8 8m-8 0 8-8M85 85l8 8m-8 0 8-8M115 85l8 8m-8 0 8-8M65 110l8 8m-8 0 8-8M135 110l8 8m-8 0 8-8M85 35l8 8m-8 0 8-8M115 35l8 8m-8 0 8-8M40 65l8 8m-8 0 8-8M160 65l8 8m-8 0 8-8M50 50l8 8m-8 0 8-8M150 50l8 8m-8 0 8-8M40 95l8 8m-8 0 8-8M160 95l8 8m-8 0 8-8M100 70l8 8m-8 0 8-8M80 100l8 8m-8 0 8-8M120 100l8 8m-8 0 8-8M55 115l8 8m-8 0 8-8M145 115l8 8m-8 0 8-8"/>
          <text x="100" fill='currentColor' y="140" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" textAnchor="middle">1000</text>
          <text x="100" fill='currentColor' y="160" fontFamily="Arial, sans-serif" fontSize="16" textAnchor="middle">ERRORS</text>
        </svg>
      ),
    },
    {
      id: "broken-keyboard",
      name: "Broken Keyboard",
      description: "Type 10000 characters.",
      image: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="transparent" stroke="currentColor" strokeWidth="3"/>
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeDasharray="3,2"/>
          <rect width="80" height="50" x="60" y="65" fill="none" stroke="currentColor" strokeWidth="2" rx="5"/>
          <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M65 70h10v10H65zM80 70h10v10H80zM95 70h10v10H95zM110 70h10v10h-10zM125 70h10v10h-10zM70 85h10v10H70zM85 85h10v10H85zM100 85h10v10h-10zM115 85h10v10h-10zM75.654 98.647l24.757 3.48-1.114 7.922-24.756-3.48zM104.69 100.887l19.923-1.743.698 7.97-19.924 1.742z"/>
          <text x="100" y="140" fill='currentColor' fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" textAnchor="middle">10000</text>
          <text x="100" y="160" fill='currentColor' fontFamily="Arial, sans-serif" fontSize="14" textAnchor="middle">CHARACTERS</text>
        </svg>
      ),
    },
    {
      id: "top-100",
      name: "Top 100",
      description: "Reach the top 100 in the global leaderboard",
      image: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="transparent" stroke="currentColor" strokeWidth="3"/>
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeDasharray="3,2"/>
          <path fill="none" stroke="currentColor" strokeWidth="2" d="M85 60h30v10s10 0 10 10-10 10-10 10c0 10-10 15-15 15s-15-5-15-15c0 0-10 0-10-10s10-10 10-10V60z"/>
          <path fill="none" stroke="currentColor" strokeWidth="2" d="M95 95h10v15H95zM85 110h30v5H85z"/>
          <text x="100" y="140" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" textAnchor="middle">TOP</text>
          <text x="100" y="160" fontFamily="Arial, sans-serif" fontSize="18" textAnchor="middle">100</text>
        </svg>
      ),
    },
    {
      id: "speed-god",
      name: "Speed God",
      description: "Reach 250 WPM in a game",
      image: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="transparent" stroke="currentColor"/>
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor"/>
          <path fill="none" stroke="currentColor" d="M75 75h50l-25 35zM100 75V65"/>
          <path fill="none" stroke="currentColor" d="M50 85a50 50 0 0 1 100 0"/>
          <path fill="none" stroke="currentColor" d="M60 70s10-5 20 0m60 0s-10-5-20 0M100 120c-15 0-20-5-20-5s5-5 20-5 20 5 20 5-5 5-20 5z"/>
          <text fill="currentColor" x="100" y="140">250+</text>
          <text fill="currentColor" x="100" y="160">WPM</text>
        </svg>
      ),
    },
    {
      id: "ashen-one",
      name: "Ashen One",
      description: "Type a Dark Souls III quote.",
      image: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="transparent" stroke="currentColor"/>
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor"/>
          <circle cx="100" cy="100" r="76" fill="none" stroke="currentColor"/>
          <circle cx="100" cy="80" r="20"/>
          <circle cx="100" cy="80" r="20" fill="none" stroke="currentColor"/>
          <circle cx="93" cy="75" r="15" fill="transparent" stroke="currentColor"/>
          <circle cx="100" cy="80" r="23" fill="none" stroke="currentColor"/>
          <circle cx="100" cy="80" r="26" fill="none" stroke="currentColor"/>
          <path stroke="currentColor" d="M100 100v25M95 105h10M90 110h20"/>
          <circle stroke="currentColor" cx="75" cy="75" r="1"/>
          <circle stroke="currentColor" cx="125" cy="75" r="1"/>
          <circle stroke="currentColor" cx="70" cy="85" r="1.5"/>
          <circle stroke="currentColor" cx="130" cy="85" r="1.5"/>
          <circle stroke="currentColor" cx="80" cy="90" r="1"/>
          <circle stroke="currentColor" cx="120" cy="90" r="1"/>
          <circle stroke="currentColor" cx="85" cy="120" r="1"/>
          <circle stroke="currentColor" cx="115" cy="120" r="1"/>
          <text x="100" y="150" fill="currentColor" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" textAnchor="middle">ASHEN ONE</text>
        </svg>
      ),
    },
    {
      id: "tarnished",
      name: "Tarnished",
      description: "Type a quote from Elden Ring.",
      image: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="transparent" stroke="currentColor" stroke-width="2"/>
          <path fill="transparent" stroke="currentColor" stroke-width="3" d="M100 10a90 90 0 0 1 90 90"/>
          <path fill="transparent" stroke="currentColor" stroke-dasharray="15,5" stroke-width="2" d="M190 100a90 90 0 0 1-90 90"/>
          <path fill="transparent" stroke="currentColor" stroke-width="3" d="M100 190a90 90 0 0 1-90-90"/>
          <path fill="transparent" stroke="currentColor" stroke-dasharray="10,5" stroke-width="2" d="M10 100a90 90 0 0 1 90-90"/>
          <path fill="transparent" stroke="currentColor" stroke-width="4" d="M100 30v110"/>
          <path fill="transparent" stroke="currentColor" stroke-width="3" d="M70 60q30-30 60 0"/>
          <path fill="transparent" stroke="currentColor" stroke-width="3" d="M60 80q40-40 80 0"/>
          <path fill="transparent" stroke="currentColor" stroke-width="3" d="M50 100q50-50 100 0"/>
          <path fill="transparent" stroke="currentColor" stroke-width="1.5" d="m90 140-20 30M100 140v35M110 140l20 30"/>
          <circle cx="100" cy="140" r="6"/>
          <circle cx="100" cy="140" r="10" fill="transparent" stroke="currentColor"/>
          <path fill="transparent" stroke="currentColor" stroke-width="2" d="M65 120q35-30 70 0"/>
          <text x="100" y="160" font-family="Georgia, serif" font-size="16" font-weight="bold" text-anchor="middle">TARNISHED</text>
          </svg>
      )
    },
  ];

export function getAchievement(id: string): Achievement | undefined {
    return achievements.find(achievement => achievement.id === id);
}