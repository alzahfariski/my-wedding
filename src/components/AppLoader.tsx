"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "./LoadingScreen";

interface AppLoaderProps {
  children: React.ReactNode;
}

export default function AppLoader({ children }: { children: AppLoaderProps["children"] }) {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<"loading" | "fading" | "ready">("loading");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Backup timer to guarantee the loading screen unmounts even if transition events are missed
  useEffect(() => {
    if (status === "fading") {
      const timer = setTimeout(() => {
        setStatus("ready");
      }, 1500); // match the longer 1400ms 3D transition duration
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (!mounted) {
    // Render blank background on SSR to avoid mismatching layout hydrations
    return <div className="min-h-screen bg-white" />;
  }

  if (status === "ready") {
    return <>{children}</>;
  }

  const isFading = status === "fading";

  return (
    <div className="relative w-full min-h-screen overflow-hidden perspective-1200 transform-style-3d bg-white dark:bg-stone-950">
      {/* Main page content container */}
      <div
        className="w-full min-h-screen transition-all duration-[1400ms] cubic-bezier(0.25, 1, 0.5, 1)"
        style={{
          transform: isFading
            ? "translate3d(0, 0, 0px) scale(1)"
            : "translate3d(0, 0, -300px) scale(0.85)",
          opacity: isFading ? 1 : 0,
        }}
      >
        {children}
      </div>

      {/* Loading Overlay wrapper */}
      <div
        className="fixed inset-0 z-50 w-full min-h-screen transition-all duration-[1200ms] cubic-bezier(0.4, 0, 0.2, 1)"
        style={{
          transform: isFading
            ? "translate3d(0, 0, 600px) scale(1.4)"
            : "translate3d(0, 0, 0px) scale(1)",
          opacity: isFading ? 0 : 1,
          pointerEvents: isFading ? "none" : "auto",
        }}
        onTransitionEnd={() => {
          if (status === "fading") {
            setStatus("ready");
          }
        }}
      >
        <LoadingScreen onComplete={() => setStatus("fading")} />
      </div>
    </div>
  );
}
