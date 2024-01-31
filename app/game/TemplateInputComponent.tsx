"use client";

import { PerformanceMesure } from "@app/classes/PerformanceMesure";
import { LengthParameter, GameTypeParameter, SentenceParameter } from "@app/types/GameParameters"
import { set } from "mongoose";
import { use, useEffect, useState } from "react"


interface TemplateProps {
    length: LengthParameter;
    gameType: GameTypeParameter;
    sentence: SentenceParameter;
}

const areaMinSizeCalculation = (length: LengthParameter, mediaQueryFactor: number) => {
    let width = 90 * mediaQueryFactor;
    return width;
}



const TemplateInputComponent = ({ length, gameType, sentence }: TemplateProps) => {

    const [input, setInput] = useState<string>("");
    const performanceMesure: PerformanceMesure = PerformanceMesure.getInstance();
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const exampleSentence = "This is an example sentence";

    const splittedSentence = exampleSentence.split('');

    const verifyInputMatching = (key: string) => {
        if (key === splittedSentence[currentIndex]) {
            return true;
        } else {
            return false;
        }   
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {

        if (e.key !== 'Backspace' && e.key !== 'Shift' && e.key !== 'Alt' && e.key !== 'Control' && e.key !== 'Meta' && e.key !== 'Tab' && e.key !== 'CapsLock' && e.key !== 'Enter' && e.key !== 'Escape' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'ArrowUp' && e.key !== 'ArrowDown' && e.key !== 'Home' && e.key !== 'End' && e.key !== 'PageUp' && e.key !== 'PageDown' && e.key !== 'Insert' && e.key !== 'F1' && e.key !== 'F2' && e.key !== 'F3' && e.key !== 'F4' && e.key !== 'F5' && e.key !== 'F6' && e.key !== 'F7' && e.key !== 'F8' && e.key !== 'F9' && e.key !== 'F10' && e.key !== 'F11' && e.key !== 'F12' && e.key !== 'ScrollLock' && e.key !== 'Pause' && e.key !== 'ContextMenu' && e.key !== 'PrintScreen' && e.key !== 'NumLock' && e.key !== 'Clear' && e.key !== 'OS') {

            if(verifyInputMatching(e.key)){
                setCurrentIndex(currentIndex + 1);
                setInput(input + e.key);
            } else{
                
            }

            /*if (!performanceMesure.hasStarted()) {
                performanceMesure.startGame();
            }*/
        } else{
            if(currentIndex > 0){
                setInput(input.slice(0, -1));
                setCurrentIndex(currentIndex - 1);
            }
        }

    }

    useEffect(() => {

    }, [input])


    return (
        <div className="flex flex-col items-center justify-center">
            <div>
                <span className="absolute px-3 py-3 text-2xl pointer-events-none opacity-30">{exampleSentence.split('').map((e, index) => (
                    <span key={index} className={`${index === currentIndex ? 'text-primary_light' : 'text-secondary_light'}`}>{e}</span>
                    
                ))}</span>

                <textarea value={input} onKeyDown={handleKeyPress} onChange={(e) => { }} className="text-2xl outline-none px-3 py-3 rounded-xl resize-none bg-secondary_dark overflow-hidden min-h-52 text-green-700 max-h-72 " name="typingarea" id="" cols={areaMinSizeCalculation(length, 1)} />
            </div>
        </div>
    )
}


export default TemplateInputComponent