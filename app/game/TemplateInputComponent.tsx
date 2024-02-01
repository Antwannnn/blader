"use client";

import { LengthParameter, GameTypeParameter, SentenceParameter } from "@app/types/GameParameters"
import useState from "react-usestateref";
import { useStopwatch } from "@app/hooks/Stopwatch";


interface TemplateProps {
    length: LengthParameter;
    gameType: GameTypeParameter;
    sentence: SentenceParameter;
    gameStarted: boolean;
    onGameStarts: () => void;
    onGameEnds: () => void;
}

const TemplateInputComponent = ({ length, gameType, sentence, onGameStarts, onGameEnds, gameStarted }: TemplateProps) => {


    const [input, setInput] = useState<string>("");
    var [currentIndex, setCurrentIndex, currentIndexRef] = useState<number>(0);
    const indexedError = useState<number[]>([])[0];
 
    const exampleSentence = "Remi a failli hériter de plusieurs millions d'euros mais la daronne est complètement bornée.";
    const splittedSentence = exampleSentence.split('');

    const LETTER_SPACING = 2;

    const reset = () => {
        setInput("");
        setCurrentIndex(0);
        indexedError.length = 0;
    }

    // Statistics related variables
    const [wpm, setWpm, wpmRef] = useState<number>(0);
    const [accuracy, setAccuracy, accuracyRef] = useState<number>(0);
    const time = useStopwatch();
    const [totalLetters , setTotalLetters, totalLettersRef] = useState<number>(0);



    const verifyInputMatching = (key: string) => {
        if (key === splittedSentence[currentIndex] && splittedSentence[input.length] === key) {
            return true;
        } else {
            return false;
        }
    }


    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {

        if (e.ctrlKey && 'cvxspwuaz'.indexOf(e.key) !== -1) {
            e.preventDefault()
            return;
        }

        if (e.key === 'Tab') {
            e.preventDefault();
            if(gameStarted) {
                onGameEnds();
                time.stop();
                time.reset();
                reset();
            }
        }

        if (e.key !== 'Shift' && e.key !== 'Alt' && e.key !== 'Control' && e.key !== 'Meta' && e.key !== 'Tab' && e.key !== 'CapsLock' && e.key !== 'Enter' && e.key !== 'Escape' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'ArrowUp' && e.key !== 'ArrowDown' && e.key !== 'Home' && e.key !== 'End' && e.key !== 'PageUp' && e.key !== 'PageDown' && e.key !== 'Insert' && e.key !== 'F1' && e.key !== 'F2' && e.key !== 'F3' && e.key !== 'F4' && e.key !== 'F5' && e.key !== 'F6' && e.key !== 'F7' && e.key !== 'F8' && e.key !== 'F9' && e.key !== 'F10' && e.key !== 'F11' && e.key !== 'F12' && e.key !== 'ScrollLock' && e.key !== 'Pause' && e.key !== 'ContextMenu' && e.key !== 'PrintScreen' && e.key !== 'NumLock' && e.key !== 'Clear' && e.key !== 'OS') {
            if (e.key !== 'Backspace' && (input.length + indexedError.length) - 1 < splittedSentence.length) {
                if(!gameStarted) {
                    onGameStarts();
                    time.start();
                }
                setCurrentIndex(currentIndex + 1);
                if (verifyInputMatching(e.key)) {
                    setInput(input + e.key);
                } else {
                    indexedError.push(currentIndex);
                }

                /*if (!performanceMesure.hasStarted()) {
                    performanceMesure.startGame();
                    console.log("mesure started")
                }*/

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
            <div className="w-5/6 overflow-hidden">
                <span className="w-5/6 absolute p-3 text-2xl pointer-events-none opacity-30">{exampleSentence.split('').map((e, index) => (
                    <span key={index} className={` ${indexedError.includes(index) && `${e === ' ' && 'bg-red-500'} text-red-500`}  ${currentIndexRef.current === index && 'border-l-[2px] border-primary_light duration-200 transition'} `}>{e}</span>
                ))}</span>

                <textarea spellCheck={false} value={input} onKeyDown={handleKeyPress} onChange={(e) => { }} className={`w-full caret-transparent text-2xl outline-none p-3 rounded-xl resize-none bg-secondary_dark overflow-hidden min-h-52 text-green-600 max-h-72`} name="typingarea" id="" />
            </div>

            <div className="flex  items-center justify-center gap-10 mt-5">
                <h1 className="text-4xl">-  WPM</h1>
                <h1 className="text-4xl">{time.time}</h1>
            </div>
        </div>
    )
}


export default TemplateInputComponent