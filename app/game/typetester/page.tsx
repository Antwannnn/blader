"use client";

import {
  GameTypeParameter,
  LengthParameter,
  SentenceParameter,
  GameState,
  Quote,
} from "@app/types/GameParameters";
import TemplateInputComponent from "../TemplateInputComponent";
import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { fetchRandomSentence, fetchQuote } from "../gameHandler";
import Image from "next/image";

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
    <section className="flex flex-col h-screen justify-center gap-1 py-10 items-center  overflow-hidden text-secondary_light z-30 sm:pb-20">
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
              className="px-4 py-1 w-fit rounded-md bg-secondary_dark text-secondary_light hover:bg-secondary_light hover:text-secondary_dark duration-200 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
                />
              </svg>
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
                      lengthParameterSelector === value
                        ? "bg-primary_light text-primary_dark"
                        : "bg-secondary_dark text-secondary_light hover:bg-secondary_light hover:text-secondary_dark"
                    } duration-200 transition`}
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
                  className={`px-4 py-1 rounded-md ${sentenceParameterSelector === value ? "bg-primary_light text-primary_dark" : "bg-secondary_dark text-secondary_light hover:bg-secondary_light hover:text-secondary_dark"} duration-200 transition`}
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
