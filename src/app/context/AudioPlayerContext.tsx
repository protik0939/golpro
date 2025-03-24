'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useMemo } from "react";

interface IAudioPlayerContext {
    currentTrack: ITrack | null;
    isPlaying: boolean;
    playTrack: (track: ITrack) => void;
    togglePlay: () => void;
    seek: (time: number) => void;
    changeVolume: (volume: number) => void;
    audioRef: React.RefObject<HTMLAudioElement>;
    currentTime: number;
    duration: number;
}

interface ITrack {
    title: string;
    src: string;
    cover?: string;
}

const AudioPlayerContext = createContext<IAudioPlayerContext | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState<ITrack | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);
  
    const playTrack = (track: ITrack) => {
      setCurrentTrack(track);
      setIsPlaying(true);
    };
  
    const togglePlay = () => {
      if (!audioRef.current) return;
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.error("Playback Error:", error);
        });
      }
      setIsPlaying(!isPlaying);
    };
  
    const seek = (time: number) => {
      if (audioRef.current) {
        audioRef.current.currentTime = time;
      }
    };
  
    const changeVolume = (volume: number) => {
      if (audioRef.current) {
        audioRef.current.volume = volume;
      }
    };
  
    // ✅ Memoize context value to prevent unnecessary re-renders
    const value = useMemo(
      () => ({
        currentTrack,
        isPlaying,
        playTrack,
        togglePlay,
        seek,
        changeVolume,
        audioRef,
        currentTime,
        duration,
      }),
      [currentTrack, isPlaying, currentTime, duration]
    );
  
    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;
  
      const updateTime = () => {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration || 0);
      };
  
      audio.addEventListener("timeupdate", updateTime);
      return () => audio.removeEventListener("timeupdate", updateTime);
    }, []);
  
    return (
      <AudioPlayerContext.Provider value={value}>
        {children}
        <audio
          ref={audioRef}
          src={currentTrack?.src}
          autoPlay
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </AudioPlayerContext.Provider>
    );
  };
  

export const useAudioPlayer = () => {
    const context = useContext(AudioPlayerContext);
    if (!context) throw new Error("useAudioPlayer must be used within an AudioPlayerProvider");
    return context;
};