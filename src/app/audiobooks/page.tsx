'use client'
import React from 'react';
import musicData from "@/model/musicApi";
import { TMusicData } from "@/model/typeScript";
import { HoverCard } from "./(Components)/HoverCard";
import { useMusic } from "@/components/MusicContext";

export default function page() {

    const { playMusic, isPlaying, selectedMusicIndex, playControl } = useMusic();

    const handleClick = (e: number) => {
        if (isPlaying) {
            playControl();
        }
        else {
            playMusic(e);
        }
    };

    return (
        <div className="pt-20">
            <div className="flex justify-center items-center flex-wrap p-8 sm:p-0">
                {musicData.map((music: TMusicData, index: number) => {
                    return (
                        <div onClick={() => handleClick(index)}
                            className={`w-1/5 sm:w-[39%] m-[3px] sm:m-[1px] aspect-square ${selectedMusicIndex === index ? 'animate-pulse' : 'animate-none'}`}
                            key={music.id}>
                            <HoverCard mdt={music} smi={selectedMusicIndex} ipp={isPlaying} idx={index}/>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
