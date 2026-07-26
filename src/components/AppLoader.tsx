"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "./LoadingScreen";
import CoverPage from "./CoverPage";

interface AppLoaderProps {
  children: React.ReactNode;
  guestName: string;
}

type LoaderStatus = "loading" | "fading-to-cover" | "cover" | "fading-to-content" | "ready";

export default function AppLoader({ children, guestName }: AppLoaderProps) {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<LoaderStatus>("loading");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle automatic state transitions from fading states to static states
  useEffect(() => {
    if (status === "fading-to-cover") {
      const timer = setTimeout(() => {
        setStatus("cover");
      }, 1300); // matches the 1200ms transition duration
      return () => clearTimeout(timer);
    }
    if (status === "fading-to-content") {
      const openBoardTimer = setTimeout(() => {
        window.dispatchEvent(new CustomEvent("open-board"));
      }, 1300);

      const readyTimer = setTimeout(() => {
        setStatus("ready");
      }, 4900); // 1300ms cover transition + 800ms hold + 2800ms zoom

      return () => {
        clearTimeout(openBoardTimer);
        clearTimeout(readyTimer);
      };
    }
  }, [status]);

  if (!mounted) {
    // Render blank background on SSR to avoid mismatching layout hydrations
    return <div className="min-h-screen bg-white" />;
  }

  const isFadingToCover = status === "fading-to-cover";
  const isCover = status === "cover";
  const isFadingToContent = status === "fading-to-content";
  const isReady = status === "ready";

  return (
    <div
      className={
        isReady
          ? "w-full min-h-screen bg-white dark:bg-stone-950"
          : "relative w-full h-dvh min-h-dvh overflow-hidden perspective-1200 transform-style-3d bg-white dark:bg-stone-950"
      }
    >
      
      {/* 1. Main Home Content Layer */}
      {(isCover || isFadingToContent || isReady) && (
        <div
          className={
            isReady
              ? "w-full min-h-screen"
              : "w-full min-h-screen transition-all duration-[1200ms] cubic-bezier(0.25, 1, 0.5, 1)"
          }
          style={
            isReady
              ? undefined
              : {
                  transform: isFadingToContent
                    ? "translate3d(0, 0, 0px) scale(1)"
                    : "translate3d(0, 0, -300px) scale(0.85)",
                  opacity: isFadingToContent ? 1 : 0,
                }
          }
        >
          {children}
        </div>
      )}

      {/* 2. Cover Page Layer */}
      {!isReady && (status === "loading" || isFadingToCover || isCover || isFadingToContent) && (
        <div
          className="absolute inset-0 z-40 w-full h-full transition-all duration-[1200ms] cubic-bezier(0.76, 0, 0.24, 1)"
          style={{
            transform: isFadingToContent
              ? "translate3d(0, -100%, 0) scale(0.95)"
              : isFadingToCover || isCover
              ? "translate3d(0, 0, 0px) scale(1)"
              : "translate3d(0, 0, -300px) scale(0.85)",
            opacity: isFadingToContent
              ? 0
              : isFadingToCover || isCover
              ? 1
              : 0,
            pointerEvents: isCover ? "auto" : "none",
          }}
        >
          <CoverPage 
            guestName={guestName} 
            onOpen={() => setStatus("fading-to-content")} 
          />
        </div>
      )}

      {/* 3. Loading Screen Overlay Layer */}
      {(status === "loading" || isFadingToCover) && (
        <div
          className="fixed inset-0 z-50 w-full h-full transition-all duration-[1200ms] cubic-bezier(0.4, 0, 0.2, 1)"
          style={{
            transform: isFadingToCover
              ? "translate3d(0, 0, 600px) scale(1.4)"
              : "translate3d(0, 0, 0px) scale(1)",
            opacity: isFadingToCover ? 0 : 1,
            pointerEvents: isFadingToCover ? "none" : "auto",
          }}
          onTransitionEnd={() => {
            if (status === "fading-to-cover") {
              setStatus("cover");
            }
          }}
        >
          <LoadingScreen onComplete={() => setStatus("fading-to-cover")} />
        </div>
      )}

    </div>
  );
}
