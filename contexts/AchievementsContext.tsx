'use client';

import { Achievement } from '@app/types/Achievement';
import { useSession } from 'next-auth/react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAchievement } from './Achievements';

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
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/user/${session.user.id}`);
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
      const encryptedResults = localStorage.getItem('lastGameResults');
      if (!encryptedResults) {
        return [];
      }
      
      const response = await fetch('/api/achievements/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          encryptedGameResults: encryptedResults
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to check achievements');
      }
      
      const { newAchievements } = await response.json();
      
      if (newAchievements.length > 0) {
        // Récupérer les détails des nouveaux achievements
        const achievementDetails = newAchievements.map((id: string) => getAchievement(id)).filter(Boolean);
        
        // Mettre à jour l'état local
        setUnlockedAchievements(prev => [...prev, ...achievementDetails]);
        
        return achievementDetails;
      }
      
      return [];
    } catch (error) {
      console.error('Error checking achievements:', error);
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