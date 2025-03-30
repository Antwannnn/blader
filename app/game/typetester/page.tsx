"use client";

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
import TooltipButton from "@components/subcomponents/TooltipButton";
import { useSettings } from "@contexts/SettingsContext";
import { keyboardCodeAdapter } from "@utils/keyboard/keyboardCodeAdapter";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { IoInformationCircleOutline, IoReload, IoStopwatchOutline, IoTimerOutline } from "react-icons/io5";
import { fetchQuote, fetchRandomSentence } from "../gameHandler";
import TemplateInputComponent from "../TemplateInputComponent";

const animationVariants = {
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

export const timeToLength = {
  [TimeParameter.SECONDS_15]: LengthParameter.SHORT,
  [TimeParameter.SECONDS_30]: LengthParameter.MEDIUM,
  [TimeParameter.SECONDS_45]: LengthParameter.LONG,
  [TimeParameter.SECONDS_60]: LengthParameter.VERY_LONG,
}

const TypeTester = () => {
  const [lengthParameterSelector, setLengthParameterSelector] =
    useState<LengthParameter>(LengthParameter.SHORT);
  const [sentenceParameterSelector, setSentenceParameterSelector] =
    useState<SentenceParameter>(SentenceParameter.QUOTE);
  const [gameStatut, setGameStatut] = useState<GameState>(GameState.RESET);
  const [sentence, setSentence] = useState<string | Quote>("");
  // Nouveaux états pour le mode et le temps
  const [stopwatchMode, setStopwatchMode] = useState<StopwatchMode>(StopwatchMode.TIMER);
  const [timeParameter, setTimeParameter] = useState<TimeParameter>(TimeParameter.SECONDS_30);
  const [showInfoModal, setShowInfoModal] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const animate = useAnimation();
  const [gameResults, setGameResults] = useState<GameResults>({
    mode: stopwatchMode,
    sentence: "",
    author: "",
    wpmOverTime: [0],
    accuracyOverTime: [0],
    totalWords: 0,
    totalCharacters: 0,
    time: 0,
    errors: 0,
    correct: 0,
  });
  const { parameters } = useSettings();

  // Add a mounted ref to track component mount state
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleGameStart = () => {
    animate.start("hidden");

    setGameStatut(GameState.STARTED);
  };

  const handleGameReset = () => {
    // Only start animation if component is mounted
    if (isMounted.current) {
      animate.start("visible");
    }
    setGameStatut(GameState.RESET);
  };

  const handleGameEnd = () => {
    setGameStatut(GameState.ENDED);
  };


  const handleSetSentence = () => {
    console.log(sentenceParameterSelector);
    switch (sentenceParameterSelector) {
      case SentenceParameter.QUOTE:
        console.log('fetchQuote');
        if(stopwatchMode === StopwatchMode.COUNTDOWN) {
          setSentence(fetchQuote(timeToLength[timeParameter]));
        } else {
          setSentence(fetchQuote(lengthParameterSelector));
        }
        break;
      case SentenceParameter.RANDOM:
        console.log('fetchRandomSentence');
        if(stopwatchMode === StopwatchMode.COUNTDOWN) {
          setSentence(fetchRandomSentence(timeToLength[timeParameter], parameters.language.value));
        } else {
          setSentence(fetchRandomSentence(lengthParameterSelector, parameters.language.value));
        }
        break;
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    const lengthParameter = localStorage.getItem('lastGameLengthParameter') as LengthParameter;
    const sentenceParameter = localStorage.getItem('lastGameSentenceParameter') as SentenceParameter;
    const savedStopwatchMode = localStorage.getItem('lastGameStopwatchMode') as StopwatchMode;
    const savedTimeParameter = localStorage.getItem('lastGameTimeParameter') as TimeParameter;
    
    if (lengthParameter) setLengthParameterSelector(lengthParameter);
    if (sentenceParameter) setSentenceParameterSelector(sentenceParameter);
    if (savedStopwatchMode) setStopwatchMode(savedStopwatchMode);
    if (savedTimeParameter) setTimeParameter(savedTimeParameter);
  }, []);

  useEffect(() => {
    handleSetSentence();
  }, [lengthParameterSelector, sentenceParameterSelector, stopwatchMode, timeParameter, parameters.language.value]);

  // Convertir les secondes en millisecondes pour le mode countdown
  const getCountdownTime = (): number => {
    switch (timeParameter) {
      case TimeParameter.SECONDS_15: return 15 * 1000;
      case TimeParameter.SECONDS_30: return 30 * 1000;
      case TimeParameter.SECONDS_45: return 45 * 1000;
      case TimeParameter.SECONDS_60: return 60 * 1000;
      default: return 30 * 1000;
    }
  };

  // Gestionnaire de raccourcis clavier compatible multi-plateforme
  const handleShortcuts = (e: React.KeyboardEvent<HTMLInputElement>) => {
    
    if (!e.altKey || gameStatut === GameState.STARTED) return;

    // Prevent default browser behavior for these shortcut combinations
    e.preventDefault();
    
    // Use e.code instead of e.key to detect the physical key
    // regardless of whether it produces a special character
    const code = keyboardCodeAdapter(e.code, parameters.keyboard.layout);
    
    switch (code) {
      case 'KeyR':
        handleSetSentence();
        break;
      case 'KeyS':
        setLengthParameterSelector(LengthParameter.SHORT);
        localStorage.setItem('lastGameLengthParameter', LengthParameter.SHORT);
        break;
      case 'KeyM':
        setLengthParameterSelector(LengthParameter.MEDIUM);
        localStorage.setItem('lastGameLengthParameter', LengthParameter.MEDIUM);
        break;
      case 'KeyL':
        setLengthParameterSelector(LengthParameter.LONG);
        localStorage.setItem('lastGameLengthParameter', LengthParameter.LONG);
        break;
      case 'KeyV':
        setLengthParameterSelector(LengthParameter.VERY_LONG);
        localStorage.setItem('lastGameLengthParameter', LengthParameter.VERY_LONG);
        break;
      case 'KeyQ':
        setSentenceParameterSelector(SentenceParameter.QUOTE);
        localStorage.setItem('lastGameSentenceParameter', SentenceParameter.QUOTE);
        break;
      case 'KeyN':
        setSentenceParameterSelector(SentenceParameter.RANDOM);
        localStorage.setItem('lastGameSentenceParameter', SentenceParameter.RANDOM);
        break;
      case 'KeyT':
        setStopwatchMode(StopwatchMode.TIMER);
        localStorage.setItem('lastGameStopwatchMode', StopwatchMode.TIMER);
        break;
      case 'KeyC':
        setStopwatchMode(StopwatchMode.COUNTDOWN);
        localStorage.setItem('lastGameStopwatchMode', StopwatchMode.COUNTDOWN);
        break;
      case 'Digit1':
        setTimeParameter(TimeParameter.SECONDS_15);
        localStorage.setItem('lastGameTimeParameter', TimeParameter.SECONDS_15);
        break;
      case 'Digit2':
        setTimeParameter(TimeParameter.SECONDS_30);
        localStorage.setItem('lastGameTimeParameter', TimeParameter.SECONDS_30);
        break;
      case 'Digit3':
        setTimeParameter(TimeParameter.SECONDS_45);
        localStorage.setItem('lastGameTimeParameter', TimeParameter.SECONDS_45);
        break;
      case 'Digit4':
        setTimeParameter(TimeParameter.SECONDS_60);
        localStorage.setItem('lastGameTimeParameter', TimeParameter.SECONDS_60);
        break;
    }
  };

  useEffect(() => {
    // Forcer la suppression des résultats précédents lorsqu'on démarre un nouveau jeu
    localStorage.removeItem('lastGameResults');
    localStorage.removeItem('resultsSubmitted');
  }, []);

  return (
    <section onKeyDown={handleShortcuts} className="flex flex-col justify-center gap-1 lg:pt-32 md:pt-20 pt-10 items-center text-text z-30">
      <motion.div
        className="flex flex-col justify-center items-center"
        variants={animationVariants}
        animate={animate}
        initial="visible"
      >
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-4xl text-primary_light">Type Testing</h1>
          <button 
            onClick={() => setShowInfoModal(true)}
            className="text-primary_light hover:text-text transition-colors duration-200"
            aria-label="Game information"
          >
            <IoInformationCircleOutline size={24} />
          </button>
        </div>
        <div className="flex md:flex-row flex-col items-center gap-7 py-6">
          <div className="flex flex-col justify-center gap-3 item-center">
            <h3 className="opacity-50">Reload</h3>
            <TooltipButton
              onClick={handleSetSentence}
              shortcut={{ key: 'R' }}
              className="px-4 py-1 w-fit rounded-md bg-secondary text-text hover:bg-text hover:text-background duration-200 transition"
            >
              <IoReload className="w-5 h-5" />
            </TooltipButton>
          </div>

          <div className="flex flex-col justify-center gap-3 item-center">
            <h3 className="opacity-50">Stopwatch Mode</h3>
            <div className="flex gap-3">
              {Object.values(StopwatchMode).map((value) => {
                const shortcut = {
                  [StopwatchMode.TIMER]: 'T',
                  [StopwatchMode.COUNTDOWN]: 'C',
                }[value];

                return (
                  <TooltipButton
                    key={value}
                    onClick={() => {
                      setStopwatchMode(value as StopwatchMode);
                      localStorage.setItem('lastGameStopwatchMode', value as StopwatchMode);
                    }}
                    shortcut={{ key: shortcut }}
                    className={`px-4 py-1 rounded-md ${
                      stopwatchMode === value 
                        ? "bg-text text-background" 
                        : "text-text bg-secondary hover:bg-tertiary"
                    } duration-200 transition`}
                  >
                    {value === StopwatchMode.TIMER ? "Timer" : "Countdown"}
                  </TooltipButton>
                );
              })}
            </div>
          </div>
          
          {/* Section temps de décompte (visible uniquement en mode countdown) */}
          {stopwatchMode === StopwatchMode.COUNTDOWN && (
            <div className="flex flex-col justify-center gap-3 item-center">
              <h3 className="opacity-50">Time Limit</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {Object.values(TimeParameter).map((value) => {
                  const shortcut = {
                    [TimeParameter.SECONDS_15]: '1',
                    [TimeParameter.SECONDS_30]: '2',
                    [TimeParameter.SECONDS_45]: '3',
                    [TimeParameter.SECONDS_60]: '4',
                  }[value];

                  return (
                    <TooltipButton
                      key={value}
                      onClick={() => {
                        setTimeParameter(value as TimeParameter);
                        localStorage.setItem('lastGameTimeParameter', value as TimeParameter);
                      }}
                      shortcut={{ key: shortcut }}
                      className={`px-4 py-1 rounded-md ${
                        timeParameter === value 
                          ? "bg-text text-background" 
                          : "text-text bg-secondary hover:bg-tertiary"
                      } duration-200 transition`}
                    >
                      {value}
                    </TooltipButton>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col justify-center gap-3 item-center">
            <h3 className="opacity-50">Sentence Type</h3>
            <div className="flex gap-3">
              {Object.values(SentenceParameter).map((value) => {
                const shortcut = {
                  [SentenceParameter.QUOTE]: 'Q',
                  [SentenceParameter.RANDOM]: 'N',
                }[value];

                return (
                  <TooltipButton
                    key={value}
                    onClick={() => {
                      setSentenceParameterSelector(value as SentenceParameter);
                      localStorage.setItem('lastGameSentenceParameter', value as SentenceParameter);
                    }}
                    shortcut={{ key: shortcut }}
                    className={`px-4 py-1 rounded-md ${
                      sentenceParameterSelector === value 
                        ? "bg-text text-background" 
                        : "text-text bg-secondary hover:bg-tertiary"
                    } duration-200 transition`}
                  >
                    {value}
                  </TooltipButton>
                );
              })}
            </div>
          </div>

          {/* N'afficher la section longueur que si on est en mode timer */}
          {stopwatchMode === StopwatchMode.TIMER && (
            <div className="flex flex-col justify-center gap-3 item-center">
              <h3 className="opacity-50">Paragraph Length</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {Object.values(LengthParameter)
                  .filter((value) => typeof value === "string")
                  .map((value) => {
                    const shortcut = {
                      [LengthParameter.SHORT]: 'S',
                      [LengthParameter.MEDIUM]: 'M',
                      [LengthParameter.LONG]: 'L',
                      [LengthParameter.VERY_LONG]: 'V',
                    }[value];

                    return (
                      <TooltipButton
                        key={value}
                        onClick={() => {
                          setLengthParameterSelector(value as LengthParameter);
                          localStorage.setItem('lastGameLengthParameter', value as LengthParameter);
                        }}
                        shortcut={{ key: shortcut }}
                        className={`px-4 py-1 rounded-md ${
                          lengthParameterSelector === value 
                            ? "bg-text text-background" 
                            : "text-text bg-secondary hover:bg-tertiary"
                        } duration-200 transition`}
                      >
                        {value}
                      </TooltipButton>
                    );
                  })}
              </div>  
            </div>
          )}
        </div>
      </motion.div>
      {gameStatut !== GameState.ENDED ? (
        <div className="w-full flex-grow">
          <TemplateInputComponent
            gameType={GameTypeParameter.TYPE_TESTER}
            lengthParameter={lengthParameterSelector}
            sentenceParameter={sentenceParameterSelector}
            sentence={sentence}
            gameState={gameStatut}
            gameResults={gameResults}
            setGameResults={setGameResults}
            inputRef={inputRef}
            onGameStarts={handleGameStart}
            onGameReset={handleGameReset}
            // Nouveaux props pour le mode et le temps
            stopwatchMode={stopwatchMode}
            timeParameter={timeParameter}
            countdownTime={getCountdownTime()}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-3" />
      )}
      <Image
        width={400}
        height={400}
        alt="blader logo"
        className="absolute opacity-[2%] pointer-events-none"
        src="/assets/images/logo-white.png"
      />
      
      {/* Modal d'information sur le jeu */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-secondary rounded-xl p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-text">Game Rules & Modes</h2>
              <button 
                onClick={() => setShowInfoModal(false)}
                className="p-1 px-3 rounded-full bg-tertiary text-text hover:bg-text hover:text-background"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6 text-text">
              <div>
                <h3 className="text-xl font-semibold mb-2">How to Play</h3>
                <p className="text-text_secondary">Type the displayed text as quickly and accurately as possible. Your performance will be measured by Words Per Minute (WPM) and accuracy percentage.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Game Modes</h3>
                <div className="space-y-3">
                  <div className="bg-tertiary/20 p-3 rounded-lg">
                    <h4 className="font-medium flex items-center gap-2"><IoTimerOutline size={20} /> Timer Mode</h4>
                    <p className="text-text_secondary">Type at your own pace - the timer counts up. The test ends when you complete the text.</p>
                  </div>
                  <div className="bg-tertiary/20 p-3 rounded-lg">
                    <h4 className="font-medium flex items-center gap-2"><IoStopwatchOutline size={20} /> Countdown Mode</h4>
                    <p className="text-text_secondary">Race against the clock! You have a limited time to type as much text as possible.</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Text Options</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">Text Types</h4>
                    <ul className="list-disc pl-5">
                      <li><strong>Quote:</strong><span className="text-text_secondary"> Famous quotes with their authors</span></li>
                      <li><strong>Random:</strong><span className="text-text_secondary"> Randomly generated sentences</span></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Length Options</h4>
                    <ul className="list-disc pl-5">
                      <li><strong>Short:</strong><span className="text-text_secondary"> Brief sentences, perfect for quick practice</span></li>
                      <li><strong>Medium:</strong><span className="text-text_secondary"> Standard length for balanced practice</span></li>
                      <li><strong>Long:</strong><span className="text-text_secondary"> Extended text for endurance training</span></li>
                      <li><strong>Very Long:</strong><span className="text-text_secondary"> Maximum challenge for typing marathon</span></li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Keyboard Shortcuts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="bg-secondary/50 p-2 rounded-lg">
                    <span className="font-mono bg-tertiary/70 px-2 py-1 rounded">Alt+R</span>
                    <span className="text-text_secondary ml-2">Reload text</span>
                  </div>
                  <div className="bg-secondary/50 p-2 rounded-lg">
                    <span className="font-mono bg-tertiary/70 px-2 py-1 rounded">Alt+T</span>
                    <span className="text-text_secondary ml-2">Switch to Timer mode</span>
                  </div>
                  <div className="bg-secondary/50 p-2 rounded-lg">
                    <span className="font-mono bg-tertiary/70 px-2 py-1 rounded">Alt+C</span>
                    <span className="text-text_secondary ml-2">Switch to Countdown mode</span>
                  </div>
                  <div className="bg-secondary/50 p-2 rounded-lg">
                    <span className="font-mono bg-tertiary/70 px-2 py-1 rounded">Alt+Q</span>
                    <span className="text-text_secondary ml-2">Switch to Quote mode</span>
                  </div>
                  <div className="bg-secondary/50 p-2 rounded-lg">
                    <span className="font-mono bg-tertiary/70 px-2 py-1 rounded">Alt+N</span>
                    <span className="text-text_secondary ml-2">Switch to Random mode</span>
                  </div>
                  <div className="bg-secondary/50 p-2 rounded-lg">
                    <span className="font-mono bg-tertiary/70 px-2 py-1 rounded">Alt+S/M/L/V</span>
                    <span className="text-text_secondary ml-2">Set length (Short/Medium/Long/Very Long)</span>
                  </div>
                  <div className="bg-secondary/50 p-2 rounded-lg">
                    <span className="font-mono bg-tertiary/70 px-2 py-1 rounded">Alt+1/2/3/4</span>
                    <span className="text-text_secondary ml-2">Set countdown time (15/30/45/60 seconds)</span>
                  </div>
                  <div className="bg-secondary/50 p-2 rounded-lg">
                    <span className="font-mono bg-tertiary/70 px-2 py-1 rounded">Tab</span>
                    <span className="text-text_secondary ml-2">Reset current game</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Tips</h3>
                <ul className="list-disc pl-5">
                  <li>Take regular breaks to avoid fatigue</li>
                  <li>Practice with different text lengths and types</li>
                  <li>Complete games to unlock achievements</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TypeTester;
