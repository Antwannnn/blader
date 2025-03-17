import User from '@/models/User';
import UserStatistics from '@/models/UserStatistics';
import { decryptGameData } from '@utils/cryptoUtils';
import dbConnect from '@utils/dbConnect';
import { NextRequest, NextResponse } from 'next/server';
import { checkUserAchievements } from '../achievements';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { userId, encryptedGameResults } = await req.json();
    
    if (!userId || !encryptedGameResults) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }
    
    // Récupérer les statistiques de l'utilisateur
    const userStats = await UserStatistics.find({ userRef: userId }).sort({ createdAt: -1 });
    
    if (!userStats || userStats.length === 0) {
      return NextResponse.json({ error: 'User statistics not found' }, { status: 404 });
    }
    
    // Récupérer l'utilisateur avec ses badges
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const unlockedAchievements = user.badges?.map((badge: { id: string }) => badge.id) || [];
    
    // Décrypter les résultats du jeu
    const gameResults = await decryptGameData(encryptedGameResults);
    
    if (!gameResults) {
      return NextResponse.json({ error: 'Invalid game results' }, { status: 400 });
    }
    
    // Agréger les statistiques de l'utilisateur
    const aggregatedStats = userStats.reduce((acc, stat) => {
      acc.totalGames = (acc.totalGames || 0) + 1;
      acc.totalCharacters = (acc.totalCharacters || 0) + stat.totalCharacters;
      acc.totalErrors = (acc.totalErrors || 0) + stat.totalErrors;
      acc.maxWpm = Math.max(acc.maxWpm || 0, stat.wpm);
      acc.maxAccuracy = Math.max(acc.maxAccuracy || 0, stat.accuracy);
      
      // Ajouter d'autres statistiques pertinentes
      return acc;
    }, {});
    
    // Récupérer les 10 dernières précisions pour l'achievement "chain-reaction"
    aggregatedStats.last10Accuracies = userStats
      .slice(0, 10)
      .map(stat => stat.accuracy);
    
    // Préparer les données pour la vérification des achievements
    const statsForCheck = {
      gameStats: gameResults,
      profileStats: aggregatedStats
    };
    
    // Vérifier les nouveaux achievements
    const newAchievements = checkUserAchievements(statsForCheck, unlockedAchievements);
    
    if (newAchievements.length > 0) {
      // Ajouter les nouveaux badges à l'utilisateur
      const updatedBadges = [
        ...(user.badges || []),
        ...newAchievements.map(id => ({ id }))
      ];
      
      await User.findByIdAndUpdate(userId, { badges: updatedBadges });
    }
    
    return NextResponse.json({ newAchievements });
  } catch (error) {
    console.error('Error checking achievements:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 