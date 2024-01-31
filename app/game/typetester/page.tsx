"use client"

import { GameTypeParameter, LengthParameter, SentenceParameter } from '@app/types/GameParameters'
import TemplateInputComponent from '../TemplateInputComponent';
import { useState } from 'react';
import Image from 'next/image';


const TypeTester = () => {

    const lengthParameterLabelBinding: Map<LengthParameter, string> = new Map([
        [LengthParameter.SHORT, "Short"],
        [LengthParameter.MEDIUM, "Medium"],
        [LengthParameter.LONG, "Long"],
        [LengthParameter.VERY_LONG, "Very Long"],
    ])

    const sentenceParameterLabelBinding: Map<SentenceParameter, string> = new Map([
        [SentenceParameter.RANDOM, "Random"],
        [SentenceParameter.QUOTE, "Sentence"],
        //[SentenceParameter.CUSTOM, "Custom"],
        //[SentenceParameter.MIRROR, "Mirror"]
    ])

    const [lengthParameterSelector, setLengthParameterSelector] = useState<LengthParameter>(LengthParameter.MEDIUM);
    const [sentenceParameterSelector, setSentenceParameterSelector] = useState<SentenceParameter>(SentenceParameter.RANDOM);
    const [sideEffectHasStarted, setSideEffectHasStarted] = useState<boolean>(false);

    return (
        <section className="flex flex-col h-screen justify-center gap-1 py-10 items-center  overflow-hidden text-secondary_light z-30">
            <h1 className="text-4xl text-primary_light">Type Testing</h1>
            <div className='flex gap-7 py-6'>
                <div className='flex flex-col justify-center gap-3 item-center'>
                    <h3 className='opacity-50'>Paragraph Length</h3>
                    <div className='flex gap-3'>
                        {Array.from(lengthParameterLabelBinding).map(([key, value]) => (
                            <button key={key} onClick={() => setLengthParameterSelector(key)} className={`px-4 py-1 rounded-md ${lengthParameterSelector === key ? 'bg-primary_light text-primary_dark' : 'bg-secondary_dark text-secondary_light hover:bg-secondary_light hover:text-secondary_dark'} duration-200 transition`}>{value}</button>
                        ))}
                    </div>
                </div>
                <div className='flex flex-col justify-center gap-3 item-center'>
                    <h3 className='opacity-50'>Sentence Type</h3>
                    <div className='flex gap-3'>
                        {Array.from(sentenceParameterLabelBinding).map(([key, value]) => (
                            <button key={key} onClick={() => setSentenceParameterSelector(key)} className={`px-4 py-1 rounded-md ${sentenceParameterSelector === key ? 'bg-primary_light text-primary_dark' : 'bg-secondary_dark text-secondary_light hover:bg-secondary_light hover:text-secondary_dark'} duration-200 transition`}>{value}</button>
                        ))}
                    </div>
                </div>
            </div>
            <div>
                <TemplateInputComponent sideEffectHasStarted={sideEffectHasStarted} gameType={GameTypeParameter.TYPE_TESTER} length={lengthParameterSelector} sentence={sentenceParameterSelector} />
            </div>
            <Image width={300} height={300} alt='blader logo' className='absolute opacity-[2%] pointer-events-none' src='/assets/images/logo-white.png' />

        </section>
    )
}

export default TypeTester;