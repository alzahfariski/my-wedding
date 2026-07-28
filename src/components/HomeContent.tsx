"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Heart,
  Compass,
  Camera,
  Calendar,
  Gift,
  MessageCircle,
  Volume2,
  VolumeX,
  MapPin,
  Music
} from "lucide-react";
import {
  CANVAS_SVG_PATH,
  PATH_VIEWBOX,
  PATH_OFFSET_X,
  PATH_OFFSET_Y,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  SECTION_WAYPOINTS,
  SCROLL_HEIGHT_MULTIPLIER,
  CORKBOARD_IMAGE_PATH,
} from "@/domain/canvasPath";
import LoveStorySection from "./LoveStorySection";
import GroomBrideSection from "./GroomBrideSection";
import GallerySection from "./GallerySection";
import DateTimeSection from "./DateTimeSection";
import WeddingGiftSection from "./WeddingGift";
import WeddingWishSection from "./WeddingWishSection";
import PhotoBoothSection from "./PhotoBoothSection";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Coordinate point on the SVG path (in corkboard-normalized 0→1 space).
 */
interface PathPoint {
  readonly x: number;
  readonly y: number;
}

/**
 * Samples a point at `progress` (0→1) along an SVG <path> element.
 * Returns coordinates normalized to the corkboard (0→1).
 */
function getPointAtProgress(
  pathElement: SVGPathElement,
  progress: number
): PathPoint {
  const totalLength = pathElement.getTotalLength();
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const point = pathElement.getPointAtLength(totalLength * clampedProgress);
  return {
    x: (point.x + PATH_OFFSET_X) / CANVAS_WIDTH,
    y: (point.y + PATH_OFFSET_Y) / CANVAS_HEIGHT,
  };
}

/**
 * HomeContent — Corkboard + Scroll Zoom/Pan
 *
 * Corkboard is 3000x2500. It scales to cover the viewport.
 * On scroll, the camera zooms in and pans along the SVG path.
 */
