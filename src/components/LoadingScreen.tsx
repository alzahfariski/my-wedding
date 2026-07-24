"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2400; // 2.4 seconds duration
    const intervalTime = 20; // Update progress every 20ms
    const steps = duration / intervalTime;
    const stepIncrement = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(prev + stepIncrement, 100);
      });
    }, intervalTime);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Delay the onComplete slightly after hitting 100% for a smooth completion experience
  useEffect(() => {
    if (progress >= 100) {
      const delayTimer = setTimeout(() => {
        onComplete();
      }, 400);
      return () => clearTimeout(delayTimer);
    }
  }, [progress, onComplete]);

  const isFinished = progress >= 75;
  const imageSrc = isFinished ? "/assets/loading/finish.png" : "/assets/loading/loading.png";

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-stone-900 select-none">
      <div className="flex flex-col items-center max-w-sm px-6">
        
        {/* Loading Photo Asset */}
        <div 
          key={isFinished ? "finished" : "loading"}
          className={`relative w-40 h-40 sm:w-48 sm:h-48 transition-all duration-500 hover:scale-105 ${isFinished ? "animate-image-pop" : ""}`}
        >
          <Image
            src={imageSrc}
            alt="Loading Invitation"
            fill
            sizes="(max-width: 640px) 160px, 192px"
            className="object-contain"
            priority
          />
        </div>

        {/* Kalam Handwritten Text */}
        <h2 className="text-handwritten-title text-stone-900 mt-6 tracking-wide font-bold">
          sudah siap belum?
        </h2>

        {/* Progress Container */}
        <div className="mt-8 flex flex-col items-center gap-3 w-full">
          {/* Modern Progress Line */}
          <div className="w-48 sm:w-60 h-1.5 rounded-full bg-stone-100 overflow-hidden relative">
            <div
              className="h-full bg-stone-900 rounded-full transition-all duration-75 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Minimalist modern percentage indicator */}
          <span className="text-handwritten-caption text-stone-400 font-medium tracking-widest tabular-nums">
            {Math.floor(progress)}%
          </span>
        </div>

      </div>
    </div>
  );
}
