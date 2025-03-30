'use client'

import React, { useEffect, useState } from 'react';
import { useMusic } from '@/app/context/MusicContext';
import axios from 'axios';
import MusicPlayer from '@/components/MusicPlayer';
import { IAudio } from '@/DummyApi/typeScript';

export default function MusicPlayerButton() {
    const { selectedContentIndex, selectedSeasonIndex, selectedMusicIndex } = useMusic();
    const [songs, setSongs] = useState<IAudio[]>([]);

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

    if (selectedMusicIndex === null || selectedContentIndex === null || selectedSeasonIndex === null) return null;

    return (
        <div className="fixed bottom-20 lg:bottom-4  w-full z-40 flex items-center p-2 justify-center rounded-lg pointer-events-none">
            <div className="relative w-full max-w-3xl bg-black/50 backdrop-blur-lg rounded-lg shadow-lg pointer-events-auto">
                <div className="relative z-20">
                    <MusicPlayer music={songs[selectedContentIndex].cSeasons[selectedSeasonIndex].cEpisodes[selectedMusicIndex]} fullApi={songs} totalMusic={songs.length} totalSeasons={songs[selectedContentIndex].cSeasons.length} totalEpisodes={songs[selectedContentIndex].cSeasons[selectedSeasonIndex].cEpisodes.length} />
                </div>
            </div>
        </div>
    );
}