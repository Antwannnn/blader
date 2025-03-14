'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface LeaderboardEntry {
  _id: string;
  name: string;
  image: string;
  averageWpm: number;
  maxWpm: number;
  gamesPlayed: number;
  averageAccuracy: number;
}

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userGamesPlayed, setUserGamesPlayed] = useState<number | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leaderboardResponse] = await Promise.all([
          fetch('/api/user/statistics'),
        ]);
        
        const leaderboardData = await leaderboardResponse.json();
        setLeaderboard(leaderboardData);

        if (session?.user?.id) {
          const userStatsResponse = await fetch(`/api/user/statistics/${session?.user?.id}`);
          const userStats = await userStatsResponse.json();
          setUserGamesPlayed(userStats?.totalGames || 0);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-text"></div>
      </div>
    );
  }

  const podiumPlaces = leaderboard.slice(0, 3);

  return (
    <div className="min-h-screen items-center pt-24">
      <h1 className="text-4xl font-bold text-text mb-8 text-center">Global Leaderboard</h1>
      
      {session?.user && userGamesPlayed !== null && userGamesPlayed < 100 && (
        <div className="max-w-2xl mx-auto mb-8 p-4 bg-secondary/40 backdrop-blur-sm rounded-xl border border-text/20">
          <p className="text-center text-text">
            You need <span className="font-bold text-accent">{100 - userGamesPlayed}</span> more games to appear on the leaderboard.
            Currently played: <span className="font-bold text-accent">{userGamesPlayed}</span>/100
          </p>
        </div>
      )}
      
      {/* Podium Section */}
      <div className="max-w-4xl mx-auto mb-12 flex justify-center items-end h-[400px] gap-4">
        {/* Second Place */}
        {podiumPlaces[1] && (
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20 mb-2">
              <Image
                src={podiumPlaces[1].image || '/assets/icons/default.png'}
                alt={podiumPlaces[1].name}
                fill
                className="object-cover rounded-full border-4 border-[#C0C0C0]"
              />
            </div>
            <span className="text-text font-medium text-center">{podiumPlaces[1].name}</span>
            <span className="text-accent font-bold">{podiumPlaces[1].averageWpm} WPM</span>
            <div className="w-32 h-[160px] bg-secondary/40 backdrop-blur-sm rounded-t-lg mt-2"></div>
          </div>
        )}

        {/* First Place */}
        {podiumPlaces[0] && (
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 mb-2">
              <Image
                src={podiumPlaces[0].image || '/assets/icons/default.png'}
                alt={podiumPlaces[0].name}
                fill
                className="object-cover rounded-full border-4 border-[#FFD700]"
              />
            </div>
            <span className="text-text font-medium text-center">{podiumPlaces[0].name}</span>
            <span className="text-accent font-bold">{podiumPlaces[0].averageWpm} WPM</span>
            <div className="w-32 h-[200px] bg-secondary/40 backdrop-blur-sm rounded-t-lg mt-2"></div>
          </div>
        )}

        {/* Third Place */}
        {podiumPlaces[2] && (
          <div className="flex flex-col items-center">
            <div className="relative w-16 h-16 mb-2">
              <Image
                src={podiumPlaces[2].image || '/assets/icons/default.png'}
                alt={podiumPlaces[2].name}
                fill
                className="object-cover rounded-full border-4 border-[#CD7F32]"
              />
            </div>
            <span className="text-text font-medium text-center">{podiumPlaces[2].name}</span>
            <span className="text-accent font-bold">{podiumPlaces[2].averageWpm} WPM</span>
            <div className="w-32 h-[120px] bg-secondary/40 backdrop-blur-sm rounded-t-lg mt-2"></div>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto bg-secondary/40 backdrop-blur-sm rounded-xl overflow-hidden">
        {/* En-tête du tableau */}
        <div className="grid grid-cols-7 gap-4 p-4 text-text font-semibold border-b border-text/20">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-2">Player</div>
          <div className="text-center">Max WPM</div>
          <div className="text-center">Avg WPM</div>
          <div className="text-center">Accuracy</div>
          <div className="text-center">Games</div>
        </div>

        {/* Corps du tableau */}
        {leaderboard.map((entry, index) => (
          <div 
            key={entry._id}
            className={`grid grid-cols-7 gap-4 p-4 text-text hover:bg-text/5 transition-colors ${
              index % 2 === 0 ? 'bg-text/5' : ''
            }`}
          >
            {/* Position */}
            <div className="col-span-1 text-center font-bold">
              {index + 1}
            </div>

            {/* Joueur */}
            <div onClick={() => router.push(`/account/profile/${entry.name}`)} className="col-span-2 cursor-pointer flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src={entry.image || '/assets/icons/default.png'}
                  alt={entry.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-medium">{entry.name}</span>
            </div>

            {/* Statistiques */}
            <div className="text-center font-semibold text-text">
              {entry.maxWpm}
            </div>
            <div className="text-center">
              {entry.averageWpm}
            </div>
            <div className="text-center">
              {entry.averageAccuracy}%
            </div>
            <div className="text-center">
              {entry.gamesPlayed}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;