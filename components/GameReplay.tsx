import { GameResults, KeyStroke } from '@app/types/GameResults';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaBackward, FaForward, FaPause, FaPlay, FaStepBackward, FaStepForward } from 'react-icons/fa';
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

interface GameReplayProps {
  gameResults: GameResults;
  onClose: () => void;
}

const GameReplay = ({ gameResults, onClose }: GameReplayProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [displayText, setDisplayText] = useState<string[]>([]);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [currentWpm, setCurrentWpm] = useState(0);
  const [currentAccuracy, setCurrentAccuracy] = useState(100);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const [processedKeyStrokes, setProcessedKeyStrokes] = useState<KeyStroke[]>([]);

  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const sentence = gameResults.sentence.split('');
  const currentTimeRef = useRef(0);

  useEffect(() => {
    if (!gameResults.keyStrokes || gameResults.keyStrokes.length === 0) {
      setIsReady(false);
      return;
    }

    console.log(gameResults.keyStrokes);

    const resets: number[] = [];
    const keyStrokes = [...gameResults.keyStrokes];

    keyStrokes.forEach((stroke, index) => {
      if (stroke.key === 'Tab') {
        resets.push(index);
      }
    });


    for (let i = 1; i < keyStrokes.length; i++) {
      const timeDiff = keyStrokes[i].timestamp - keyStrokes[i - 1].timestamp;
      if (timeDiff > 3000 && keyStrokes[i].position <= 10) {
        if (!resets.includes(i - 1)) {
          resets.push(i - 1);
        }
      }
    }

    resets.sort((a, b) => a - b);
    const lastResetIndex = resets.length > 0 ? resets[resets.length - 1] + 1 : 0;

    const validKeyStrokes = keyStrokes.slice(lastResetIndex);

    const filteredKeyStrokes = validKeyStrokes.filter(stroke => 
      !['Shift', 'Alt', 'Control', 'Meta', 'CapsLock', 'Enter', 'Escape', 
       'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 
       'PageUp', 'PageDown', 'Insert', 'F1', 'F2', 'F3', 'F4', 'F5', 
       'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'ScrollLock', 
       'Pause', 'ContextMenu', 'PrintScreen', 'NumLock', 'Clear', 'OS'].includes(stroke.key)
    );

    if (filteredKeyStrokes.length > 0) {
      const firstTimestamp = filteredKeyStrokes[0].timestamp;
      const normalizedKeyStrokes = filteredKeyStrokes.map(stroke => ({
        ...stroke,
        timestamp: stroke.timestamp - firstTimestamp
      }));

      setProcessedKeyStrokes(normalizedKeyStrokes);
      setIsReady(true);
    } else {
      setIsReady(false);
    }

    setDisplayText(Array(sentence.length).fill(''));
  }, [gameResults, sentence.length]);

  const prepareChartData = useCallback(() => {
    if (!processedKeyStrokes || processedKeyStrokes.length === 0) {
      return gameResults.wpmOverTime.map((wpm, index) => ({
        time: index,
        wpm: gameResults.wpmOverTime[index] || 0,
        accuracy: gameResults.accuracyOverTime[index] || 0
      }));
    }

    return processedKeyStrokes.map((stroke, index) => {
      const timeInSeconds = stroke.timestamp / 1000;
      return {
        time: timeInSeconds,
        position: stroke.position,
        key: stroke.key,
        isError: stroke.isError,
        wpm: index < gameResults.wpmOverTime.length ? gameResults.wpmOverTime[index] : undefined,
        accuracy: index < gameResults.accuracyOverTime.length ? gameResults.accuracyOverTime[index] : undefined
      };
    });
  }, [gameResults, processedKeyStrokes]);

  const [chartData, setChartData] = useState<any[]>([]);
  const [visibleChartData, setVisibleChartData] = useState<any[]>([]);

  useEffect(() => {
    setChartData(prepareChartData());
  }, [prepareChartData, processedKeyStrokes]);

  const stopReplay = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setDisplayText(Array(sentence.length).fill(''));
    setCurrentPosition(0);
    startTimeRef.current = null;
    lastTimeRef.current = 0;
  }, [sentence.length]);

  const startReplay = () => {
    console.log("Start replay clicked");
    if (currentTime > 0) {
      lastTimeRef.current = currentTime;
    }
    setIsPlaying(true);
  };

  const pauseReplay = () => {
    setIsPlaying(false);
  };

  const skipForward = () => {
    const newTime = currentTime + 5; 
    setCurrentTime(newTime);
    lastTimeRef.current = newTime;
    startTimeRef.current = null;
  };

  const skipBackward = () => {
    const newTime = Math.max(0, currentTime - 5); 
    setCurrentTime(newTime);
    lastTimeRef.current = newTime;
    startTimeRef.current = null;
  };

  const jumpToStart = () => {
    stopReplay();
  };

  const jumpToEnd = () => {
    if (!processedKeyStrokes || processedKeyStrokes.length === 0) return;
    
    const lastStroke = processedKeyStrokes[processedKeyStrokes.length - 1];
    const totalTime = lastStroke.timestamp / 1000;
    
    setCurrentTime(totalTime);
    lastTimeRef.current = totalTime;
    startTimeRef.current = null;
    
    const finalText = Array(sentence.length).fill('');
    let position = 0;
    
    processedKeyStrokes.forEach(stroke => {
      if (stroke.key === 'Backspace') {
        if (position > 0) {
          position--;
          finalText[position] = '';
        }
      } else if (!['Tab', 'Shift', 'Control', 'Alt', 'Meta'].includes(stroke.key)) {
        position = Math.min(stroke.position, finalText.length - 1);
        if (position < finalText.length) {
          finalText[position] = stroke.key;
        }
      }
    });
    
    setDisplayText(finalText);
    setCurrentPosition(sentence.length);
    setCurrentWpm(gameResults.finalWpm || 0);
    setCurrentAccuracy(gameResults.finalAccuracy || 0);
    setVisibleChartData(chartData);
    
    setIsPlaying(false);
  };
  
  const animate = useCallback((timestamp: number) => {
    if (!isPlaying) return;
    
    if (startTimeRef.current === null) {
      startTimeRef.current = timestamp;
    }

    const realElapsedTime = (timestamp - startTimeRef.current) / 1000;
    
    const elapsedTime = lastTimeRef.current + (realElapsedTime * playbackSpeed);
    
    if (Math.abs(elapsedTime - currentTimeRef.current) > 160) { // ~60fps
      currentTimeRef.current = elapsedTime;
      setCurrentTime(elapsedTime);
    }

    if (processedKeyStrokes && processedKeyStrokes.length > 0) {
      let newPosition = 0;
      let errors = 0;
      let correct = 0;
      let lastIndex = 0;

      const newDisplayText = Array(sentence.length).fill('');
      for (let i = 0; i < processedKeyStrokes.length; i++) {
        const stroke = processedKeyStrokes[i];
        if (stroke.timestamp / 1000 <= elapsedTime) {
          if (stroke.key === 'Backspace') {
            if (newPosition > 0) {
              newPosition--;
              newDisplayText[newPosition + 1] = '';
            }
          } else if (stroke.key.length === 1) {
            newPosition = Math.min(stroke.position, sentence.length - 1);
            lastIndex = i;
            
            if (newPosition < newDisplayText.length) {
              newDisplayText[newPosition] = stroke.key;
              
              if (stroke.isError) {
                errors++;
              } else {
                correct++;
              }
            }
          } else if (stroke.key === 'Tab') {
            newPosition = 0;
            for (let j = 0; j < newDisplayText.length; j++) {
              newDisplayText[j] = '';
            }
          }
        } else {
          break;
        }
      }

      const timeInMinutes = elapsedTime / 60;
      const totalChars = correct + errors;
      const wpm = timeInMinutes > 0.02 ? Math.round((totalChars / 5) / timeInMinutes) : 0;
      const accuracy = totalChars > 0 ? Math.floor((correct / totalChars) * 100) : 100;

      setDisplayText(newDisplayText);
      setCurrentPosition(newPosition + 1);
      setCurrentWpm(wpm);
      setCurrentAccuracy(accuracy);

      const visibleData = chartData.filter(d => d.time <= elapsedTime);
      setVisibleChartData(visibleData);
      
      if (lastIndex >= processedKeyStrokes.length - 1) {
        stopReplay();
        return;
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [chartData, isPlaying, playbackSpeed, processedKeyStrokes, sentence.length, stopReplay]);

  useEffect(() => {
    if (isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [animate, isPlaying]);

  useEffect(() => {
    console.log("Current time updated:", currentTime);
    lastTimeRef.current = currentTime;
  }, [currentTime]);

  if (!isReady) {
    return (
      <div className="fixed inset-0 bg-primary/90 backdrop-blur-md z-50 flex flex-col items-center justify-center">
        <div className="bg-secondary p-8 rounded-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-auto shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-text mb-4">Replay non disponible</h2>
            <p className="text-text_secondary mb-4">
              KeyStrokes data is not available for this game.
              <br />Only recent games can be replayed.
            </p>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-accent text-text rounded-lg hover:bg-opacity-80 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderText = () => {
    return (
      <div className="text-2xl text-text font-mono whitespace-pre-wrap">
        {sentence.map((char, index) => (
          <span 
            key={index}
            className={
              index < currentPosition
                ? displayText[index] === char 
                  ? "text-text" 
                  : `${char === " " && "bg-accent !opacity-100"} text-accent !opacity-100` 

                : index === currentPosition
                  ? "border-l-2 border-text animate-pulse text-text/50"
                  : "text-text/20"
            }
          >
            {char}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-primary/90 backdrop-blur-md z-50 flex flex-col items-center justify-center">
      <div className="bg-secondary p-8 rounded-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-auto shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-text">Game Replay</h2>
          <button 
            onClick={onClose}
            className="text-text_secondary hover:text-text"
          >
            Close
          </button>
        </div>

        <div className="bg-primary/20 p-6 rounded-xl mb-6 min-h-[200px] relative">
          {renderText()}
          {gameResults.author && (
            <div className="mt-4 text-text_secondary italic">
              By {gameResults.author}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-primary/20 p-4 rounded-lg">
            <h3 className="text-text_secondary text-sm">WPM</h3>
            <p className="text-text text-2xl font-bold">{currentWpm}</p>
          </div>
          <div className="bg-primary/20 p-4 rounded-lg">
            <h3 className="text-text_secondary text-sm">Accuracy</h3>
            <p className="text-text text-2xl font-bold">{currentAccuracy}%</p>
          </div>
          <div className="bg-primary/20 p-4 rounded-lg">
            <h3 className="text-text_secondary text-sm">Position</h3>
            <p className="text-text text-2xl font-bold">{currentPosition} / {sentence.length}</p>
          </div>
        </div>

        <div className="bg-primary/20 p-4 rounded-xl mb-6 h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={visibleChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--text)/0.2)" />
              <XAxis 
                dataKey="time" 
                stroke="rgb(var(--text))"
                label={{ value: 'Temps (s)', position: 'insideBottom', offset: -5, stroke: 'rgb(var(--text))' }}
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
                label={{ value: 'Accuracy (%)', angle: 90, position: 'insideRight', stroke: 'rgb(var(--text))' }}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'rgb(var(--primary))',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'rgb(var(--text))'
                }}
              />
              <Legend />
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
                name="Précision"
                stroke="rgb(var(--accent))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Contrôles de lecture */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button 
            onClick={jumpToStart}
            className="p-2 text-text hover:text-accent transition-colors"
            aria-label="Aller au début"
          >
            <FaStepBackward size={20} />
          </button>
          <button 
            onClick={skipBackward}
            className="p-2 text-text hover:text-accent transition-colors"
            aria-label="Reculer de 5 secondes"
          >
            <FaBackward size={20} />
          </button>
          
          {isPlaying ? (
            <button 
              onClick={pauseReplay}
              className="p-4 bg-accent rounded-full text-text hover:bg-opacity-80 transition-colors"
              aria-label="Pause"
            >
              <FaPause size={24} />
            </button>
          ) : (
            <button 
              onClick={startReplay}
              className="p-4 bg-tertiary rounded-full text-text hover:bg-opacity-80 transition-colors"
              aria-label="Lecture"
            >
              <FaPlay size={24} />
            </button>
          )}
          
          <button 
            onClick={skipForward}
            className="p-2 text-text hover:text-accent transition-colors"
            aria-label="Avancer de 5 secondes"
          >
            <FaStepForward size={20} />
          </button>
          <button 
            onClick={jumpToEnd}
            className="p-2 text-text hover:text-accent transition-colors"
            aria-label="Aller à la fin"
          >
            <FaForward size={20} />
          </button>
        </div>

        <div className="flex items-center justify-center gap-4">
          <span className="text-text_secondary">Vitesse:</span>
          {[0.5, 1, 1.5, 2].map(speed => (
            <button
              key={speed}
              onClick={() => setPlaybackSpeed(speed)}
              className={`px-3 py-1 rounded-md ${
                playbackSpeed === speed 
                  ? 'bg-tertiary text-text' 
                  : 'bg-primary/20 text-text_secondary hover:bg-primary/40'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameReplay; 