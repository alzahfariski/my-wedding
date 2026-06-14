"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function ScrollProgress() {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [visualScroll, setVisualScroll] = useState(0);

  // Read scroll state
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setScrollPercent(0);
        return;
      }
      const percent = (scrollTop / docHeight) * 100;
      setScrollPercent(Math.min(100, Math.max(0, percent)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth visual progress using LERP
  useEffect(() => {
    let animFrame: number;
    const update = () => {
      setVisualScroll((prev) => {
        const diff = scrollPercent - prev;
        if (Math.abs(diff) < 0.05) return scrollPercent;
        return prev + diff * 0.12; // Easing speed
      });
      animFrame = requestAnimationFrame(update);
    };
    animFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animFrame);
  }, [scrollPercent]);

  const isCompleted = visualScroll >= 90;

  return (
    <div className="fixed bottom-8 left-6 right-6 z-30 max-w-sm mx-auto pointer-events-none select-none">
      <div className="relative w-full h-[4px] bg-rose-100/40 rounded-full">

        {/* Active Fill line */}
        <div
          className="h-full bg-rose-400 rounded-full transition-all duration-75"
          style={{ width: `${visualScroll}%` }}
        ></div>

        {/* 1. Men Icon (A) - Moves from left to right */}
        <div
          className={`absolute -top-12 w-16 h-16 select-none pointer-events-none transition-opacity duration-300 ${isCompleted ? "opacity-0 scale-90" : "opacity-100 scale-100"
            }`}
          style={{
            left: `calc(${visualScroll}% - 28px)`,
          }}
        >
          <Image
            src="/images/progress/progress-men.png"
            alt="Men"
            fill
            sizes="56px"
            className="object-contain"
          />
        </div>

        {/* 2. Women Icon (B) - Fixed at the right end */}
        <div
          className={`absolute -top-12 right-0 w-16 h-16 select-none pointer-events-none transition-all duration-300 ${isCompleted ? "opacity-0 scale-90" : "opacity-100 scale-100"
            }`}
        >
          <Image
            src="/images/progress/progress-women.png"
            alt="Women"
            fill
            sizes="56px"
            className="object-contain"
          />
        </div>

        {/* 3. Completed Icon - Fades in at the right end when they meet */}
        <div
          className={`absolute -top-12 right-0 w-16 h-16 select-none pointer-events-none transition-all duration-500 transform ${isCompleted ? "opacity-100 scale-110" : "opacity-0 scale-75 pointer-events-none"
            }`}
        >
          <Image
            src="/images/progress/progress-complate.png"
            alt="Completed!"
            fill
            sizes="56px"
            className="object-contain"
          />
        </div>

      </div>
    </div>
  );
}
