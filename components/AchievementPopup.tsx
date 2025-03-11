'use client';

import { Achievement } from '@app/types/Achievement';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const AchievementPopup = () => {
  const [achievement, setAchievement] = useState<Achievement | null>(null);
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleUnlock = (e: CustomEvent<Achievement>) => {
      setAchievement(e.detail);
      setShow(true);
      setTimeout(() => {
        setShow(false);
      }, 5000);
    };

    window.addEventListener('achievementUnlocked', handleUnlock as EventListener);
    return () => {
      window.removeEventListener('achievementUnlocked', handleUnlock as EventListener);
    };
  }, []);

  if (!mounted || !show || !achievement) return null;

  const popup = (
    <div className="fixed bottom-4 right-4 z-50 animate-slideIn">
      <div className="bg-background/80 backdrop-blur-sm border border-text/10 rounded-lg p-4 shadow-xl text-text flex items-center gap-4">
        <div className="w-16 h-16">
          {achievement.image}
        </div>
        <div>
          <h3 className="font-bold text-text">Achievement Unlocked!</h3>
          <p className="text-text/80">{achievement.name}</p>
        </div>
      </div>
    </div>
  );

  return createPortal(popup, document.body);
};

export default AchievementPopup; 