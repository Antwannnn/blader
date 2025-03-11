'use client';

import { Achievement, UserStats } from '@app/types/Achievement';
import { GameResults } from '@app/types/GameResults';
import { useSession } from 'next-auth/react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { achievements } from './Achievements';
interface AchievementsContextType {
  unlockedAchievements: Achievement[];
  checkAchievements: (userId: string) => Promise<Achievement[]>;
  showUnlockAnimation: (achievement: Achievement) => void;
}

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

export const AchievementsProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);

  // Charger les achievements débloqués depuis la BD au chargement
  useEffect(() => {
    const fetchUnlockedAchievements = async () => {
      if (session?.user?.name) {
        try {
          const response = await fetch(`/api/user/${session.user.name}`);
          const userData = await response.json();
          setUnlockedAchievements(userData.user.badges || []);
        } catch (error) {
          console.error('Error fetching achievements:', error);
        }
      }
    };

    fetchUnlockedAchievements();
  }, [session]);

  const checkAchievements = async (userId: string) => {
    try {
      // Récupérer les statistiques à jour
      const statsResponse = await fetch(`/api/user/statistics/${userId}`);
      const statsData = await statsResponse.json();

      const gameResults: GameResults = JSON.parse(localStorage.getItem('lastGameResults') || '{}');

      console.log(gameResults);

      const stats: UserStats = {
        gameStats: gameResults,
        profileStats: statsData
      };

      console.log(stats);

      // Vérifier les nouveaux achievements
      const newlyUnlocked = achievements.filter(achievement => {
        const alreadyUnlocked = unlockedAchievements.find(a => a.id === achievement.id);
        return !alreadyUnlocked && achievement.condition(stats);
      });

      if (newlyUnlocked.length > 0) {
        // Mettre à jour les badges dans la BD
        const response = await fetch(`/api/user/badges/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            badges: [...unlockedAchievements, ...newlyUnlocked]
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update badges');
        }

        // Mettre à jour l'état local
        setUnlockedAchievements(prev => [...prev, ...newlyUnlocked]);
      }

      return newlyUnlocked;
    } catch (error) {
      console.error('Error updating achievements:', error);
      return [];
    }
  };

  const showUnlockAnimation = (achievement: Achievement) => {
    const event = new CustomEvent('achievementUnlocked', { 
      detail: achievement 
    });
    window.dispatchEvent(event);
  };

  return (
    <AchievementsContext.Provider value={{
      unlockedAchievements,
      checkAchievements,
      showUnlockAnimation
    }}>
      {children}
    </AchievementsContext.Provider>
  );
};

export const useAchievements = () => {
  const context = useContext(AchievementsContext);
  if (!context) {
    throw new Error('useAchievements must be used within AchievementsProvider');
  }
  return context;
}; 