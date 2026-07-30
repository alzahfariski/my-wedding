'use client';

import React, { useRef, useEffect } from 'react';

interface MusicPlayerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  isPlaying,
  onTogglePlay,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioUrl = "/assets/audio/bg-music.mp3";

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.warn("Audio autoplay blocked:", err);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div className="music-outer fixed bottom-6 left-6 z-40">
      <audio ref={audioRef} src={audioUrl} loop preload="auto" />
      <button
        type="button"
        onClick={onTogglePlay}
        className={`w-12 h-12 rounded-full bg-amber-900 text-white shadow-xl border-2 border-amber-200 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${isPlaying ? 'animate-spin' : ''
          }`}
        style={{ animationDuration: '4s' }}
        title={isPlaying ? "Mute Music" : "Play Music"}
      >
        <i className={`fas ${isPlaying ? 'fa-compact-disc' : 'fa-play'}`}></i>
      </button>
    </div>
  );
};
