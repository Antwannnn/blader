"use client";

import {
  GameState,
  GameTypeParameter,
  LengthParameter,
  Quote,
  SentenceParameter,
} from "@app/types/GameParameters";
import { GameResults } from "@app/types/GameResults";
import TooltipButton from "@components/subcomponents/TooltipButton";
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

const TypeTester = () => {
  const [lengthParameterSelector, setLengthParameterSelector] =
    useState<LengthParameter>(LengthParameter.SHORT);
  const [sentenceParameterSelector, setSentenceParameterSelector] =
    useState<SentenceParameter>(SentenceParameter.QUOTE);
  const [gameStatut, setGameStatut] = useState<GameState>(GameState.RESET);
  const [sentence, setSentence] = useState<string | Quote>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const animate = useAnimation();
  const [gameResults, setGameResults] = useState<GameResults>({
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
        setSentence(fetchQuote(lengthParameterSelector));
        break;
      case SentenceParameter.RANDOM:
        console.log('fetchRandomSentence');
        setSentence(fetchRandomSentence(lengthParameterSelector));
        break;
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    const lengthParameter = localStorage.getItem('lastGameLengthParameter') as LengthParameter;
    const sentenceParameter = localStorage.getItem('lastGameSentenceParameter') as SentenceParameter;
    console.log(lengthParameter);
    console.log(sentenceParameter);
    setLengthParameterSelector(lengthParameter);
    setSentenceParameterSelector(sentenceParameter);
  }, []);

  useEffect(() => {
    handleSetSentence();
  }, [lengthParameterSelector, sentenceParameterSelector]);

  // Gestionnaire de raccourcis clavier séparé
  const handleShortcuts = (e: React.KeyboardEvent<HTMLInputElement>) => {

    if (!e.altKey || gameStatut === GameState.STARTED) return;


    e.preventDefault();
    switch (e.key) {
      case '®':
        handleSetSentence();
        break;
      case 'Ò':
        setLengthParameterSelector(LengthParameter.SHORT);
        localStorage.setItem('lastGameLengthParameter', LengthParameter.SHORT);
        break;
      case 'µ':
        setLengthParameterSelector(LengthParameter.MEDIUM);
        localStorage.setItem('lastGameLengthParameter', LengthParameter.MEDIUM);
        break;
      case '¬':
        setLengthParameterSelector(LengthParameter.LONG);
        localStorage.setItem('lastGameLengthParameter', LengthParameter.LONG);
        break;
      case '◊':
        setLengthParameterSelector(LengthParameter.VERY_LONG);
        localStorage.setItem('lastGameLengthParameter', LengthParameter.VERY_LONG);
        break;
      case '‡':
        setSentenceParameterSelector(SentenceParameter.QUOTE);
        localStorage.setItem('lastGameSentenceParameter', SentenceParameter.QUOTE);
          break;
      case '‹':
        setSentenceParameterSelector(SentenceParameter.RANDOM);
        localStorage.setItem('lastGameSentenceParameter', SentenceParameter.RANDOM);
        break;
    }
  };

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
