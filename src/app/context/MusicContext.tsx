'use client'
import { TMusicContextType } from '@/DummyApi/typeScript';
import React, { createContext, useState, useContext, ReactNode } from 'react';

const MusicContext = createContext<TMusicContextType | undefined>(undefined);

export const useMusic = () => {
    const context = useContext(MusicContext);
    if (!context) {
        throw new Error("useMusic must be used within a MusicProvider");
    }
    return context;
};

interface MusicProviderProps {
    children: ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
    const [selectedContentIndex, setSelectedContentIndex] = useState<number | null>(null);
    const [selectedSeasonIndex, setSelectedSeasonIndex] = useState<number | null>(null);
    const [selectedMusicIndex, setSelectedMusicIndex] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const playMusic = (cIndex: number, sIndex: number, eIndex: number) => {
        setSelectedContentIndex(cIndex);
        setSelectedSeasonIndex(sIndex);
        setSelectedMusicIndex(eIndex);
        setIsPlaying(true);
        setIsVisible(true);
    };

    const playControl = () => {
        setIsPlaying(!isPlaying);
    }


    const stopMusic = () => {
        setIsPlaying(false);
        setIsVisible(false);
        setSelectedContentIndex(null);
        setSelectedSeasonIndex(null);
        setSelectedMusicIndex(null);
    };

    return (
        <MusicContext.Provider
            value={{
                selectedContentIndex,
                selectedSeasonIndex,
                selectedMusicIndex,
                isPlaying,
                isVisible,
                playMusic,
                stopMusic,
                playControl,
            }}
        >
            {children}
        </MusicContext.Provider>
    );
};
