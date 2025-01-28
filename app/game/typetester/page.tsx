"use client";

import {
  GameTypeParameter,
  LengthParameter,
  SentenceParameter,
  GameState,
  Quote,
} from "@app/types/GameParameters";
import { GameResults } from "@app/types/GameResults";
import TemplateInputComponent from "../TemplateInputComponent";
import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { fetchRandomSentence, fetchQuote } from "../gameHandler";
import Image from "next/image";
import { IoReload } from "react-icons/io5";

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
    useState<LengthParameter>(LengthParameter.MEDIUM);
  const [sentenceParameterSelector, setSentenceParameterSelector] =
    useState<SentenceParameter>(SentenceParameter.RANDOM);
  const [gameStatut, setGameStatut] = useState<GameState>(GameState.RESET);
  const [sentence, setSentence] = useState<string | Quote>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const animate = useAnimation();
  const [gameResults, setGameResults] = useState<GameResults>({
    wpmOverTime: [0],
    accuracyOverTime: [0],
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

  const handleKeysPressed = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (gameStatut === GameState.STARTED) {
      if (e.key === "Enter") {
        handleGameEnd();
      }
    } else {
      if (e.ctrlKey && e.key === "R") {
        handleSetSentence();
      }
    }
  };

  const handleSetSentence = () => {
    switch (sentenceParameterSelector) {
      case SentenceParameter.QUOTE:
        setSentence(fetchQuote(lengthParameterSelector));
        break;
      case SentenceParameter.RANDOM:
        setSentence(fetchRandomSentence(lengthParameterSelector));
        break;
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    handleSetSentence();
  }, [lengthParameterSelector, sentenceParameterSelector]);

  return (
    <section className="flex flex-col h-screen justify-center gap-1 py-10 items-center  overflow-hidden text-text z-30 sm:pb-20">
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
            <button
              onClick={handleSetSentence}
              className="px-4 py-1 w-fit rounded-md bg-tertiary text-text hover:bg-text hover:text-background duration-200 transition"
            >
              <IoReload className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col justify-center gap-3 item-center">
            <h3 className="opacity-50">Paragraph Length</h3>
            <div className="flex gap-3">
              {Object.values(LengthParameter)
                .filter((value) => typeof value === "string") // Filter out the string keys
                .map((value) => (
                  <button
                    key={value}
                    onClick={() =>
                      setLengthParameterSelector(value as LengthParameter)
                    }
                    className={`px-4 py-1 rounded-md ${
                      lengthParameterSelector === value ? "bg-text text-background" : " text-text hover:bg-tertiary"} duration-200 transition`}
                  >
                    {value}
                  </button>
                ))}
            </div>
          </div>
          <div className="flex flex-col justify-center gap-3 item-center">
            <h3 className="opacity-50">Sentence Type</h3>
            <div className="flex gap-3">
              {Object.values(SentenceParameter).map((value) => (
                <button
                  key={value}
                  onClick={() =>
                    setSentenceParameterSelector(value as SentenceParameter)
                  }
                  className={`px-4 py-1 rounded-md ${sentenceParameterSelector === value ? "bg-text text-background" : " text-text hover:bg-tertiary"} duration-200 transition`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      {gameStatut !== GameState.ENDED ? (
        <div className="w-full">
          <TemplateInputComponent
            gameType={GameTypeParameter.TYPE_TESTER}
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
