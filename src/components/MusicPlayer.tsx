'use client';
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import './MusicPlayer.css'
import { TbPlayerPause, TbPlayerPlay, TbPlayerStop, TbPlayerTrackNext, TbPlayerTrackPrev, TbRepeat, TbRepeatOff, TbVolume, TbVolumeOff } from "react-icons/tb";
import { useMusic } from '@/app/context/MusicContext';
import { IAudio, IEpisode } from '@/DummyApi/typeScript';


interface MusicPlayerProps {
    music: IEpisode;
    totalMusic: number;
    totalSeasons: number;
    totalEpisodes: number;
    fullApi: IAudio[];
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ music, totalMusic, totalSeasons, totalEpisodes, fullApi }) => {
    const playerRef = useRef<ReactPlayer | null>(null);
    const [muted, setMuted] = useState(false);
    const [volume, setVolume] = useState(1.0);
    const [loop, setLoop] = useState(false);
    const [played, setPlayed] = useState(0);
    const [loaded, setLoaded] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isClient, setIsClient] = useState(false); // Check if rendering on client

    const { playMusic, isPlaying, stopMusic, playControl, selectedContentIndex, selectedSeasonIndex, selectedMusicIndex } = useMusic();

    useEffect(() => {
        setIsClient(true); // Set to true only on the client side
    }, []);

    // Play and Pause Controls
    const handlePlayPause = () => {
        playControl();
    }

    // Stop the Player
    const handleStop = () => {
        stopMusic();
    };

    // Handle seeking
    const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setPlayed(value);
        playerRef.current?.seekTo(value);
    };

    // Update progress
    const handleProgress = (progress: { played: number; loaded: number }) => {
        setPlayed(progress.played);
        setLoaded(progress.loaded);
    };

    const handleDuration = (duration: number) => {
        setDuration(duration);
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleEnded = () => {
        if (selectedMusicIndex !== null && selectedSeasonIndex !== null && selectedContentIndex !== null) {
            let nextMusic = selectedContentIndex;
            let nextSeason = selectedSeasonIndex;
            let nextEpisode = selectedMusicIndex + 1;
            if (nextEpisode >= totalEpisodes) {
                nextEpisode = 0;
                nextSeason++;
            }
            if (nextSeason >= totalSeasons) {
                nextSeason = 0;
                nextMusic++;
            }
            if (nextMusic >= totalMusic) {
                nextMusic = 0;
            }
            playMusic(nextMusic, nextSeason, nextEpisode);
        }
    }

    const handlePrev = () => {
        if (selectedMusicIndex !== null && selectedSeasonIndex !== null && selectedContentIndex !== null) {
            let prevMusic = selectedContentIndex;
            let prevSeason = selectedSeasonIndex;
            let prevEpisode = selectedMusicIndex - 1;

            // Check if the episode index is valid for the current season
            if (prevEpisode < 0) {
                prevSeason--; // Move to the previous season
                if (prevSeason >= 0) {
                    // Get the last episode of the previous season
                    prevEpisode = fullApi[prevMusic].cSeasons[prevSeason].cEpisodes.length - 1;
                } else {
                    // If we're at the first season, move to the previous music and get the last season's last episode
                    prevMusic--;
                    if (prevMusic >= 0) {
                        prevSeason = fullApi[prevMusic].cSeasons.length - 1;
                        prevEpisode = fullApi[prevMusic].cSeasons[prevSeason].cEpisodes.length - 1;
                    } else {
                        // If we're at the first content, wrap around to the last content
                        prevMusic = fullApi.length - 1;
                        prevSeason = fullApi[prevMusic].cSeasons.length - 1;
                        prevEpisode = fullApi[prevMusic].cSeasons[prevSeason].cEpisodes.length - 1;
                    }
                }
            }

            // If we're going past the first music, wrap around to the last music
            if (prevMusic < 0) {
                prevMusic = fullApi.length - 1;
            }

            playMusic(prevMusic, prevSeason, prevEpisode);
        }
    };


    const handleNext = () => {
        handleEnded();
    }


    const playedSeconds = duration * played;
    const remainingTime = duration - playedSeconds;

    // Only render player and dynamic content on client side
    if (!isClient) {
        return null;
    }

    return (
        <>


            <ReactPlayer
                ref={playerRef}
                url={music.cAudioSrc}
                playing={isPlaying}
                loop={loop}
                playbackRate={playbackRate}
                volume={volume}
                muted={muted}
                onProgress={handleProgress}
                onDuration={handleDuration}
                width="0%"
                height="0px"
                pip
                controls={false}
                onEnded={handleEnded}
            />
            <div className=" p-0 flex flex-col rounded-lg shadow-lg w-full text-white">

                <div className="flex items-center justify-center">
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={played}
                        onChange={handleSeekChange}
                        className="w-40"
                        style={{
                            background: `linear-gradient(to right, #436be1 ${played * 100}%, #000fff80 ${played * 100}%, #000fff80 ${loaded * 100}%, #030330 ${loaded * 100}%, #030330 100%)`,
                        }}
                    />
                </div>
                <div className='flex justify-between'>
                    <div className='w-20 h-20 hidden sm:block relative'>
                        <Image
                            src={music.cSquare}
                            alt={music.cTitle}
                            width={600}
                            height={600}
                            className="w-20 h-20 rounded-lg shadow-md"
                        />
                        <div className="sm:text-md text-xs w-full text-center font-bold absolute bottom-0 ">{music.cTitle}</div>
                    </div>
                    <div className='flex w-full flex-col mt-0 justify-center'>
                        <div className="flex space-x-4 justify-between p-3 h-full">

                            <div className='flex flex-col items-start justify-between'>
                                <div className='flex space-x-2'>
                                    <div className='group flex flex-col relative justify-center items-start'>
                                        <button
                                            className=""
                                            onClick={() => setMuted(!muted)}
                                        >
                                            {muted ? <TbVolumeOff className='text-md cursor-pointer' /> : <TbVolume className='text-md cursor-pointer' />}
                                        </button>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value={volume}
                                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                                            className="absolute left-5 !w-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            style={{
                                                background: `linear-gradient(to right, #436be1 ${volume * 100}%, #030330 ${volume * 100}%,  #030330 100%)`,
                                            }}
                                        />
                                    </div>
                                </div>

                                <span className='text-xs'>{formatTime(playedSeconds)}</span>
                            </div>

                            <div className='flex flex-col justify-between items-center'>
                                <div className='flex justify-center items-center space-x-3'>

                                    <button
                                        className=""
                                        onClick={handleStop}
                                    >
                                        <TbPlayerStop className='text-md cursor-pointer' />
                                    </button>

                                    <button
                                        className=""
                                        onClick={handlePrev}
                                    >
                                        <TbPlayerTrackPrev className='text-md cursor-pointer' />
                                    </button>

                                    <button
                                        className=""
                                        onClick={handlePlayPause}
                                    >
                                        {isPlaying ? <TbPlayerPause className='text-2xl cursor-pointer' /> : <TbPlayerPlay className='text-2xl cursor-pointer' />}
                                    </button>


                                    <button
                                        className=""
                                        onClick={handleNext}
                                    >
                                        <TbPlayerTrackNext className='text-md cursor-pointer' />
                                    </button>

                                    <button
                                        className=""
                                        onClick={() => setLoop(!loop)}
                                    >
                                        {loop ? <TbRepeat className='text-md cursor-pointer' /> : <TbRepeatOff className='text-md cursor-pointer' />}
                                    </button>

                                </div>
                                <span className='text-xs'>{formatTime(duration)}</span>
                            </div>



                            <div className='flex flex-col justify-between items-end'>
                                <select
                                    className="select bg-black/50 select-xs"
                                    onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                                    value={playbackRate}
                                >
                                    <option value="0.5">0.5x</option>
                                    <option value="1">1x</option>
                                    <option value="1.5">1.5x</option>
                                    <option value="2">2x</option>
                                </select>
                                <span className='text-xs'>-{formatTime(remainingTime)}</span>

                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default MusicPlayer;
