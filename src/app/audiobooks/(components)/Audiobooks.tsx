'use client';

import { useAudioPlayer } from '@/app/context/AudioPlayerContext';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface IEpisode {
  cTitle: string;
  cSquare: string;
  cAudioSrc: string;
}

interface ISeason {
  cEpisodes: IEpisode[];
}

interface IAudio {
  cSquare: string;
  cGenre: string[];
  cAuthors: string[];
  cSeasons: ISeason[];
}

export default function Audiobooks() {
  const [songs, setSongs] = useState<IAudio[]>([]);
  const { playTrack } = useAudioPlayer(); // 🔥 Use global audio context

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

  return (
    <div>
      <h1 className="text-xl font-bold">Audiobooks</h1>
      {songs.map((song, index) => {
        const firstEpisode = song.cSeasons[0]?.cEpisodes[0];

        return (
          <div key={index} className="p-4 border-b flex gap-4 items-center">
            <img src={song.cSquare} alt="Audio Cover" width={80} className="rounded-md shadow-md" />
            <div>
              <h2 className="text-lg font-semibold">{firstEpisode?.cTitle || "No Title"}</h2>
              <button
                onClick={() => playTrack({ title: firstEpisode?.cTitle || "Unknown", src: firstEpisode?.cAudioSrc || "", cover: song.cSquare })}
                className="bg-blue-500 text-white p-2 rounded mt-2"
              >
                ▶ Play
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
