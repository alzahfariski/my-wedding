"use client";

import { useEffect, useRef, useState } from "react";

interface CinematicGateProps {
  onOpen: () => void;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  angle: number;
  spin: number;
  opacity: number;
  color: string;
}

export default function CinematicGate({ onOpen }: CinematicGateProps) {
  const [guestName, setGuestName] = useState("Tamu Undangan");
  const [isOpening, setIsOpening] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

  // Canvas falling flower petals animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const petalColors = [
      "rgba(255, 182, 193, 0.7)", // Light pink
      "rgba(255, 192, 203, 0.6)", // Pink
      "rgba(255, 240, 245, 0.8)", // Lavender blush
      "rgba(255, 105, 180, 0.4)", // Hot pink (diluted)
      "rgba(244, 143, 177, 0.6)", // Rose pink
    ];

    const petals: Petal[] = [];
    const maxPetals = 45; // Subtle, elegant amount

    // Create initial petals
    for (let i = 0; i < maxPetals; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        size: Math.random() * 6 + 4, // Small petals
        speedX: Math.random() * 1.5 - 0.5,
        speedY: Math.random() * 1.2 + 0.8,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.02,
        opacity: Math.random() * 0.6 + 0.4,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
      });
    }

    const drawPetal = (ctx: CanvasRenderingContext2D, petal: Petal) => {
      ctx.save();
      ctx.translate(petal.x, petal.y);
      ctx.rotate(petal.angle);
      ctx.beginPath();

      // Draw organic leaf/petal shape
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(petal.size / 2, -petal.size / 2, petal.size, -petal.size / 4, petal.size, 0);
      ctx.bezierCurveTo(petal.size, petal.size / 4, petal.size / 2, petal.size / 2, 0, 0);

      ctx.fillStyle = petal.color;
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      petals.forEach((p) => {
        // Fall down
        p.y += p.speedY;
        // Sway sideways gently
        p.x += p.speedX + Math.sin(p.y / 30) * 0.3;
        // Spin
        p.angle += p.spin;

        // Reset petal if it goes off screen
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
          p.speedY = Math.random() * 1.2 + 0.8;
          p.speedX = Math.random() * 1.5 - 0.5;
        }
        if (p.x > width + 20) {
          p.x = -20;
        } else if (p.x < -20) {
          p.x = width + 20;
        }

        drawPetal(ctx, p);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleOpen = () => {
    setIsOpening(true);

    // Wait for the slide-up transition to finish before notifying parent
    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  return (
    <div
      className={`fixed inset-0 z-40 overflow-hidden select-none bg-stone-50 flex flex-col justify-between items-center transition-transform duration-[1200ms] cubic-bezier(0.77, 0, 0.175, 1) ${isOpening ? "-translate-y-full" : "translate-y-0"
        }`}
    >
      {/* Background Soft Glows */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at center, rgba(244, 63, 94, 0.08) 0%, transparent 70%)" }}
      />

      {/* Falling Petals Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

      {/* TOP LEFT FLOWER */}
      <div className="absolute top-0 left-0 w-38 pointer-events-none z-20 animate-flower-left origin-top-left">
        <img
          src="/images/locked/left-flower.png"
          alt="Top Left Ornament"
          className="w-full h-auto object-contain"
        />
      </div>

      {/* TOP RIGHT FLOWER */}
      <div className="absolute top-0 right-0 w-38 pointer-events-none z-20 animate-flower-right origin-top-right">
        <img
          src="/images/locked/right-flower.png"
          alt="Top Right Ornament"
          className="w-full h-auto object-contain"
        />
      </div>

      {/* CENTERED CONTENT OVERLAY */}
      <div className="relative z-30 flex flex-col justify-end items-center min-h-screen w-full px-6 text-center pb-12 sm:pb-12">

        {/* OPENING ORNAMENT (At the top of centered content) */}
        <div className="w-52 sm:w-64 mb-4 sm:mb-6 pointer-events-none animate-slide-up-fade origin-bottom">
          <img
            src="/images/locked/opening.png"
            alt="Opening Ornament"
            className="w-full h-auto object-contain mx-auto"
          />
        </div>

        {/* Wedding Invitation Info */}
        <div className="space-y-3 sm:space-y-6 max-w-lg mb-6 sm:mb-12 animate-fade-in-scale">
          <p className="text-[9px] sm:text-xs uppercase tracking-[0.3em] text-rose-600 font-semibold bg-rose-50/80 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-rose-100/50 inline-block shadow-sm">
            Wedding Invitation
          </p>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-wide text-zinc-800 drop-shadow-sm leading-tight">
            Alzah & Effri
          </h1>

          <p className="text-xs sm:text-base md:text-lg font-serif text-rose-800 font-semibold">
            05 Agustus 2026
          </p>
        </div>

        {/* Guest info & Open Button */}
        <div className="space-y-4 sm:space-y-8 max-w-[280px] sm:max-w-sm w-full animate-slide-up-fade" style={{ animationDelay: "300ms", animationFillMode: "both" }}>

          <div className="bg-white/80 backdrop-blur-md border border-rose-100/80 rounded-2xl p-4 sm:p-6 space-y-2 sm:space-y-3 shadow-md shadow-rose-100/30">
            <p className="text-[9px] sm:text-xs text-zinc-400 font-medium uppercase tracking-wider">Kepada Yth. Bapak/Ibu/Saudara/i:</p>

            <h3 className="text-lg sm:text-2xl font-bold text-rose-900 tracking-wide font-serif">
              {guestName}
            </h3>

            <p className="text-[8px] sm:text-[10px] text-zinc-400 leading-relaxed italic border-t border-rose-50/80 pt-1.5 mt-1.5">
              *Mohon maaf apabila ada kesalahan penulisan nama/gelar
            </p>
          </div>

          <button
            onClick={handleOpen}
            className="group relative w-full h-12 sm:h-13 bg-white/90 hover:bg-rose-50/90 text-rose-700 border border-rose-200 rounded-full font-medium tracking-[0.2em] shadow-md shadow-rose-100/40 hover:shadow-lg hover:shadow-rose-100/60 transition-all duration-300 transform active:scale-98 cursor-pointer flex items-center justify-center gap-2.5 text-xs sm:text-sm uppercase"
          >
            {/* Hover overlay glow */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-100/30 to-rose-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* SVG Envelope Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>

            <span className="relative z-10">Buka Undangan</span>
          </button>
        </div>

      </div>


    </div>
  );
}
