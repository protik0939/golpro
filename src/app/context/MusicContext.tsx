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
    const [selectedMusicIndex, setSelectedMusicIndex] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const playMusic = (index: number) => {
        setSelectedMusicIndex(index);
        setIsPlaying(true);
        setIsVisible(true);
    };

    const playControl = () => {
        setIsPlaying(!isPlaying);
    }


    const stopMusic = () => {
        setIsPlaying(false);
        setIsVisible(false);
        setSelectedMusicIndex(null);
    };

    return (
        <MusicContext.Provider
            value={{
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
