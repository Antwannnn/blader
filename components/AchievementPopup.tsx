'use client';

import { Achievement } from '@app/types/Achievement';
import { useEffect, useState } from 'react';

const AchievementPopup = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleUnlock = (e: CustomEvent<Achievement>) => {
      setAchievements(prev => [...prev, e.detail]);
    };

    window.addEventListener('achievementUnlocked', handleUnlock as EventListener);
    return () => {
      window.removeEventListener('achievementUnlocked', handleUnlock as EventListener);
    };
  }, [expanded]);

  if (achievements.length === 0) return null;

  return (
    <div 
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => {
        setExpanded(false);
        // Nettoyer tous les achievements quand on quitte le hover
        setTimeout(() => setAchievements([]), 200);
      }}
    >
      {expanded ? (
        // Mode expanded : afficher tous les achievements
        achievements.map((achievement, index) => (
          <div 
            key={achievement.id}
            className="bg-background/80 backdrop-blur-sm border border-text/10 rounded-lg p-4 shadow-xl text-text flex items-center gap-4 animate-scaleIn"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="w-16 h-16">
              {achievement.image}
            </div>
            <div>
              <h3 className="font-bold text-text">Achievement Unlocked!</h3>
              <p className="text-text/80">{achievement.name}</p>
              <p className="text-sm text-text/60">{achievement.description}</p>
            </div>
          </div>
        ))
      ) : (
        // Mode compact : afficher juste le nombre d'achievements
        <div className="bg-background/80 backdrop-blur-sm border border-text/10 rounded-lg p-4 shadow-xl text-text flex items-center gap-4 animate-slideIn">
          <div className="w-16 h-16">
            {achievements[achievements.length - 1].image}
          </div>
          <div>
            <h3 className="font-bold text-text">
              {achievements.length > 1 
                ? `${achievements.length} Achievements Unlocked!` 
                : 'Achievement Unlocked!'}
            </h3>
            <p className="text-text/80">
              {achievements.length > 1 
                ? 'Hover to see all' 
                : achievements[0].name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementPopup; 