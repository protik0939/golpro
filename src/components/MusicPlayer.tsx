'use client';
import { TMusicDataAnn } from '@/model/typeScript';
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import './MusicPlayer.css'
import { TbPlayerPause, TbPlayerPlay, TbPlayerStop, TbPlayerTrackNext, TbPlayerTrackPrev, TbRepeat, TbRepeatOff, TbVolume, TbVolumeOff } from "react-icons/tb";
import { useMusic } from './MusicContext';

interface MusicPlayerProps {
    music: TMusicDataAnn;
    totalMusic: number;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ music, totalMusic }) => {
    const playerRef = useRef<ReactPlayer | null>(null);
    const [muted, setMuted] = useState(false);
    const [volume, setVolume] = useState(1.0);
    const [loop, setLoop] = useState(false);
    const [played, setPlayed] = useState(0);
    const [loaded, setLoaded] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isClient, setIsClient] = useState(false); // Check if rendering on client

    const { selectedMusicIndex, playMusic, isPlaying, stopMusic, playControl } = useMusic();

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
        let x;
        if (selectedMusicIndex === null) {
            return;
        }
        else {
            if (selectedMusicIndex === totalMusic - 1) {
                x = 0;
            }
            else {
                x = selectedMusicIndex + 1;
            }
        }
        playMusic(x);
    }

    const handlePrev = () => {
        let x;
        if (selectedMusicIndex === null) {
            return;
        }
        else {
            if (selectedMusicIndex === 0) {
                x = totalMusic - 1;
            }
            else {
                x = selectedMusicIndex - 1;
            }
        }
        playMusic(x);

    }
    const handleNext = () => {
        let x;
        if (selectedMusicIndex === null) {
            return;
        }
        else {
            if (selectedMusicIndex === totalMusic - 1) {
                x = 0;
            }
            else {
                x = selectedMusicIndex + 1;
            }
        }
        playMusic(x);

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
                url={music.songSrc}
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
            <div className=" p-0 flex flex-col rounded-lg shadow-lg w-full mt-10 text-white">

                <div className="flex flex-col items-center space-x-2 w-full">
                    <Image
                        src={music.songImage}
                        alt={music.title}
                        width={600}
                        height={600}
                        className="w-2/3 h-2/3 rounded-lg shadow-md mb-4"
                    />
                    <div className='flex flex-col items-center justify-center'>
                        <div className="text-lg font-bold">{music.title}</div>
                        <div className="text-sm text-gray-400">{music.singer.join(', ')}</div>
                    </div>
                </div>
                <div className='flex'>

                    <div className=" w-full flex flex-col space-y-4 mt-0 justify-center">
                        <div className="flex space-x-4 justify-between px-4">
                            <div className='flex items-center space-x-3'>
                                <button
                                    className=""
                                    onClick={handlePlayPause}
                                >
                                    {isPlaying ? <TbPlayerPause className='text-2xl' /> : <TbPlayerPlay className='text-2xl' />}
                                </button>
                                <button
                                    className=""
                                    onClick={handleStop}
                                >
                                    <TbPlayerStop className='text-2xl' />
                                </button>
                                <button
                                    className=""
                                    onClick={() => setLoop(!loop)}
                                >
                                    {loop ? <TbRepeat className='text-2xl' /> : <TbRepeatOff className='text-2xl' />}
                                </button>
                            </div>

                            <div className='flex justify-center items-center space-x-3'>
                                <button
                                    className=""
                                    onClick={handlePrev}
                                >
                                    <TbPlayerTrackPrev className='text-2xl' />
                                </button>


                                <button
                                    className=""
                                    onClick={handleNext}
                                >
                                    <TbPlayerTrackNext className='text-2xl' />
                                </button>


                                <select
                                    className="select select-ghost"
                                    onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                                    value={playbackRate}
                                >
                                    <option value="0.5">0.5x</option>
                                    <option value="1">1x</option>
                                    <option value="1.5">1.5x</option>
                                    <option value="2">2x</option>
                                </select>

                            </div>

                        </div>

                        <div className="flex items-center justify-center space-x-2 w-full px-4">
                            <button
                                className=""
                                onClick={() => setMuted(!muted)}
                            >
                                {muted ? <TbVolumeOff className='text-2xl' /> : <TbVolume className='text-2xl' />}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="w-full"
                                style={{
                                    background: `linear-gradient(to right, #436be1 ${volume * 100}%, #030330 ${volume * 100}%,  #030330 100%)`,
                                }}
                            />
                        </div>
                    </div>
                </div>


                <div className="mt-0 flex justify-between p-2 text-xs">
                    <span>{formatTime(playedSeconds)}</span>
                    <span>{formatTime(duration)}</span>
                    <span>-{formatTime(remainingTime)}</span>
                </div>
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
            </div>
        </>
    );
};

export default MusicPlayer;