export default function HomeContent() {
  const scrollSpacerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const odometerRef = useRef<HTMLSpanElement | null>(null);
  const navButtonsRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMusicHovered, setIsMusicHovered] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // Toggle music playback
  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => {
        setIsMusicPlaying(true);
      }).catch(err => {
        console.error("Audio playback failed:", err);
      });
    } else {
      audio.pause();
      setIsMusicPlaying(false);
    }
  }, []);

  const jumpToWaypoint = useCallback((progress: number) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: progress * maxScroll,
      behavior: "smooth",
    });
  }, []);

  const initScrollEngine = useCallback(() => {
    const spacer = scrollSpacerRef.current;
    const canvas = canvasRef.current;
    const pathEl = pathRef.current;

    if (!spacer || !canvas || !pathEl) return;

    // Detect mobile layout dynamically
    const isMobile = window.innerWidth < 768;
    setIsMobileDevice(isMobile);

    // Set scroll spacer height
    spacer.style.height = `${SCROLL_HEIGHT_MULTIPLIER * 100}vh`;

    // Compute base scale to cover viewport (equivalent of "background-size: cover")
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const baseScale = Math.max(vw / CANVAS_WIDTH, vh / CANVAS_HEIGHT);

    // Calculate scale multiplier dynamically based on screen width for responsive zoom
    const getScaleMultiplier = () => {
      const width = window.innerWidth;
      if (width < 480) return 0.55;  // Small Mobile
      if (width < 768) return 0.65;  // Large Mobile
      if (width < 1024) return 0.85; // Tablet
      return 1.0;                    // Desktop
    };
    const scaleMultiplier = getScaleMultiplier();

    // Mobile offset to shift focused polaroid slightly upwards on portrait viewports
    const isPortrait = vh > vw;
    const mobileOffsetY = (isMobile && isPortrait) ? vh * 0.08 : 0;

    const startPoint = getPointAtProgress(pathEl, 0.0);
    const startScale = SECTION_WAYPOINTS[0]?.scale ?? 3.0;
    const targetScale = baseScale * startScale * scaleMultiplier;

    const tx = vw / 2 - startPoint.x * CANVAS_WIDTH * targetScale;
    const ty = (vh / 2 - mobileOffsetY) - startPoint.y * CANVAS_HEIGHT * targetScale;

    // Initial state: start directly zoomed in on session one
    gsap.set(canvas, {
      x: tx,
      y: ty,
      scale: targetScale,
      transformOrigin: "0% 0%",
      force3D: true,
    });

    // Playhead progress object that will be animated by GSAP ScrollTrigger
    const playhead = { progress: 0 };

    // Tween playhead progress smoothly from 0 to 1
    const anim = gsap.to(playhead, {
      progress: 1,
      ease: "none",
      paused: true,
      onUpdate: () => {
        const pathProgress = playhead.progress;
        const point = getPointAtProgress(pathEl, pathProgress);

        // Update odometer digital display directly for 60fps performance
        if (odometerRef.current) {
          odometerRef.current.innerText = `${(pathProgress * 7.0).toFixed(2)} KM`;
        }

        // Find active waypoint and toggle class on nav buttons directly
        let activeIndex = 0;
        for (let i = 0; i < SECTION_WAYPOINTS.length; i++) {
          if (pathProgress >= SECTION_WAYPOINTS[i].progress) {
            activeIndex = i;
          }
        }

        navButtonsRefs.current.forEach((btn, idx) => {
          if (btn) {
            if (idx === activeIndex) {
              btn.classList.add("bg-[#743951]", "text-white");
              btn.classList.remove("text-stone-600", "hover:bg-[#743951]/10", "hover:text-[#743951]");
            } else {
              btn.classList.remove("bg-[#743951]", "text-white");
              btn.classList.add("text-stone-600", "hover:bg-[#743951]/10", "hover:text-[#743951]");
            }
          }
        });

        // Interpolate zoom scale between waypoints based on pathProgress
        let currentScale = SECTION_WAYPOINTS[0]?.scale ?? 3.0;
        for (let i = 0; i < SECTION_WAYPOINTS.length - 1; i++) {
          const a = SECTION_WAYPOINTS[i];
          const b = SECTION_WAYPOINTS[i + 1];
          if (pathProgress >= a.progress && pathProgress <= b.progress) {
            const textScale =
              (pathProgress - a.progress) / (b.progress - a.progress);
            currentScale =
              (a.scale ?? 3.0) +
              ((b.scale ?? 3.0) - (a.scale ?? 3.0)) * textScale;
            break;
          }
        }

        const lastWp = SECTION_WAYPOINTS[SECTION_WAYPOINTS.length - 1];
        if (pathProgress > (lastWp?.progress ?? 1.0)) {
          currentScale = lastWp?.scale ?? 3.0;
        }

        const totalScale = baseScale * currentScale * scaleMultiplier;

        // Position corkboard so the target point is centered (or offset upward) in viewport
        const tx = vw / 2 - point.x * CANVAS_WIDTH * totalScale;
        const ty = (vh / 2 - mobileOffsetY) - point.y * CANVAS_HEIGHT * totalScale;

        // Instant update since GSAP's scrub handles the smooth interpolation beautifully
        gsap.set(canvas, {
          x: tx,
          y: ty,
          scale: totalScale,
          transformOrigin: "0% 0%",
          force3D: true,
        });
      },
    });

    // ScrollTrigger — scrub the animation timeline
    // scrub is set to 0.5 on mobile (vs 1.0 on desktop) for swift touchscreen tracking
    const trigger = ScrollTrigger.create({
      trigger: spacer,
      start: "top top",
      end: "bottom bottom",
      scrub: isMobile ? 0.5 : 1.0,
      animation: anim,
    });

    // Auto Scroll state variables
    let autoScrollActive = false;
    let userInteractionTimeout: NodeJS.Timeout | null = null;
    let lastTime = performance.now();
    let animationFrameId: number;

    const pixelsPerSecond = 20; // Cinematic slow speed (pixels per second)

    const autoScrollLoop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1); // clamp delta time to avoid jumps on tab switch
      lastTime = time;

      if (autoScrollActive && !(window as any).isModalOpen) {
        const currentScroll = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

        if (currentScroll >= maxScroll - 5) {
          autoScrollActive = false; // Stop auto-scroll at the bottom
        } else {
          window.scrollTo(0, currentScroll + pixelsPerSecond * dt);
        }
      }

      animationFrameId = requestAnimationFrame(autoScrollLoop);
    };

    // Start requestAnimationFrame loop immediately
    animationFrameId = requestAnimationFrame(autoScrollLoop);

    // Pause auto-scroll when user manually scrolls or interacts
    const stopAutoScroll = () => {
      autoScrollActive = false;
      if (userInteractionTimeout) clearTimeout(userInteractionTimeout);

      if ((window as any).isModalOpen) return;

      userInteractionTimeout = setTimeout(() => {
        // Resume auto-scroll if the page is not scrolled to the very bottom
        const currentScroll = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (currentScroll < maxScroll - 10 && !(window as any).isModalOpen) {
          autoScrollActive = true;
        }
      }, 2500); // Resume auto-scroll after 2.5 seconds of inactivity
    };

    const handlePauseAutoScroll = () => {
      autoScrollActive = false;
      if (userInteractionTimeout) clearTimeout(userInteractionTimeout);
    };

    const handleResumeAutoScroll = () => {
      if (userInteractionTimeout) clearTimeout(userInteractionTimeout);
      if (!(window as any).isModalOpen) {
        userInteractionTimeout = setTimeout(() => {
          const currentScroll = window.scrollY;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          if (currentScroll < maxScroll - 10 && !(window as any).isModalOpen) {
            autoScrollActive = true;
          }
        }, 2500);
      }
    };

    const handleScrollReady = () => {
      // Force ScrollTrigger to refresh calculations after parent wrapper transforms are removed and overflow is unlocked
      ScrollTrigger.refresh();
      // Resynchronize animation to trigger progress
      playhead.progress = trigger.progress;
      anim.progress(trigger.progress);

      // Start auto scroll now that the scroll is unlocked and layout is stable
      if (!(window as any).isModalOpen) {
        autoScrollActive = true;
      }

      // Start music automatically on user entry gesture
      const audio = audioRef.current;
      if (audio) {
        audio.play().then(() => {
          setIsMusicPlaying(true);
        }).catch(err => {
          console.log("Audio play blocked by browser. Awaiting user interaction.", err);
        });
      }
    };

    const handleOpenBoardClicked = () => {
      const audio = audioRef.current;
      if (audio && audio.paused) {
        audio.play().then(() => {
          setIsMusicPlaying(true);
        }).catch(err => {
          console.log("Audio play failed on gesture event:", err);
        });
      }
    };

    window.addEventListener("open-board-clicked", handleOpenBoardClicked);
    window.addEventListener("scroll-ready", handleScrollReady);
    window.addEventListener("pause-auto-scroll", handlePauseAutoScroll);
    window.addEventListener("resume-auto-scroll", handleResumeAutoScroll);
    window.addEventListener("wheel", stopAutoScroll, { passive: true });
    window.addEventListener("touchmove", stopAutoScroll, { passive: true });
    window.addEventListener("keydown", stopAutoScroll, { passive: true });
    window.addEventListener("mousedown", stopAutoScroll, { passive: true });

    return () => {
      trigger.kill();
      anim.kill();
      cancelAnimationFrame(animationFrameId);
      if (userInteractionTimeout) clearTimeout(userInteractionTimeout);
      window.removeEventListener("open-board-clicked", handleOpenBoardClicked);
      window.removeEventListener("scroll-ready", handleScrollReady);
      window.removeEventListener("pause-auto-scroll", handlePauseAutoScroll);
      window.removeEventListener("resume-auto-scroll", handleResumeAutoScroll);
      window.removeEventListener("wheel", stopAutoScroll);
      window.removeEventListener("touchmove", stopAutoScroll);
      window.removeEventListener("keydown", stopAutoScroll);
      window.removeEventListener("mousedown", stopAutoScroll);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      initScrollEngine();
    }, 100);
    return () => clearTimeout(timer);
  }, [initScrollEngine]);

  useEffect(() => {
    const handleResize = () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      initScrollEngine();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initScrollEngine]);



  return (
    <>
      {/* ── Viewport (Camera) ───────────────────────────── */}
      <div className="canvas-viewport">
        <div
          className="canvas-scale-wrapper"
          style={{
            transform: "scale(1.0)",
            transformOrigin: "center center",
          }}
        >
          <div
            ref={canvasRef}
            className="canvas-board"
            style={{
              backgroundColor: "var(--canvas-bg)",
            }}
          >
            {/* section 1 - love story */}
            <LoveStorySection />

            {/* section 2 - the groom & bride */}
            {/* <GroomBrideSection /> */}

            {/* section 3 - gallery */}
            {/* <GallerySection /> */}

            {/* section 4 - date time */}
            {/* <DateTimeSection /> */}

            {/* section 5 - wedding gift */}
            {/* <WeddingGiftSection /> */}

            {/* section 6 - Wedding Wish */}
            {/* <WeddingWishSection /> */}

            {/* section 7 - Photo Booth */}
            {/* <PhotoBoothSection /> */}
          </div>
        </div>
      </div>



      {/* ── Fixed HUD UI Controls Layer ──────────────────── */}
      <div className="fixed inset-0 z-50 pointer-events-none flex flex-col justify-between p-3 sm:p-6 text-stone-800">
        {/* Top HUD Row */}
        <div className="w-full flex items-start justify-between">
          {/* Header Card */}
          <div className="pointer-events-auto bg-white/70 backdrop-blur-md border border-stone-200/40 p-2 px-3 sm:p-3 sm:px-4 rounded-2xl shadow-md flex flex-col select-none max-w-[65vw]">
            <h1 className="font-alex text-xl sm:text-2xl font-bold text-[#743951] leading-none">
              Alzha & Effri
            </h1>
            <p className="text-[9px] sm:text-[11px] font-kalam text-stone-500 mt-1 uppercase tracking-wider">
              Wedding Memory Board
            </p>
          </div>

          {/* Odometer KM Card */}
          <div className="pointer-events-auto bg-white/70 backdrop-blur-md border border-stone-200/40 p-2 px-3 sm:p-3 sm:px-4 rounded-2xl shadow-md flex flex-col items-end select-none">
            <span className="text-[8px] sm:text-[9px] font-sans font-semibold tracking-wider text-stone-500 uppercase">
              Distance Traveled
            </span>
            <span
              ref={odometerRef}
              className="font-mono text-xs sm:text-sm font-bold text-[#743951] mt-0.5"
            >
              0.00 KM
            </span>
          </div>
        </div>

        {/* Bottom HUD Row */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Quick Navigation Panel */}
          <div className="order-2 md:order-1 pointer-events-auto w-full md:w-auto flex justify-center">
            <div className="flex items-center gap-1 p-1 bg-white/70 backdrop-blur-md border border-stone-200/40 rounded-full shadow-md overflow-x-auto max-w-[95vw] scrollbar-hide">
              {SECTION_WAYPOINTS.map((wp, index) => {
                const getIcon = (idx: number) => {
                  switch (idx) {
                    case 0:
                      return <Heart className="w-3.5 h-3.5" />;
                    case 1:
                      return <Compass className="w-3.5 h-3.5" />;
                    case 2:
                      return <Camera className="w-3.5 h-3.5" />;
                    case 3:
                      return <Calendar className="w-3.5 h-3.5" />;
                    case 4:
                      return <Gift className="w-3.5 h-3.5" />;
                    case 5:
                      return <MessageCircle className="w-3.5 h-3.5" />;
                    case 6:
                      return <MapPin className="w-3.5 h-3.5" />;
                    default:
                      return <MapPin className="w-3.5 h-3.5" />;
                  }
                };

                return (
                  <button
                    key={wp.id}
                    ref={(el) => {
                      navButtonsRefs.current[index] = el;
                    }}
                    onClick={() => jumpToWaypoint(wp.progress)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-stone-600 hover:bg-[#743951]/10 hover:text-[#743951] active:scale-95 transition-all text-[11px] cursor-pointer select-none font-kalam font-medium whitespace-nowrap"
                    title={wp.label}
                  >
                    {getIcon(index)}
                    <span className="hidden sm:inline">{wp.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Music Controller Button (Dynamic Island Theme) */}
          <div className="order-1 md:order-2 pointer-events-auto self-end md:self-auto flex items-center justify-end">
            <div
              onMouseEnter={() => setIsMusicHovered(true)}
              onMouseLeave={() => setIsMusicHovered(false)}
              onClick={toggleMusic}
              className={`flex items-center bg-white/70 backdrop-blur-md border border-stone-200/40 shadow-md rounded-full transition-all duration-500 ease-out cursor-pointer select-none overflow-hidden h-11 sm:h-12 ${isMusicPlaying || isMusicHovered
                ? "w-[200px] sm:w-[220px] px-3 gap-2.5"
                : "w-11 sm:w-12 justify-center animate-pulse"
                }`}
              aria-label="Toggle background music"
            >
              {isMusicPlaying || isMusicHovered ? (
                <>
                  {/* Spinning Vinyl Record Disk */}
                  <div className={`relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-950 text-white shrink-0 shadow ${isMusicPlaying ? 'animate-[spinRecord_4s_linear_infinite]' : ''}`}>
                    <div className="w-2.5 h-2.5 rounded-full bg-white flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-stone-950" />
                    </div>
                  </div>

                  {/* Song Metadata */}
                  <div className="flex flex-col flex-1 min-w-0 text-left">
                    <span className="text-[11px] sm:text-xs font-bold text-[#743951] truncate leading-tight">
                      1000x
                    </span>
                    <span className="text-[8px] sm:text-[9px] font-kalam text-stone-500 truncate leading-none mt-0.5">
                      Ghea Indrawari
                    </span>
                  </div>

                  {/* Bouncing audio wave bars */}
                  <div className="flex items-end gap-0.5 h-4 sm:h-5 shrink-0 pr-1 select-none">
                    <div className={`w-0.5 bg-[#743951] rounded-full transform origin-bottom transition-all duration-300 ${isMusicPlaying ? 'h-3 animate-[bounceBar_0.8s_ease-in-out_infinite]' : 'h-1'}`} />
                    <div className={`w-0.5 bg-[#743951] rounded-full transform origin-bottom transition-all duration-300 ${isMusicPlaying ? 'h-4 animate-[bounceBar_0.8s_ease-in-out_infinite_0.15s]' : 'h-1.5'}`} />
                    <div className={`w-0.5 bg-[#743951] rounded-full transform origin-bottom transition-all duration-300 ${isMusicPlaying ? 'h-2.5 animate-[bounceBar_0.8s_ease-in-out_infinite_0.3s]' : 'h-1'}`} />
                  </div>
                </>
              ) : (
                <Music className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#743951]" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Background Music audio element ───────────────── */}
      <audio
        ref={audioRef}
        src="/assets/audio/background-music.mp3"
        loop
        preload="auto"
      />

      {/* ── Hidden SVG for path calculations ─────────────── */}
      <svg
        className="absolute opacity-0 pointer-events-none w-full h-full"
        viewBox={PATH_VIEWBOX}
        aria-hidden="true"
      >
        <path ref={pathRef} d={CANVAS_SVG_PATH} />
      </svg>

      {/* ── Scroll Spacer ────────────────────────────────── */}
      <div ref={scrollSpacerRef} className="canvas-scroll-spacer" />
    </>
  );
}
