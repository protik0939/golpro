'use client';
import { useMusic } from '@/app/context/MusicContext';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { HoverCard } from './HoverCard';
import { IAudio } from '@/DummyApi/typeScript';


export default function Audiobooks() {
  const [songs, setSongs] = useState<IAudio[]>([]);
  const { playMusic, isPlaying, selectedMusicIndex, playControl } = useMusic();

  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const response = await axios.get<IAudio[]>('/api/contentcrud/audioget');
        console.log(response.data);
        setSongs(response.data);
      } catch (error) {
        console.error("Error fetching episode count:", error);
      }
    };

    fetchEpisode();
  }, []);


  const handleClick = (e: number) => {
    if (isPlaying && e === selectedMusicIndex) {
      playControl();
    }
    else {
      playMusic(e);
    }
  };

  return (
    <div className="pt-20">
      <div className="flex justify-center items-center flex-wrap p-8 sm:p-0">
        {songs.map((music: IAudio, index: number) => {
          return (
            <button key={music.cId} onClick={() => handleClick(index)}
              className={`md:w-1/5 w-[49%] md:m-[3px] m-[1px] aspect-square ${selectedMusicIndex === index ? 'animate-pulse' : 'animate-none'}`} >
              <HoverCard mdt={music} smi={selectedMusicIndex} ipp={isPlaying} idx={index} />
            </button>
          );
        })}
      </div>
    </div>
  )
}