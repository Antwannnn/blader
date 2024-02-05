"use client";

import { LengthParameter, GameTypeParameter, SentenceParameter, GameState } from "@app/types/GameParameters"
import useState from "react-usestateref";
import { useStopwatch } from "@app/hooks/Stopwatch";
import { useEffect } from "react";


interface TemplateProps {
    length: LengthParameter;
    gameType: GameTypeParameter;
    sentence: SentenceParameter;
    gameState: GameState;
    onGameStarts: () => void;
    onGameReset: () => void;
}

const TemplateInputComponent = ({ length, gameType, sentence, onGameStarts, onGameReset, gameState, }: TemplateProps) => {


    const [input, setInput] = useState<string>("");
    var [currentIndex, setCurrentIndex, currentIndexRef] = useState<number>(0);
    const indexedError = useState<number[]>([])[0];

    const exampleSentence = "Minou c'est vraiment trop un queutard, il est là, il choppe gaga right in the pocket mon copain.";
    const splittedSentence = exampleSentence.split('');

    const reset = () => {
        setInput("");
        setCurrentIndex(0);
        setTotalErrors(0);
        setWpm(0);
        setAccuracy(0);
        indexedError.splice(0, indexedError.length);
    }

    // Statistics related variables
    const [wpm, setWpm] = useState<number>(0);
    const [accuracy, setAccuracy] = useState<number>(0);
    const time = useStopwatch();
    const [totalErrors, setTotalErrors] = useState<number>(0);



    const verifyInputMatching = (key: string) => {
        if (key === splittedSentence[currentIndex] && splittedSentence[input.length] === key) {
            return true;
        } else {
            return false;
        }
    }

    const resetGame = () => {
        time.stop();
        time.reset();
        onGameReset();
        reset();
    }

    const startGame = () => {
        onGameStarts();
        time.start();
    }

    const getGrossWpm = () => {
        const timeInMinutes = time.rawTime / 60000;
        return Math.floor(input.length / 5 / timeInMinutes);
    }

    const getAccuracy = () => {
        if (input.length === 0) return 0;
        let accuracy: number = totalErrors > input.length ? 0 : Math.floor((input.length - totalErrors) / input.length * 100);
        return accuracy;
    }

    useEffect(() => {
        if (gameState !== GameState.ENDED) {
            setWpm(getGrossWpm());
            setAccuracy(getAccuracy());
        }
    }, [gameState, time.rawTime])


    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {

        if (e.ctrlKey && 'cvxspwuaz'.indexOf(e.key) !== -1) {
            e.preventDefault()
            return;
        }

        if (e.key === 'Tab') {
            e.preventDefault();
            if (gameState === GameState.STARTED) {
                resetGame();
            }
        }


        if (e.key !== 'Shift' && e.key !== 'Alt' && e.key !== 'Control' && e.key !== 'Meta' && e.key !== 'Tab' && e.key !== 'CapsLock' && e.key !== 'Enter' && e.key !== 'Escape' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'ArrowUp' && e.key !== 'ArrowDown' && e.key !== 'Home' && e.key !== 'End' && e.key !== 'PageUp' && e.key !== 'PageDown' && e.key !== 'Insert' && e.key !== 'F1' && e.key !== 'F2' && e.key !== 'F3' && e.key !== 'F4' && e.key !== 'F5' && e.key !== 'F6' && e.key !== 'F7' && e.key !== 'F8' && e.key !== 'F9' && e.key !== 'F10' && e.key !== 'F11' && e.key !== 'F12' && e.key !== 'ScrollLock' && e.key !== 'Pause' && e.key !== 'ContextMenu' && e.key !== 'PrintScreen' && e.key !== 'NumLock' && e.key !== 'Clear' && e.key !== 'OS') {
            if (e.key !== 'Backspace' && (input.length + indexedError.length) - 1 < splittedSentence.length) {
                if (gameState !== GameState.STARTED) {
                    startGame();
                }
                setCurrentIndex(currentIndex + 1);
                if (verifyInputMatching(e.key)) {
                    setInput(input + e.key);
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
        }
    }

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div className="w-5/6 text-justify text-3xl relative overflow-hidden flex justify-center py-20">
                <input onChange={(e) => { }} onKeyDown={handleKeyPress} className="w-full px-14 pb-10 h-full absolute  opacity-0" />
                <span className="w-full pointer-events-none opacity-30">{exampleSentence.split('').map((e, index) => (
                    <span key={index} className={` ${indexedError.includes(index) ? `${e === ' ' && 'bg-red-500'} text-red-500` : `${currentIndexRef.current >   index && 'text-green-500'}`}  ${currentIndexRef.current === index && 'border-l-[2px] border-primary_light duration-200 transition'} `}>{e}</span>
                ))}</span>
            </div>

            <div className="grid place-items-center sm:grid-cols-3 grid-cols-1 sm:grid-rows-1 grid-rows-3 gr sm:flex-row flex-col w-full justify-around">
                <div className="flex flex-row sm:flex-col text-secondary_light text-md opacity-50">
                    <h1>{gameState === GameState.STARTED ? wpm : '-'} WPM (Previsional)</h1>
                    <h1>{time.time}</h1>
                </div>
                <div>
                    <button className="opacity-30 hover:opacity-100 transition duration-200" onClick={resetGame}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    </button>
                </div>
                <div className="flex flex-row sm:flex-col opacity-50 text-md">
                    <h1>{accuracy}%</h1>
                    <h1>{input.length} / {splittedSentence.length}</h1>
                </div>
            </div>
        </div>
    )
}


export default TemplateInputComponent