"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface LoadingScreenProps {
  onComplete: () => void;
}

const ASSETS_TO_PRELOAD = [
  "/assets/images/corkboard.jpg",
  "/assets/images/img_1.png",
  "/assets/images/img_2.png",
  "/assets/images/img_3.png",
  "/assets/images/img_4.png",
  "/assets/images/img_5.png",
  "/assets/images/img_6.png",
  "/assets/images/mobil.png",
  "/assets/cover/tagname.png",
  "/assets/cover/stiky.png",
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let loadedCount = 0;
    const totalAssets = ASSETS_TO_PRELOAD.length;
    let targetProgress = 15; // start at 15% to show initial load activity

    const incrementProgress = () => {
      loadedCount++;
      // Scale load percentage between 15% and 100%
      const loadedPercent = 15 + (loadedCount / totalAssets) * 85;
      targetProgress = Math.min(loadedPercent, 100);
    };

    // Start preloading images in browser cache
    ASSETS_TO_PRELOAD.forEach((src) => {
      const img = new window.Image();
      img.src = src;
      img.onload = incrementProgress;
      img.onerror = incrementProgress; // resolve to proceed even on fail
    });

    // Smoothly step the progress bar towards targetProgress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        if (prev < targetProgress) {
          const step = (targetProgress - prev) * 0.15;
          return prev + (step < 0.5 ? 0.5 : step);
        }
        return prev;
      });
    }, 30);

    // Fallback timer: force 100% after 6s in case of slow networks
    const fallbackTimer = setTimeout(() => {
      targetProgress = 100;
    }, 6000);

    return () => {
      clearInterval(interval);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Delay transition for visual satisfaction
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
            unoptimized
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
