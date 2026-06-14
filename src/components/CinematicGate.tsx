"use client";

import { useEffect, useState } from "react";

interface CinematicGateProps {
  onOpen: () => void;
}

export default function CinematicGate({ onOpen }: CinematicGateProps) {
  const [guestName, setGuestName] = useState("Tamu Undangan");
  const [isOpening, setIsOpening] = useState(false);

  // Read guest name from query parameters client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const to = params.get("to") || params.get("nama");
      if (to) {
        setGuestName(to);
      }
    }
  }, []);

  const handleOpen = () => {
    setIsOpening(true);

    // Allow gate sliding animation to finish before notifying parent
    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-40 overflow-hidden select-none [perspective:1200px]">
      {/* LEFT PANEL / GATE DOOR */}
      <div
        className={`fixed left-0 top-0 w-[50vw] h-full bg-white z-40 transition-all duration-[1200ms] cubic-bezier(0.25, 1, 0.5, 1) origin-left ${isOpening ? "[transform:rotateY(-95deg)] opacity-0 pointer-events-none" : "[transform:rotateY(0deg)]"
          }`}
      >
        {/* Left Flower placed on the right edge to meet at the center */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-64 sm:w-48 sm:h-96 md:w-56 md:h-[450px] lg:w-56 lg:h-[450px] xl:w-72 xl:h-[450px]">
          <img
            src="/images/locked/flower-left.png?v=2"
            alt="Left Flower"
            className="w-full h-full object-contain object-right pointer-events-none"
          />
        </div>
      </div>

      {/* RIGHT PANEL / GATE DOOR */}
      <div
        className={`fixed right-0 top-0 w-[50vw] h-full bg-white z-40 transition-all duration-[1200ms] cubic-bezier(0.25, 1, 0.5, 1) origin-right ${isOpening ? "[transform:rotateY(95deg)] opacity-0 pointer-events-none" : "[transform:rotateY(0deg)]"
          }`}
      >
        {/* Right Flower placed on the left edge to meet at the center */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-64 sm:w-48 sm:h-96 md:w-56 md:h-[450px] lg:w-56 lg:h-[450px] xl:w-72 xl:h-[450px]">
          <img
            src="/images/locked/flower-right.png?v=2"
            alt="Right Flower"
            className="w-full h-full object-contain object-left pointer-events-none"
          />
        </div>
      </div>

      {/* CONTENT OVERLAY (Centered) */}
      <div
        className={`fixed inset-0 z-50 flex flex-col justify-between items-center py-10 px-4 sm:py-16 sm:px-6 text-center transition-all duration-700 ${isOpening ? "opacity-0 scale-95 pointer-events-none" : "opacity-100"
          }`}
      >
        {/* Top Section: Names & Date */}
        <div className="space-y-3 sm:space-y-4 mt-6 sm:mt-10 max-w-lg">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-rose-500 font-semibold">
            The Wedding of
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide text-zinc-800">
            Alzah & Effri
          </h1>
          <div className="h-[1px] w-16 sm:w-24 bg-rose-200 mx-auto"></div>
          <p className="text-xs sm:text-sm md:text-base tracking-widest text-zinc-500 font-medium">
            5 Agustus 2026
          </p>
        </div>

        {/* Bottom Section: Invitation details & Button */}
        <div className="space-y-5 sm:space-y-6 max-w-[280px] sm:max-w-sm md:max-w-md w-full mb-8 sm:mb-12 md:mb-16">
          <div className="bg-rose-50/50 backdrop-blur-sm border border-rose-100/60 rounded-2xl p-4 sm:p-6 space-y-2 sm:space-y-3 shadow-sm">
            <p className="text-[10px] sm:text-xs text-zinc-400 font-medium">Kepada Yth. Bapak/Ibu/Saudara/i:</p>
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-rose-800 tracking-wide font-serif">
              {guestName}
            </h3>
            <p className="text-[9px] sm:text-[10px] text-zinc-400 leading-relaxed italic">
              *Mohon maaf apabila ada kesalahan penulisan nama/gelar
            </p>
          </div>

          <button
            onClick={handleOpen}
            className="w-full h-11 sm:h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-medium tracking-wide shadow-lg shadow-rose-200 hover:shadow-xl transition-all duration-300 transform active:scale-95 cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
            </svg>
            Buka Undangan
          </button>
        </div>
      </div>
    </div>
  );
}
