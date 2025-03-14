"use client";

import { fetchQuote, fetchRandomSentence } from "@app/game/gameHandler";
import { useStopwatch } from "@app/hooks/Stopwatch";
import {
  GameState,
  GameTypeParameter,
  LengthParameter,
  Quote,
  SentenceParameter,
  StopwatchMode,
  TimeParameter,
} from "@app/types/GameParameters";
import { GameResults } from "@app/types/GameResults";
import KeyboardLayout from "@components/KeyboardLayout";
import KeyIcon from "@components/subcomponents/KeyIcon";
import { useSettings } from "@contexts/SettingsContext";
import { encryptGameData } from "@utils/cryptoUtils";
import { keyboardCodeAdapter } from "@utils/keyboard/keyboardCodeAdapter";
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef } from "react";
import { GoTab } from "react-icons/go";
import useState from "react-usestateref";
import { timeToLength } from "./typetester/page";

interface TemplateProps {
  gameType: GameTypeParameter;
  sentenceParameter: SentenceParameter;
  lengthParameter: LengthParameter;
  sentence: string | Quote;
  gameState: GameState;
  gameResults: GameResults;
  setGameResults: React.Dispatch<React.SetStateAction<GameResults>>;
  onGameStarts: () => void;
  onGameReset: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  stopwatchMode?: StopwatchMode;
  timeParameter?: TimeParameter;
  countdownTime?: number;
}

