'use client';
import { useMusic } from '@/app/context/MusicContext';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { HoverCard } from './HoverCard';
import { IAudio, IEpisode, ISeason } from '@/DummyApi/typeScript';


export default function Audiobooks() {
  const [songs, setSongs] = useState<IAudio[]>([]);
  const { playMusic, isPlaying, selectedContentIndex, selectedSeasonIndex, selectedMusicIndex, playControl } = useMusic();
  const [loadingMusic, setLoadingMusic] = useState(true);

  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const response = await axios.get<IAudio[]>('/api/contentcrud/audioget');
        console.log(response.data);
        setSongs(response.data);
        setLoadingMusic(false);
      } catch (error) {
        console.error("Error fetching episode count:", error);
        setLoadingMusic(false);
      }
    };

    fetchEpisode();
  }, []);


  const handleClick = (musicIdx: number, seasonIdx: number, episodeIdx: number) => {
    if (isPlaying && episodeIdx === selectedMusicIndex && seasonIdx === selectedSeasonIndex && musicIdx === selectedContentIndex) {
      playControl();
    } else {
      playMusic(musicIdx, seasonIdx, episodeIdx);
    }
  };
  

  if (loadingMusic) {
    return (
      <div className="pt-20">
        <div className="flex justify-center items-center flex-wrap p-8 sm:p-0">
          {Array.from({ length: 12 }).map((_, index) => (
            <button key={index} className="md:w-1/5 w-[49%] md:m-[3px] m-[1px] aspect-square">
              <div className="group w-full aspect-square animate-pulse skeletonLoaderBg duration-300 ease-in-out shadow-xl relative cursor-pointer">

                <figure className="w-full h-full skeletonLoaderBg animate-pulse">
                  <div className="w-full h-full skeletonLoaderBg animate-pulse"></div>
                </figure>

                <div className="absolute top-6 sm:top-0 w-full h-full">
                  <div className="flex items-center w-full">
                    <div className="w-4 h-6 md:group-hover:w-8 duration-200 ease-in-out skeletonLoaderBg animate-pulse" />
                    <div className="w-full bg-gradient-to-r from-black to-transparent pl-3 md:text-md text-xs">
                      <div className="w-24 h-4 skeletonLoaderBg animate-pulse"></div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 w-full bg-black/25">
                  <div className="flex space-x-2">
                    <div className="w-16 h-4 skeletonLoaderBg animate-pulse rounded-full"></div>
                  </div>
                  <div className="text-sm sm:text-xs h-4 w-3/4 skeletonLoaderBg animate-pulse rounded-full"></div>
                </div>

                <div className="flex absolute w-full h-full justify-center items-center top-0">
                  <div className="skeletonLoaderBg animate-pulse w-12 h-12 flex justify-center items-center p-4 rounded-full md:group-hover:rounded-none md:group-hover:w-full md:group-hover:h-full duration-300 ease-in-out">
                    <div className="w-6 h-6 skeletonLoaderBg animate-pulse rounded-full" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 w-full flex items-center flex-wrap justify-center">
      {songs.flatMap((music: IAudio, musicIndex: number) =>
        music.cSeasons.flatMap((season: ISeason, seasonIndex: number) =>
          season.cEpisodes.map((episode: IEpisode, episodeIndex: number) => {
            const uniqueIndex = `${musicIndex}-${seasonIndex}-${episodeIndex}`; // Unique composite index

            return (
              <button
                key={uniqueIndex}
                onClick={() => handleClick(musicIndex, seasonIndex, episodeIndex)}
                className={`md:w-1/5 w-[49%] md:m-[3px] m-[1px] aspect-square ${(selectedMusicIndex === episodeIndex && selectedContentIndex === musicIndex && selectedSeasonIndex === seasonIndex) ? 'animate-pulse' : 'animate-none'
                  }`}
              >
                <HoverCard
                  mdt={episode}
                  cAuthor={music.cAuthors.map((author, idx) => ({
                    fullName: author,
                    authorId: `author-${idx}`,
                    imageUrl: '',
                    description: '',
                  }))}
                  sci={selectedContentIndex}
                  ssi={selectedSeasonIndex}
                  smi={selectedMusicIndex}
                  ipp={isPlaying}
                  cidx={musicIndex}
                  midx={episodeIndex}
                  sidx={seasonIndex}
                />
              </button>
            );
          })
        )
      )}


    </div>
  );

}