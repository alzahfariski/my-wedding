"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface LoadingScreenProps {
  onFinished: () => void;
}

interface Particle {
  id: number;
  left: number;
  scale: number;
  delay: number;
}

export default function LoadingScreen({ onFinished }: LoadingScreenProps) {
  const [targetProgress, setTargetProgress] = useState(0);
  const [visualProgress, setVisualProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Linear target progress update over 2000ms
  useEffect(() => {
    const duration = 2000;
    const intervalTime = 30;
    const totalSteps = duration / intervalTime;
    const increment = 100 / totalSteps;

    const timer = setInterval(() => {
      setTargetProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Lerp progress to make it butter smooth like AAA games
  useEffect(() => {
    let animationFrameId: number;

    const updateProgress = () => {
      setVisualProgress((prev) => {
        const diff = targetProgress - prev;
        if (diff < 0.1) {
          return targetProgress;
        }
        // Smoothly interpolate towards the target progress
        return prev + diff * 0.08;
      });
      animationFrameId = requestAnimationFrame(updateProgress);
    };

    animationFrameId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetProgress]);

  // Handle completion state when progress reaches 100%
  useEffect(() => {
    if (visualProgress >= 99.9 && targetProgress === 100 && !isCompleted) {
      setIsCompleted(true);
    }
  }, [visualProgress, targetProgress, isCompleted]);

  // Spawn floating heart particles during loading
  useEffect(() => {
    if (visualProgress > 0 && visualProgress < 100) {
      if (Math.random() < 0.25) {
        const newParticle: Particle = {
          id: Math.random(),
          left: Math.random() * 80 + 10,
          scale: Math.random() * 0.6 + 0.4,
          delay: Math.random() * 0.2,
        };
        setParticles((prev) => [...prev.slice(-15), newParticle]);
      }
    }
  }, [visualProgress]);

  // Handle completion fade transitions
  useEffect(() => {
    if (isCompleted) {
      const fadeTimeout = setTimeout(() => {
        setIsFadingOut(true);
      }, 1200); // Give user time to see the transition

      const finishTimeout = setTimeout(() => {
        onFinished();
      }, 1700);

      return () => {
        clearTimeout(fadeTimeout);
        clearTimeout(finishTimeout);
      };
    }
  }, [isCompleted, onFinished]);

  // Calculate progress for each of the 5 hearts (each represents 20% of total)
  const getHeartProgress = (index: number) => {
    const start = index * 20;
    const end = (index + 1) * 20;
    if (visualProgress <= start) return 0;
    if (visualProgress >= end) return 100;
    return ((visualProgress - start) / 20) * 100;
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white backdrop-blur-md transition-opacity duration-700 ease-in-out dark:bg-white ${isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
    >
      <div className="flex flex-col items-center gap-6 max-w-sm px-6 text-center">

        {/* TOP IMAGE: MEN */}
        <div
          className={`relative w-36 h-36 overflow-hidden bg-white transition-all duration-700 ${isCompleted ? "animate-scale-pop" : "scale-100"
            }`}
        >
          {/* Pra state */}
          <div
            className={`absolute inset-0 transition-all duration-500 ease-out ${isCompleted ? "opacity-0 scale-90 rotate-2" : "opacity-100 scale-100 rotate-0"
              }`}
          >
            <Image
              src="/images/loading/pra-men.png"
              alt="Loading Men..."
              fill
              priority
              sizes="144px"
              className="object-cover"
            />
          </div>

          {/* Yey state */}
          <div
            className={`absolute inset-0 transition-all duration-700 ease-out ${isCompleted ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-110 -rotate-2"
              }`}
          >
            <Image
              src="/images/loading/done-men.png"
              alt="Welcome!"
              fill
              sizes="144px"
              className="object-cover"
            />
          </div>
        </div>

        {/* MIDDLE SECTION: HP BAR & PARTICLES */}
        <div className="flex flex-col items-center relative w-full py-2">
          {/* Glowing Animated Hearts Row */}
          <div className="flex items-center gap-3 justify-center">
            {[0, 1, 2, 3, 4].map((index) => {
              const heartProgress = getHeartProgress(index);
              const isHeartFull = heartProgress === 100;

              return (
                <div
                  key={index}
                  className={`relative transition-all duration-300 ${isHeartFull
                    ? "animate-scale-pop drop-shadow-[0_0_10px_rgba(244,63,94,0.6)]"
                    : "drop-shadow-[0_0_4px_rgba(244,63,94,0.1)]"
                    }`}
                >
                  <svg viewBox="0 0 100 100" className="w-8 h-8 relative select-none">
                    <defs>
                      <clipPath id={`heart-clip-${index}`}>
                        <path d="M 50 90 C 50 90 20 60 20 35 C 20 20 35 10 50 25 C 65 10 80 20 80 35 C 80 60 50 90 50 90 Z" />
                      </clipPath>
                    </defs>

                    {/* Outline / empty state */}
                    <path
                      d="M 50 90 C 50 90 20 60 20 35 C 20 20 35 10 50 25 C 65 10 80 20 80 35 C 80 60 50 90 50 90 Z"
                      fill="none"
                      className="stroke-rose-300 dark:stroke-rose-400"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />

                    {/* Masked filled area */}
                    <g clipPath={`url(#heart-clip-${index})`}>
                      <rect
                        x="0"
                        y="0"
                        width="100"
                        height="100"
                        className="fill-rose-50/20"
                      />

                      {/* Wave container that moves up organically */}
                      <g
                        className="transition-transform duration-300 ease-out"
                        style={{ transform: `translateY(${100 - heartProgress}px)` }}
                      >
                        {/* Wave 1 */}
                        <path
                          d="M 0 0 C 25 -8, 75 8, 100 0 C 125 -8, 175 8, 200 0 L 200 100 L 0 100 Z"
                          className="fill-rose-300 opacity-60 animate-wave-1"
                        />
                        {/* Wave 2 */}
                        <path
                          d="M 0 0 C 25 8, 75 -8, 100 0 C 125 8, 175 -8, 200 0 L 200 100 L 0 100 Z"
                          className="fill-rose-500 opacity-95 animate-wave-2"
                        />
                      </g>
                    </g>
                  </svg>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM IMAGE: WOMEN */}
        <div
          className={`relative w-36 h-36 overflow-hidden bg-white transition-all duration-700 ${isCompleted ? "animate-scale-pop" : "scale-100"
            }`}
        >
          {/* Pra state */}
          <div
            className={`absolute inset-0 transition-all duration-500 ease-out ${isCompleted ? "opacity-0 scale-90 rotate-2" : "opacity-100 scale-100 rotate-0"
              }`}
          >
            <Image
              src="/images/loading/pra-women.png"
              alt="Loading Women..."
              fill
              priority
              sizes="144px"
              className="object-cover"
            />
          </div>

          {/* Yey state */}
          <div
            className={`absolute inset-0 transition-all duration-700 ease-out ${isCompleted ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-110 -rotate-2"
              }`}
          >
            <Image
              src="/images/loading/done-women.png"
              alt="Welcome!"
              fill
              sizes="144px"
              className="object-cover"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
