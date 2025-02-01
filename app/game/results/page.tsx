'use client';

import { useEffect, useState } from 'react';
import { GameResults } from '@app/types/GameResults';
import { useSession } from 'next-auth/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useRouter } from 'next/navigation';
import { LengthParameter, SentenceParameter } from '@app/types/GameParameters';
import Link from '@node_modules/next/link';

const ResultsPage = () => {
  const [results, setResults] = useState<GameResults | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const savedResults = localStorage.getItem('lastGameResults');
    
    if (!savedResults) {
      router.replace('/game/typetester');
      return;
    }

    const parsedResults = JSON.parse(savedResults);
    setResults(parsedResults);

    const isSubmitted = localStorage.getItem('resultsSubmitted');
    if (session?.user && !isSubmitted && !hasSubmitted) {
      saveUserStatistics(parsedResults);
      setHasSubmitted(true);
      localStorage.setItem('resultsSubmitted', 'true');
    }
  }, []);

  const handleTryAgain = () => {
    localStorage.removeItem('lastGameResults');
    localStorage.removeItem('resultsSubmitted');
    router.push('/game/typetester');
  };

  const saveUserStatistics = async (gameResults: GameResults) => {
    try {
        const user = await fetch(`/api/user/${session?.user?.name}`, {
            method: 'GET',
        });

        const userData = await user.json();
        const userId = userData.user._id;
        const lengthParameter = localStorage.getItem('lastGameLengthParameter');
        const sentenceParameter = localStorage.getItem('lastGameSentenceParameter'); 

        console.log(lengthParameter);
        console.log(sentenceParameter);

        const response = await fetch(`/api/user/statistics/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userRef: userId,
                wpm: gameResults.finalWpm,
                accuracy: gameResults.finalAccuracy,
                totalWords: gameResults.totalWords,
                totalCharacters: gameResults.totalCharacters,
                totalErrors: gameResults.errors,
                lengthParameter: lengthParameter,
                sentenceParameter: sentenceParameter,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to save statistics');
        }
    } catch (error) {
        console.error('Error saving statistics:', error);
    }
  };

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text text-xl">No results found</p>
      </div>
    );
  }

  const timeInSeconds = results.time / 1000;
  const formattedTime = `${Math.floor(timeInSeconds / 60)}:${(timeInSeconds % 60).toFixed(1)}`;

  const chartData = results.wpmOverTime.map((wpm, index) => ({
    time: index,
    wpm: wpm,
    accuracy: results.accuracyOverTime[index]
  }));

  return (
    <div className="min-h-screen mt-16 p-4 flex flex-col w-screen justify-center items-center gap-8">
      <div className="flex justify-between w-full items-center">
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

      <div className="grid grid-cols-1 w-full md:grid-cols-4 gap-4">
        <div className="bg-secondary/40 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-text/50 text-sm">Final WPM</h3>
          <p className="text-text text-2xl font-bold">{results.finalWpm}</p>
        </div>
        <div className="bg-secondary/40 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-text/50 text-sm">Accuracy</h3>
          <p className="text-text text-2xl font-bold">{results.finalAccuracy}%</p>
        </div>
        <div className="bg-secondary/40 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-text/50 text-sm">Time</h3>
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
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--text)/0.5)" />
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
        </div>
      </div>
    </div>
  );
};

export default ResultsPage; 