'use client';

import { useAudioPlayer } from "@/app/context/AudioPlayerContext";

export default function AudioPlayer() {
  const { currentTrack, isPlaying, togglePlay, audioRef, seek, changeVolume, currentTime, duration } = useAudioPlayer();

  if (!currentTrack) return null;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white p-4 rounded-lg shadow-lg flex items-center gap-4 w-[400px]">
      <img src={currentTrack.cover || "https://via.placeholder.com/50"} alt="cover" className="w-12 h-12 rounded-md" />
      <div>
        <p className="text-sm font-bold">{currentTrack.title}</p>
        <button onClick={togglePlay} className="text-lg mt-2">
          {isPlaying ? "⏸ Pause" : "▶ Play"}
        </button>
        <div className="flex items-center gap-2 mt-2">
          <button onClick={() => seek(currentTime - 5)}>⏪ -5s</button>
          <button onClick={() => seek(currentTime + 5)}>⏩ +5s</button>
        </div>
        <div className="mt-2">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration - currentTime)}</span>
          </div>
        </div>
        <div className="mt-2">
          <label>🔊 Volume:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            onChange={(e) => changeVolume(Number(e.target.value))}
            className="ml-2"
          />
        </div>
      </div>
      <audio ref={audioRef} />
    </div>
  );
}