const TemplateInputComponent = ({
  gameType,
  sentenceParameter,
  lengthParameter,
  gameResults,
  setGameResults,
  sentence,
  onGameStarts,
  onGameReset,
  gameState,
  timeParameter,
  inputRef,
  stopwatchMode = StopwatchMode.TIMER,
  countdownTime = 0,
}: TemplateProps) => {
  const [input, setInput] = useState<string>("");
  var [currentIndex, setCurrentIndex, currentIndexRef] = useState<number>(0);
  const indexedError = useState<number[]>([])[0];
  const [lineCharCounts, setLineCharCounts] = useState<number[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const textContainerRef = useRef<HTMLDivElement>(null);
  
  // État pour le contenu procédural
  const [dynamicSentence, setDynamicSentence] = useState<string>("");
  const [dynamicAuthor, setDynamicAuthor] = useState<string>("");
  const [hasGeneratedMore, setHasGeneratedMore] = useState<boolean>(false);
  const [initialSentenceLength, setInitialSentenceLength] = useState<number>(0);
  const [displayedAuthor, setDisplayedAuthor] = useState<string>("");

  const exampleSentence = "Example sentence displayed when no sentence is provided.";
  const quoteContentIfNotString = typeof sentence !== "string" ? sentence.content : sentence;
  const quoteAuthorIfNotString = typeof sentence !== "string" ? sentence.author : "";
  const finalSentence = quoteContentIfNotString ? quoteContentIfNotString : exampleSentence;
  
  // Utiliser la sentence dynamique si elle existe, sinon utiliser la sentence initiale
  const effectiveSentence = dynamicSentence || finalSentence;
  const splittedSentence = effectiveSentence.split("");
  const wordSplittedSentence = effectiveSentence.split(" ");

  // Déterminer quel auteur afficher en fonction de la position actuelle
  useEffect(() => {
    if (currentIndex > initialSentenceLength && dynamicAuthor) {
      // L'utilisateur tape dans la nouvelle citation
      setDisplayedAuthor(dynamicAuthor);
    } else {
      // L'utilisateur tape dans la citation originale
      setDisplayedAuthor(quoteAuthorIfNotString);
    }
  }, [currentIndex, initialSentenceLength, dynamicAuthor, quoteAuthorIfNotString]);

  // Nettoyer le flag au démarrage d'une nouvelle partie
  useEffect(() => {
    if (gameState === GameState.STARTED || gameState === GameState.RESET) {
      localStorage.removeItem('resultsSubmitted');
    }
  }, [gameState]);

  const reset = () => {
    setInput("");
    setCurrentIndex(0);
    setTotalErrors(0);
    setWpm(0);
    setAccuracy(0);
    indexedError.splice(0, indexedError.length);
    localStorage.removeItem('resultsSubmitted'); // Nettoyer aussi lors du reset
  };

  // Statistics related variables
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);
  const time = useStopwatch({
    mode: stopwatchMode,
    initialTime: countdownTime,
    onComplete: () => {
      if (gameState === GameState.STARTED) {
        handleGameEnd();
      }
    }
  });
  const [totalErrors, setTotalErrors] = useState<number>(0);
  const [totalCharactersWithoutSpaces, setTotalCharactersWithoutSpaces] = useState<number>(0);
  const [averageWordLength, setAverageWordLength] = useState<number>(0);
  const { parameters } = useSettings();

  const router = useRouter();

  const [gameSessionId, setGameSessionId] = useState("");

  useEffect(() => {
    // Générer un ID de session unique pour cette partie
    const sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    setGameSessionId(sessionId);
    localStorage.setItem('currentGameSession', sessionId);
    
    // Nettoyage
    return () => {
      localStorage.removeItem('currentGameSession');
    };
  }, []);

  const verifyInputMatching = (key: string) => {
    if (
      key === splittedSentence[currentIndex] &&
      splittedSentence[input.length] === key
    ) {
      return true;
    } else {
      return false;
    }
  };

  const resetGame = () => {
    time.stop();
    time.reset();
    setGameResults({
      mode: stopwatchMode,
      sentence: effectiveSentence,
      author: displayedAuthor,
      wpmOverTime: [0],
      accuracyOverTime: [0],
      totalWords: 0,
      totalCharacters: 0,
      time: 0,
      errors: 0,
      correct: 0,
    });
    onGameReset();
    reset();
  };

  const startGame = () => {
    onGameStarts();
    time.start();
  };

  // Fonction pour générer plus de contenu
  const generateMoreContent = useCallback(async () => {

    if (sentenceParameter === SentenceParameter.QUOTE) {
      // Convertir l'enum en clé littérale
      const newQuote = await fetchQuote(timeToLength[timeParameter!]);
      if (typeof newQuote !== "string") {
        setDynamicSentence(prev => prev + " " + newQuote.content);
        // Mettre à jour l'auteur avec le nouvel auteur
        setDynamicAuthor(newQuote.author);
      } else {
        setDynamicSentence(prev => prev + " " + newQuote);
      }
    } else {
      const newSentence = await fetchRandomSentence(timeToLength[timeParameter!]);
      setDynamicSentence(prev => prev + " " + newSentence);
      // Pour les phrases aléatoires, pas d'auteur à mettre à jour
      setDynamicAuthor("");
    }
    setHasGeneratedMore(true);
  }, [sentenceParameter, lengthParameter]);

  // Effet pour générer du contenu procéduralement en mode countdown
  useEffect(() => {
    if (stopwatchMode === StopwatchMode.COUNTDOWN && 
        gameState === GameState.STARTED &&
        currentIndex > 0 && // S'assurer que l'utilisateur a commencé à taper
        !hasGeneratedMore && // Éviter les générations multiples en même temps
        currentIndex >= splittedSentence.length * 0.8) { // Quand l'utilisateur est proche de la fin (80%)
      
      generateMoreContent();
    }
  }, [currentIndex, stopwatchMode, gameState, splittedSentence.length, hasGeneratedMore, generateMoreContent]);

  // Réinitialiser le flag de génération quand l'utilisateur a avancé dans le nouveau contenu
  useEffect(() => {
    if (hasGeneratedMore && currentIndex < splittedSentence.length * 0.5) {
      setHasGeneratedMore(false);
    }
  }, [currentIndex, hasGeneratedMore, splittedSentence.length]);

  // Initialiser la phrase dynamique et l'auteur dynamique avec les valeurs initiales au démarrage
  useEffect(() => {
    if (gameState === GameState.RESET || gameState === GameState.STARTED) {
      setDynamicSentence(finalSentence);
      setInitialSentenceLength(finalSentence.length);
      setDynamicAuthor("");
      setDisplayedAuthor(quoteAuthorIfNotString);
      setHasGeneratedMore(false);
    }
  }, [finalSentence, quoteAuthorIfNotString, gameState]);

  // Modifier le calcul du WPM pour prendre en compte le mode
  const getWpm = () => {
    if (stopwatchMode === StopwatchMode.TIMER) {
      // Calcul normal pour le mode timer
      const timeInMinutes = time.rawTime / 60000;
      if (timeInMinutes <= 0) return 0;
      return Math.round((input.length / 5) / timeInMinutes);
    } else {
      // Pour le mode countdown, utiliser le temps écoulé
      const elapsedTime = countdownTime - time.rawTime;
      const elapsedMinutes = elapsedTime / 60000;
      if (elapsedMinutes <= 0) return 0;
      return Math.round((input.length / 5) / elapsedMinutes);
    }
  };

  const getGrossWpm = () => {
    if (stopwatchMode === StopwatchMode.TIMER) {
      // Calcul normal pour le mode timer
      const timeInMinutes = time.rawTime / 60000;
      if (timeInMinutes <= 0) return 0;
      const totalKeystrokes = input.length + indexedError.length;
      return Math.round((totalKeystrokes / 5) / timeInMinutes);
    } else {
      // Pour le mode countdown, utiliser le temps écoulé
      const elapsedTime = countdownTime - time.rawTime;
      const elapsedMinutes = elapsedTime / 60000;
      if (elapsedMinutes <= 0) return 0;
      const totalKeystrokes = input.length + indexedError.length;
      return Math.round((totalKeystrokes / 5) / elapsedMinutes);
    }
  };

  const getAccuracy = () => {
    if (input.length === 0) return 0;
    let accuracy: number =
      totalErrors > input.length
        ? 0
        : Math.floor(((input.length - totalErrors) / input.length) * 100);
    return accuracy;
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    // Calcul correct de la longueur moyenne des mots
    const totalCharactersWithoutSpaces = wordSplittedSentence.reduce((sum, word) => sum + word.length, 0);
    setTotalCharactersWithoutSpaces(totalCharactersWithoutSpaces);
    setAverageWordLength(Math.round(totalCharactersWithoutSpaces / wordSplittedSentence.length));


    if (gameState === GameState.STARTED) {
      // Créer un intervalle de 500ms pour capturer les stats
      intervalId = setInterval(() => {
          
          // Vérifier si les nouvelles valeurs sont significativement différentes
          const lastWpm = gameResults.wpmOverTime[gameResults.wpmOverTime.length - 1];
          const lastAccuracy = gameResults.accuracyOverTime[gameResults.accuracyOverTime.length - 1];
          
          // Ne mettre à jour que si les changements sont significatifs
          if (Math.abs(wpm - (lastWpm || 0)) > 5 || 
              Math.abs(accuracy - (lastAccuracy || 0)) > 2) {
            setGameResults({
              sentence: effectiveSentence,
              author: displayedAuthor,
              mode: stopwatchMode,
              wpmOverTime: [...gameResults.wpmOverTime, wpm],
              accuracyOverTime: [...gameResults.accuracyOverTime, accuracy],
              time: time.rawTime,
              errors: totalErrors,
              correct: input.length,
              totalWords: wordSplittedSentence.length,
              totalCharacters: splittedSentence.length,
            });
          }
        
      }, 200);
    } else if (gameState === GameState.ENDED) {
      time.stop();
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [gameState, wpm, accuracy, time.rawTime, effectiveSentence, displayedAuthor]);

  // Mettre à jour WPM et accuracy en temps réel pour l'affichage
  useEffect(() => {
    if (gameState === GameState.STARTED) {
      const currentWpm = getGrossWpm();
      const currentAccuracy = getAccuracy();
      
      if (!isNaN(currentWpm) && 
          !isNaN(currentAccuracy) && 
          currentWpm >= 0 && 
          currentWpm < 300) {
        setWpm(currentWpm);
        setAccuracy(currentAccuracy);
      }
    }
  }, [time.rawTime]);

  const handleGameEnd = async () => {
    // Vérifier que la session est toujours valide
    const currentSession = localStorage.getItem('currentGameSession');
    if (currentSession !== gameSessionId) {
      console.error("Session de jeu invalide");
      router.push('/game/typetester');
      return;
    }
    
    time.stop();
    const finalResults = {
      sentence: effectiveSentence,
      author: displayedAuthor,
      wpmOverTime: [...gameResults.wpmOverTime, wpm],
      accuracyOverTime: [...gameResults.accuracyOverTime, accuracy],
      time: stopwatchMode === StopwatchMode.TIMER ? time.rawTime : countdownTime,
      errors: totalErrors,
      correct: input.length,
      totalWords: wordSplittedSentence.length,
      totalCharacters: splittedSentence.length,
      finalWpm: getWpm(),
      finalAccuracy: accuracy,
      mode: stopwatchMode,
      // Métriques de vérification
      totalKeystrokes: input.length + indexedError.length,
      avgTimePerKeystroke: time.rawTime / (input.length + indexedError.length),
      keystrokesPerSecond: (input.length + indexedError.length) / (time.rawTime / 1000),
      gameId: Date.now().toString(36) + Math.random().toString(36).substring(2)
    };
    
    try {
      const encryptedData = await encryptGameData(finalResults);
      
      if (encryptedData) {
        localStorage.setItem('lastGameResults', encryptedData);
        // Autres opérations...
      } else {
        console.error("Échec du chiffrement : résultat vide");
      }
    } catch (error) {
      console.error("Erreur lors du chiffrement des résultats:", error);
    }
    
    router.push('/game/results');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {

    const code = keyboardCodeAdapter(e.code, parameters.keyboard.layout);

    if(e.altKey && (code === "KeyC" || code === "KeyT" || code === "KeyN" || code === "KeyQ" || code === "KeyS" || code === "KeyM" || code === "KeyL" || code === "KeyV" || code === "KeyR" || code === "Digit1" || code === "Digit2" || code === "Digit3" || code === "Digit4")) {
      e.preventDefault();
      return;
    }

    if (e.ctrlKey && "cvxspwuaz".indexOf(e.key) !== -1) {
      e.preventDefault();
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      if (gameState === GameState.STARTED) {
        resetGame();
      }
    }

    if (
      e.key !== "Shift" &&
      e.key !== "Alt" &&
      e.key !== "Control" &&
      e.key !== "Meta" &&
      e.key !== "Tab" &&
      e.key !== "CapsLock" &&
      e.key !== "Enter" &&
      e.key !== "Escape" &&
      e.key !== "Delete" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight" &&
      e.key !== "ArrowUp" &&
      e.key !== "ArrowDown" &&
      e.key !== "Home" &&
      e.key !== "End" &&
      e.key !== "PageUp" &&
      e.key !== "PageDown" &&
      e.key !== "Insert" &&
      e.key !== "F1" &&
      e.key !== "F2" &&
      e.key !== "F3" &&
      e.key !== "F4" &&
      e.key !== "F5" &&
      e.key !== "F6" &&
      e.key !== "F7" &&
      e.key !== "F8" &&
      e.key !== "F9" &&
      e.key !== "F10" &&
      e.key !== "F11" &&
      e.key !== "F12" &&
      e.key !== "ScrollLock" &&
      e.key !== "Pause" &&
      e.key !== "ContextMenu" &&
      e.key !== "PrintScreen" &&
      e.key !== "NumLock" &&
      e.key !== "Clear" &&
      e.key !== "OS"
    ) {
      if (
        e.key !== "Backspace" &&
        input.length + indexedError.length - 1 < splittedSentence.length
      ) {
        if (gameState !== GameState.STARTED) {
          startGame();
        }
        setCurrentIndex(currentIndex + 1);
        if (verifyInputMatching(e.key)) {
          const newInput = input + e.key;
          setInput(newInput);
          
          if (newInput.length === splittedSentence.length) {
            handleGameEnd();
          }
        } else {
          indexedError.push(currentIndex);
          setTotalErrors(totalErrors + 1);
        }
      } else {
        if (currentIndexRef.current > 0) {
          setCurrentIndex(currentIndex - 1);
          if (indexedError.includes(currentIndexRef.current)) {
            indexedError.pop();
          } else {
            setInput(input.slice(0, -1));
          }
        }
      }

      if (!isNaN(wpm) && !isNaN(accuracy)) {
        setGameResults({
          mode: stopwatchMode,
          sentence: effectiveSentence,
          author: displayedAuthor,
          wpmOverTime: [...gameResults.wpmOverTime, wpm],
          accuracyOverTime: [...gameResults.accuracyOverTime, accuracy],
          time: time.rawTime,
          errors: totalErrors,
          correct: input.length,
          totalWords: wordSplittedSentence.length,
          totalCharacters: splittedSentence.length,
        });
      }
    }
  };

  // Utilisons useRef pour éviter des boucles infinies
  const previousCalculatedLineIndex = useRef<number>(-1);
  const previousLineCharCounts = useRef<number[]>([]);

  // Calculer les lignes en fonction de la taille du conteneur - une seule fois au début et lors des redimensionnements
  useEffect(() => {
    const calculateLines = () => {
      if (textContainerRef.current) {
        const container = textContainerRef.current;
        // On utilise une span temporaire pour mesurer la largeur d'un caractère
        const tempSpan = document.createElement('span');
        tempSpan.style.fontSize = '2.25rem'; // text-4xl equivalent
        tempSpan.style.visibility = 'hidden';
        tempSpan.textContent = 'M'; // Utiliser 'M' comme référence de largeur
        container.appendChild(tempSpan);
        
        const charWidth = tempSpan.getBoundingClientRect().width;
        const containerWidth = container.clientWidth;
        
        container.removeChild(tempSpan);
        
        // Calculer combien de caractères peuvent tenir sur une ligne
        const maxCharsPerLine = Math.floor(containerWidth / charWidth) - 2;
        
        // Calculer les longueurs réelles de chaque ligne
        const lineLengths: number[] = [];
        let currentLine = '';
        let currentWord = '';
        
        for (let i = 0; i < splittedSentence.length; i++) {
          const char = splittedSentence[i];
          currentWord += char;
          
          if (char === ' ' || i === splittedSentence.length - 1) {
            if ((currentLine + currentWord).length > maxCharsPerLine) {
              if (currentLine) {
                lineLengths.push(currentLine.length);
                currentLine = currentWord;
              } else {
                lineLengths.push(currentWord.length);
                currentLine = '';
              }
            } else {
              currentLine += currentWord;
            }
            currentWord = '';
          }
        }
        
        // Ajouter la dernière ligne si elle n'est pas vide
        if (currentLine) {
          lineLengths.push(currentLine.length);
        }
        
        // Vérification stricte pour ne mettre à jour que si nécessaire
        if (JSON.stringify(lineLengths) !== JSON.stringify(previousLineCharCounts.current)) {
          previousLineCharCounts.current = lineLengths;
          setLineCharCounts(lineLengths);
        }
      }
    };

    calculateLines();
    window.addEventListener('resize', calculateLines);
    
    return () => window.removeEventListener('resize', calculateLines);
  }, [splittedSentence]);

  // Fonction pure pour calculer la ligne courante en fonction de l'index
  const calculateCurrentLineIndex = useCallback((index: number, lineCounts: number[]) => {
    if (lineCounts.length === 0 || index < 0) return 0;
    if (index >= splittedSentence.length) return lineCounts.length - 1;
    
    let charCount = 0;
    let lineIndex = 0;
    
    while (lineIndex < lineCounts.length) {
      if (charCount <= index && index < charCount + lineCounts[lineIndex]) {
        return lineIndex;
      }
      charCount += lineCounts[lineIndex];
      lineIndex++;
    }
    
    return Math.max(0, lineIndex - 1);
  }, [splittedSentence.length]);

  // Utiliser useEffect pour mettre à jour currentLineIndex une seule fois lorsque currentIndex change
  useEffect(() => {
    const newLineIndex = calculateCurrentLineIndex(currentIndex, lineCharCounts);
    
    // Vérifier si la ligne a changé pour éviter les mises à jour inutiles
    if (newLineIndex !== previousCalculatedLineIndex.current) {
      previousCalculatedLineIndex.current = newLineIndex;
      setCurrentLineIndex(newLineIndex);
    }
  }, [currentIndex, lineCharCounts, calculateCurrentLineIndex]);

  // Fonction pour obtenir les lignes visibles - rendue pure pour éviter les effets de bord
  const getVisibleLines = useCallback(() => {
    if (lineCharCounts.length === 0) {
      return {
        visibleLines: [],
        gradientLine: '',
        startLineIndex: 0
      };
    }
    
    const allLines: string[] = [];
    let startIndex = 0;
    
    // Construire toutes les lignes
    for (let i = 0; i < lineCharCounts.length; i++) {
      const lineLength = lineCharCounts[i];
      allLines.push(splittedSentence.slice(startIndex, startIndex + lineLength).join(''));
      startIndex += lineLength;
    }
    
    // Déterminer l'index de la ligne à partir de laquelle afficher
    let startLineIndex = Math.max(0, currentLineIndex - 1);
    
    // Assurer que nous ne dépassons pas les bornes à la fin
    startLineIndex = Math.min(startLineIndex, Math.max(0, allLines.length - 3));
    
    return {
      visibleLines: allLines.slice(startLineIndex, startLineIndex + 3),
      gradientLine: allLines[startLineIndex + 3] || '',
      startLineIndex: startLineIndex
    };
  }, [lineCharCounts, currentLineIndex, splittedSentence]);

  // Effet pour mettre à jour le temps de décompte en temps réel
  useEffect(() => {
    if (stopwatchMode === StopwatchMode.COUNTDOWN && gameState !== GameState.STARTED) {
      time.setInitialCountdown(countdownTime);
    }
  }, [countdownTime, stopwatchMode, gameState, time]);

  // Effet pour réinitialiser le chronomètre lorsque le mode change
  useEffect(() => {
    if (gameState !== GameState.STARTED) {
      time.reset();
    }
  }, [stopwatchMode, time, gameState]);

  return (
    <div className="flex flex-col items-center justify-center w-full gap-5">
      <div ref={textContainerRef} className="w-5/6 text-4xl text-text relative overflow-hidden flex justify-center h-[192px]">
        <input
          ref={inputRef}
          autoFocus={true}
          type="text"
          onBlur={(e) => {
            if (e.relatedTarget === null) {
              e.target.focus();
            }
          }}
          onChange={(e) => {}}
          onKeyDown={handleKeyPress}
          className="w-full px-14 pb-10 h-full absolute z-10 opacity-0"
        />
        <span className="w-full pointer-events-none flex flex-col whitespace-pre relative">
          {(() => {
            const { visibleLines, gradientLine, startLineIndex } = getVisibleLines();
            
            return (
              <>
                {visibleLines.map((line, displayIndex) => {
                  const actualLineIndex = startLineIndex + displayIndex;
                  
                  // Calculer l'index de départ pour cette ligne
                  let lineStartIndex = 0;
                  for (let i = 0; i < actualLineIndex; i++) {
                    lineStartIndex += lineCharCounts[i] || 0;
                  }
                  
                  const isActiveLine = actualLineIndex === currentLineIndex;
                  
                  return (
                    <div 
                      key={`line-${actualLineIndex}`} 
                      className="w-full h-[48px] flex items-center whitespace-pre absolute transition-all duration-300"
                      style={{ 
                        top: `${displayIndex * 48}px` 
                      }}
                    >
                      {line.split('').map((char, charIndex) => {
                        const actualIndex = lineStartIndex + charIndex;
                        
                        return (
                          <span
                            key={`char-${actualIndex}`}
                            className={`
                              ${indexedError.includes(actualIndex) 
                                ? `${char === " " && "bg-accent !opacity-100"} text-accent !opacity-100` 
                                : `${currentIndexRef.current > actualIndex 
                                    ? "text-text !opacity-100" 
                                    : "text-text/20"}`
                              }
                              ${isActiveLine && currentIndexRef.current === actualIndex && "border-l-[2px] border-text duration-200 transition"}
                            `}
                          >
                            {char}
                          </span>
                        );
                      })}
                    </div>
                  );
                })}
                
                {/* La ligne avec le gradient d'opacité */}
                {gradientLine && (
                  <div 
                    className="w-full h-[48px] flex items-center whitespace-pre text-text bg-gradient-to-b from-text/10 to-transparent bg-clip-text text-transparent absolute transition-all duration-300"
                    style={{ 
                      top: `${3 * 48}px` 
                    }}
                  >
                    {gradientLine.split('').map((char, index) => (
                      <span key={`gradient-${index}`}>
                        {char}
                      </span>
                    ))}
                  </div>
                )}
              </>
            );
          })()}
        </span>
      </div>
      {displayedAuthor ? (
        <div className="p-2 text-text opacity-50">
          <p>By {displayedAuthor}</p>
        </div>
      ) : null}
      <div className="grid place-items-center sm:grid-cols-3 grid-cols-1 sm:grid-rows-1 grid-rows-3 gr sm:flex-row flex-col w-full justify-around">
        <div className="flex flex-row gap-2 sm:flex-col text-text text-md opacity-50">
          <h1>
            {gameState === GameState.STARTED ? wpm : "-"} WPM (Previsional)
          </h1>
          <h1>{time.time}</h1>
          <div className="flex flex-row gap-2">
            <KeyIcon keyChar="Tab" icon={<GoTab className="w-3 h-3"/>} size="sm" />
            <span className="text-sm">To restart</span>
          </div>
        </div>
        <div>
          <button
            className="opacity-30 hover:opacity-100 transition duration-200"
            onClick={resetGame}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-row sm:flex-col opacity-50 text-md">
          <h1>{accuracy}%</h1>
          <h1>
            {input.length} / {splittedSentence.length}
          </h1>
        </div>
      </div>
      {parameters.keyboard.show && <KeyboardLayout />}  
    </div>
  );
};

export default TemplateInputComponent;
