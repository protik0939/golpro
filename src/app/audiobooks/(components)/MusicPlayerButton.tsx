'use client'

import React, { useEffect, useState } from 'react';
import { useMusic } from '@/app/context/MusicContext';
import axios from 'axios';
import MusicPlayer from '@/components/MusicPlayer';
import { IAudio } from '@/DummyApi/typeScript';

export default function MusicPlayerButton() {
    const { selectedContentIndex, selectedSeasonIndex, selectedMusicIndex, directAudioTrack } = useMusic();
    const [songs, setSongs] = useState<IAudio[]>([]);

    useEffect(() => {
        const fetchEpisode = async () => {
            try {
                const response = await axios.get<IAudio[]>('/api/contentcrud/audioget');
                // console.log(response.data);
                setSongs(response.data);
            } catch (error) {
                console.error("Error fetching episode count:", error);
            }
        };

        fetchEpisode();
    }, []);

    const selectedContent = selectedContentIndex === null ? null : songs[selectedContentIndex];
    const selectedSeason = selectedContent && selectedSeasonIndex === null ? null : selectedContent?.cSeasons[selectedSeasonIndex ?? 0] ?? null;
    const selectedMusic = selectedSeason && selectedMusicIndex === null ? null : selectedSeason?.cEpisodes[selectedMusicIndex ?? 0] ?? null;

    if (!selectedContent && !directAudioTrack) return null;

    if (!selectedContent || !selectedSeason || !selectedMusic) {
        if (!directAudioTrack) return null;
    }

    return (
        <div className="fixed bottom-20 lg:bottom-4  w-full z-40 flex items-center p-2 justify-center rounded-lg pointer-events-none">
            <div className="relative w-full max-w-3xl bg-black/50 backdrop-blur-lg rounded-lg shadow-lg pointer-events-auto">
                <div className="relative z-20">
                    <MusicPlayer
                        music={selectedMusic ?? undefined}
                        directAudioTrack={directAudioTrack}
                        fullApi={songs}
                        totalMusic={songs.length}
                        totalSeasons={selectedContent?.cSeasons.length ?? 0}
                        totalEpisodes={selectedSeason?.cEpisodes.length ?? 0}
                    />
                </div>
            </div>
        </div>
    );
}