"use client";

import { LengthParameter, GameTypeParameter, SentenceParameter } from "@app/types/GameParameters"
import { useEffect, useState } from "react"


interface TemplateProps {
    length: LengthParameter;
    gameType: GameTypeParameter;
    sentence: SentenceParameter;
}

const areaMinSizeCalculation = (length: LengthParameter, mediaQueryFactor: number) => {
    let width = 50 * mediaQueryFactor;
    return width;
}


const TemplateInputComponent = ({ length, gameType, sentence }: TemplateProps) => {

    return (
        <div className="flex flex-col items-center justify-center">
            <textarea  className="text-2xl outline-none px-3 py-3 rounded-xl resize-none bg-secondary_dark overflow-hidden min-h-20 max-h-72"  name="typingarea" id="" cols={areaMinSizeCalculation(length, 1)}></textarea>
        </div>
    )
}

export default TemplateInputComponent