"use client";

import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import CinematicGate from "@/components/CinematicGate";
import InvitationContent from "@/components/InvitationContent";
import ScrollProgress from "@/components/ScrollProgress";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isGateMounted, setIsGateMounted] = useState(true);

  return (
    <>
      {/* Loading Screen */}
      {isLoading && <LoadingScreen onFinished={() => setIsLoading(false)} />}

      {/* Cinematic Gate Screen */}
      {!isLoading && isGateMounted && (
        <CinematicGate onOpen={() => setIsGateMounted(false)} />
      )}

      {/* Scroll Progress Bar (Only visible once the invitation is open) */}
      {!isLoading && !isGateMounted && <ScrollProgress />}

      {/* Main Invitation Page Content (Fades in once loading finishes) */}
      <div
        className={`flex flex-col flex-1 items-center justify-center transition-all duration-1000 ease-out ${
          isLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        <InvitationContent />
      </div>
    </>
  );
}
