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
import { IoReload } from "react-icons/io5";
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

  const handleGameStart = () => {
    animate.start("hidden");

    setGameStatut(GameState.STARTED);
  };

  const handleGameReset = () => {
    animate.start("visible");
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
          setSentence(fetchRandomSentence(timeToLength[timeParameter]));
        } else {
          setSentence(fetchRandomSentence(lengthParameterSelector));
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
  }, [lengthParameterSelector, sentenceParameterSelector, stopwatchMode, timeParameter]);

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
    <section onKeyDown={handleShortcuts} className="flex flex-col overflow-auto  justify-center gap-1 lg:pt-32 md:pt-20 pt-10 items-center text-text z-30">
      <motion.div
        className="flex flex-col justify-center items-center"
        variants={animationVariants}
        animate={animate}
        initial="visible"
      >
        <h1 className="text-4xl text-primary_light">Type Testing</h1>
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
    </section>
  );
};

export default TypeTester;
