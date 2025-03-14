'use client';

import { useAchievements } from '@/contexts/AchievementsContext';
import { decryptGameData } from '@/utils/cryptoUtils';
import { StopwatchMode } from '@app/types/GameParameters';
import { GameResults } from '@app/types/GameResults';
import Link from '@node_modules/next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const ResultsPage = () => {
  const [results, setResults] = useState<GameResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [renderCharts, setRenderCharts] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { checkAchievements, showUnlockAnimation } = useAchievements();
  const onUnmount = useRef(() => {});
  const animationKey = useRef(0);
  const chartKey = useRef(Date.now());

  useEffect(() => {
    const processResults = async () => {
      try {
        setIsLoading(true);
        setRenderCharts(false);
        
        const encryptedResults = localStorage.getItem('lastGameResults');
        
        if (!encryptedResults) {
          console.log('Aucun résultat trouvé dans localStorage');
          router.replace('/game/typetester');
          return;
        }
        
        const decryptedResults = await decryptGameData(encryptedResults);
        
        if (!decryptedResults) {
          console.error('Déchiffrement a retourné null/undefined');
          router.replace('/game/typetester');
          return;
        }
        
        setResults(decryptedResults);
        setIsLoading(false);
        
        setTimeout(() => {
          chartKey.current = Date.now();
          setRenderCharts(true);
        }, 100);
        
        if (session?.user && !hasSubmitted) {
          await saveUserStatistics(decryptedResults);
          setHasSubmitted(true);
          
          localStorage.removeItem('lastGameResults');
        }
      } catch (error) {
        console.error('Erreur lors du traitement des résultats:', error);
        setIsLoading(false);
        router.replace('/game/typetester');
      }
    };
    
    processResults();
  }, [session?.user]);

  useEffect(() => {
    return () => {
      if (localStorage.getItem('lastGameResults')) {
        localStorage.removeItem('lastGameResults');
      }
    };
  }, []);

  const handleTryAgain = () => {
    localStorage.removeItem('lastGameResults');
    localStorage.removeItem('resultsSubmitted');
    router.push('/game/typetester');
  };

  const saveUserStatistics = async (gameResults: GameResults) => {
    try {
      console.log("Données à envoyer:", {
        wpm: gameResults.finalWpm,
        accuracy: gameResults.finalAccuracy,
        totalWords: gameResults.totalWords,
        totalCharacters: gameResults.totalCharacters,
        totalErrors: gameResults.errors,
      });
      

      const lengthParameter = localStorage.getItem('lastGameLengthParameter');
      const sentenceParameter = localStorage.getItem('lastGameSentenceParameter');
      const stopwatchMode = localStorage.getItem('lastGameStopwatchMode') || StopwatchMode.TIMER;
      const timeParameter = localStorage.getItem('lastGameTimeParameter');

      const requestData = {
        userRef: session?.user?.id,
        wpm: typeof gameResults.finalWpm === 'number' ? gameResults.finalWpm : 0,
        accuracy: typeof gameResults.finalAccuracy === 'number' ? gameResults.finalAccuracy : 0,
        totalWords: typeof gameResults.totalWords === 'number' ? gameResults.totalWords : 0,
        totalCharacters: typeof gameResults.totalCharacters === 'number' ? gameResults.totalCharacters : 0,
        totalErrors: typeof gameResults.errors === 'number' ? gameResults.errors : 0,
        lengthParameter: lengthParameter || '',
        sentenceParameter: sentenceParameter || '',
        stopwatchMode: stopwatchMode,
        timeParameter: timeParameter || ''
      };

      const response = await fetch(`/api/user/statistics/${session?.user?.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur serveur:', errorData);
        throw new Error(`Échec de l'enregistrement des statistiques: ${response.status} ${response.statusText}`);
      }

      const newAchievements = await checkAchievements(session?.user?.id!);
      
      newAchievements.forEach(achievement => {
        showUnlockAnimation(achievement);
      });

    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des statistiques:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-text text-xl">Chargement des résultats...</div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text text-xl">What are you doing here?</p>
      </div>
    );
  }

  const timeInSeconds = results.time / 1000;
  const formattedTime = `${Math.floor(timeInSeconds / 60)}:${(timeInSeconds % 60).toFixed(1)}`;
  const mode = results.mode || StopwatchMode.TIMER;

  const chartData = results.wpmOverTime.map((wpm, index) => ({
    time: index,
    wpm: wpm,
    accuracy: results.accuracyOverTime[index]
  }));

  return (
    <div className="min-h-screen mt-16 p-4 flex flex-col w-screen justify-center items-center gap-8" key={animationKey.current}>
      <div className="flex justify-between w-full items-center animate-fadeIn">
        <h1 className="text-4xl font-bold text-text">Results</h1>
        <div className="flex gap-4">
          <button
            onClick={handleTryAgain}
            className="px-4 py-2 bg-secondary backdrop-blur-sm duration-300 text-text rounded-lg hover:bg-tertiary"
          >
            Try Again
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 w-full md:grid-cols-4 gap-4 animate-fadeIn animation-delay-200">
        <div className="bg-secondary/40 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-text/50 text-sm">Final WPM</h3>
          <p className="text-text text-2xl font-bold">{results.finalWpm}</p>
        </div>
        <div className="bg-secondary/40 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-text/50 text-sm">Accuracy</h3>
          <p className="text-text text-2xl font-bold">{results.finalAccuracy}%</p>
        </div>
        <div className="bg-secondary/40 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-text/50 text-sm">
            {mode === StopwatchMode.TIMER ? "Time" : "Time Limit"}
          </h3>
          <p className="text-text text-2xl font-bold">{formattedTime}</p>
        </div>
        <div className="bg-secondary/40 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-text/50 text-sm">Errors</h3>
          <p className="text-text text-2xl font-bold">{results.errors}</p>
        </div>
      </div>
      {
        !session?.user && (
            <h2 className="text-xl font-bold text-text"><Link href="/auth/login">Login to save your results</Link></h2>
        )
      }
      <div className="bg-secondary/40 backdrop-blur-sm w-full rounded-xl p-6">
        <h2 className="text-xl font-bold text-text mb-4">Performance Over Time</h2>
        <div className="h-[400px] w-full">
          {renderCharts ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} key={Math.random()}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--text)/0.5)" key={chartKey.current} />
                <XAxis 
                  dataKey="time" 
                  stroke="rgb(var(--text))"
                  label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, stroke: 'rgb(var(--text))' }}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="rgb(var(--text))"
                  label={{ value: 'WPM', angle: -90, position: 'insideLeft', stroke: 'rgb(var(--text))' }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="rgb(var(--text))"

                  domain={[0, 100]}
                  label={{ value: 'Accuracy (%)', angle: 90, position: 'insideRight',  stroke: 'rgb(var(--text))' }}
                />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'rgb(var(--background))',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend 
                  wrapperStyle={{
                    
                  }}

                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="wpm"
                  name="WPM"
                  stroke="rgb(var(--text))"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="accuracy"
                  name="Accuracy"
                  stroke="rgb(var(--accent))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[400px] flex items-center justify-center">
              <div className="text-text">Préparation des graphiques...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage; 