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
 * HomeContent — Corkboard + Scroll Zoom/Pan (Desktop) & Normal Vertical Scroll (Mobile)
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

  const jumpToWaypoint = useCallback((progress: number, sectionId?: string) => {
    if (window.innerWidth < 768 && sectionId) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: progress * maxScroll,
      behavior: "smooth",
    });
  }, []);

  // Update mobile detection state on mount and resize
  useEffect(() => {
    const handleCheckMobile = () => {
      setIsMobileDevice(window.innerWidth < 768);
    };
    handleCheckMobile();
    window.addEventListener("resize", handleCheckMobile);
    return () => window.removeEventListener("resize", handleCheckMobile);
  }, []);

  // Mobile IntersectionObserver for scroll-to-highlight navigation buttons
  useEffect(() => {
    if (!isMobileDevice) return;

    const sectionIds = ["section-1", "section-2", "section-3", "section-4", "section-5", "section-6", "section-7"];
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sectionIds.indexOf(entry.target.id);
          if (index !== -1) {
            navButtonsRefs.current.forEach((btn, idx) => {
              if (btn) {
                if (idx === index) {
                  btn.classList.add("bg-[#743951]", "text-white");
                  btn.classList.remove("text-stone-600", "hover:bg-[#743951]/10", "hover:text-[#743951]");
                } else {
                  btn.classList.remove("bg-[#743951]", "text-white");
                  btn.classList.add("text-stone-600", "hover:bg-[#743951]/10", "hover:text-[#743951]");
                }
              }
            });
          }
        }
      });
    }, observerOptions);

    const timer = setTimeout(() => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 200);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [isMobileDevice]);

  const initScrollEngine = useCallback(() => {
    const spacer = scrollSpacerRef.current;
    const canvas = canvasRef.current;
    const pathEl = pathRef.current;

    if (!spacer || !canvas || !pathEl || window.innerWidth < 768) return;

    // Set scroll spacer height
    spacer.style.height = `${SCROLL_HEIGHT_MULTIPLIER * 100}vh`;

    // Compute base scale to cover viewport
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const baseScale = Math.max(vw / CANVAS_WIDTH, vh / CANVAS_HEIGHT);

    const startPoint = getPointAtProgress(pathEl, 0.0);
    const startScale = SECTION_WAYPOINTS[0]?.scale ?? 3.0;
    const targetScale = baseScale * startScale;

    const tx = vw / 2 - startPoint.x * CANVAS_WIDTH * targetScale;
    const ty = vh / 2 - startPoint.y * CANVAS_HEIGHT * targetScale;

    // Initial state: start directly zoomed in on session one
    gsap.set(canvas, {
      x: tx,
      y: ty,
      scale: targetScale,
      transformOrigin: "0% 0%",
      force3D: true,
    });

    const playhead = { progress: 0 };

    const anim = gsap.to(playhead, {
      progress: 1,
      ease: "none",
      paused: true,
      onUpdate: () => {
        const pathProgress = playhead.progress;
        const point = getPointAtProgress(pathEl, pathProgress);

        if (odometerRef.current) {
          odometerRef.current.innerText = `${(pathProgress * 7.0).toFixed(2)} KM`;
        }

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

        const totalScale = baseScale * currentScale;

        const tx = vw / 2 - point.x * CANVAS_WIDTH * totalScale;
        const ty = vh / 2 - point.y * CANVAS_HEIGHT * totalScale;

        gsap.set(canvas, {
          x: tx,
          y: ty,
          scale: totalScale,
          transformOrigin: "0% 0%",
          force3D: true,
        });
      },
    });

    const trigger = ScrollTrigger.create({
      trigger: spacer,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.0,
      animation: anim,
    });

    let autoScrollActive = false;
    let userInteractionTimeout: NodeJS.Timeout | null = null;
    let lastTime = performance.now();
    let animationFrameId: number;

    const pixelsPerSecond = 20;

    const autoScrollLoop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (autoScrollActive && !(window as any).isModalOpen && window.innerWidth >= 768) {
        const currentScroll = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

        if (currentScroll >= maxScroll - 5) {
          autoScrollActive = false;
        } else {
          window.scrollTo(0, currentScroll + pixelsPerSecond * dt);
        }
      }

      animationFrameId = requestAnimationFrame(autoScrollLoop);
    };

    animationFrameId = requestAnimationFrame(autoScrollLoop);

    const stopAutoScroll = () => {
      autoScrollActive = false;
      if (userInteractionTimeout) clearTimeout(userInteractionTimeout);

      if ((window as any).isModalOpen || window.innerWidth < 768) return;

      userInteractionTimeout = setTimeout(() => {
        const currentScroll = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (currentScroll < maxScroll - 10 && !(window as any).isModalOpen && window.innerWidth >= 768) {
          autoScrollActive = true;
        }
      }, 2500);
    };

    const handlePauseAutoScroll = () => {
      autoScrollActive = false;
      if (userInteractionTimeout) clearTimeout(userInteractionTimeout);
    };

    const handleResumeAutoScroll = () => {
      if (userInteractionTimeout) clearTimeout(userInteractionTimeout);
      if (!(window as any).isModalOpen && window.innerWidth >= 768) {
        userInteractionTimeout = setTimeout(() => {
          const currentScroll = window.scrollY;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          if (currentScroll < maxScroll - 10 && !(window as any).isModalOpen && window.innerWidth >= 768) {
            autoScrollActive = true;
          }
        }, 2500);
      }
    };

    const handleScrollReady = () => {
      ScrollTrigger.refresh();
      playhead.progress = trigger.progress;
      anim.progress(trigger.progress);

      if (!(window as any).isModalOpen && window.innerWidth >= 768) {
        autoScrollActive = true;
      }

      const audio = audioRef.current;
      if (audio) {
        audio.play().then(() => {
          setIsMusicPlaying(true);
        }).catch(err => {
          console.log("Audio play blocked by browser.", err);
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
      {/* ── Mobile Layout: Normal Vertical Scroll ───────────── */}
      {isMobileDevice ? (
        <div className="w-full min-h-screen bg-[#faf9f6] bg-white bg-cover bg-fixed pt-16 pb-24 px-3 flex flex-col items-center gap-10 overflow-y-auto">
          {/* section 1 - love story */}
          <LoveStorySection isMobile={true} />

          {/* section 2 - the groom & bride */}
          <GroomBrideSection isMobile={true} />

          {/* section 3 - gallery */}
          <GallerySection isMobile={true} />

          {/* section 4 - date time */}
          <DateTimeSection isMobile={true} />

          {/* section 5 - wedding gift */}
          <WeddingGiftSection isMobile={true} />

          {/* section 6 - Wedding Wish */}
          <WeddingWishSection isMobile={true} />

          {/* section 7 - Photo Booth */}
          <PhotoBoothSection isMobile={true} />
        </div>
      ) : (
        /* ── Desktop Viewport (GSAP Infinite Canvas) ────── */
        <div
          className="canvas-viewport"
          style={{
            backgroundColor: "var(--canvas-bg)",
            willChange: "transform",
          }}
        >
          <div
            className="canvas-scale-wrapper"
            style={{
              transform: "scale(1.0)",
              transformOrigin: "center center",
              willChange: "transform",
            }}
          >
            <div
              ref={canvasRef}
              className="canvas-board"
              style={{
                backgroundColor: "var(--canvas-bg)",
                willChange: "transform",
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
            >
              {/* section 1 - love story */}
              <LoveStorySection />

              {/* section 2 - the groom & bride */}
              <GroomBrideSection />

              {/* section 3 - gallery */}
              <GallerySection />

              {/* section 4 - date time */}
              <DateTimeSection />

              {/* section 5 - wedding gift */}
              <WeddingGiftSection />

              {/* section 6 - Wedding Wish */}
              <WeddingWishSection />

              {/* section 7 - Photo Booth */}
              <PhotoBoothSection />
            </div>
          </div>
        </div>
      )}

      {/* ── Fixed HUD UI Controls Layer ──────────────────── */}
      <div className="fixed inset-0 z-50 pointer-events-none flex flex-col justify-between p-2.5 sm:p-4 md:p-6 text-stone-800">
        {/* Top HUD Row */}
        <div className="w-full flex items-start justify-between">
          {/* Header Card */}
          <div className="pointer-events-auto bg-white/75 backdrop-blur-md border border-stone-200/50 p-2 px-3 sm:p-3 sm:px-4 rounded-2xl shadow-md flex flex-col select-none max-w-[60vw] sm:max-w-none">
            <h1 className="font-alex text-lg sm:text-xl md:text-2xl font-bold text-[#743951] leading-none">
              Alzah & Effri
            </h1>
            <p className="text-[8px] sm:text-[10px] md:text-[11px] font-kalam text-stone-500 mt-0.5 sm:mt-1 uppercase tracking-wider">
              Wedding Memory Board
            </p>
          </div>

          {/* Odometer KM Card (Desktop) */}
          {!isMobileDevice && (
            <div className="pointer-events-auto bg-white/75 backdrop-blur-md border border-stone-200/50 p-2 px-3 sm:p-3 sm:px-4 rounded-2xl shadow-md flex flex-col items-end select-none">
              <span className="text-[7.5px] sm:text-[9px] font-sans font-semibold tracking-wider text-stone-500 uppercase">
                Distance Traveled
              </span>
              <span
                ref={odometerRef}
                className="font-mono text-xs sm:text-sm font-bold text-[#743951] mt-0.5"
              >
                0.00 KM
              </span>
            </div>
          )}
        </div>

        {/* Bottom HUD Row */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-4">
          {/* Quick Navigation Panel */}
          <div className="order-2 md:order-1 pointer-events-auto w-full md:w-auto flex justify-center">
            <div className="flex items-center gap-1 p-1 bg-white/80 backdrop-blur-md border border-stone-200/50 rounded-full shadow-md overflow-x-auto max-w-[94vw] scrollbar-hide">
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
                    onClick={() => jumpToWaypoint(wp.progress, `section-${index + 1}`)}
                    className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-stone-600 hover:bg-[#743951]/10 hover:text-[#743951] active:scale-95 transition-all text-[10px] sm:text-[11px] cursor-pointer select-none font-kalam font-medium whitespace-nowrap"
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
              className={`flex items-center bg-white/75 backdrop-blur-md border border-stone-200/50 shadow-md rounded-full transition-all duration-500 ease-out cursor-pointer select-none overflow-hidden h-10 sm:h-12 ${isMusicPlaying || isMusicHovered
                  ? "w-[180px] sm:w-[220px] px-2.5 sm:px-3 gap-2 sm:gap-2.5"
                  : "w-10 sm:w-12 justify-center animate-pulse"
                }`}
              aria-label="Toggle background music"
            >
              {isMusicPlaying || isMusicHovered ? (
                <>
                  {/* Spinning Vinyl Record Disk */}
                  <div className={`relative flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-stone-950 text-white shrink-0 shadow ${isMusicPlaying ? 'animate-[spinRecord_4s_linear_infinite]' : ''}`}>
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-stone-950" />
                    </div>
                  </div>

                  {/* Song Metadata */}
                  <div className="flex flex-col flex-1 min-w-0 text-left">
                    <span className="text-[10px] sm:text-xs font-bold text-[#743951] truncate leading-tight">
                      1000x
                    </span>
                    <span className="text-[7.5px] sm:text-[9px] font-kalam text-stone-500 truncate leading-none mt-0.5">
                      Ghea Indrawari
                    </span>
                  </div>

                  {/* Bouncing audio wave bars */}
                  <div className="flex items-end gap-0.5 h-3.5 sm:h-5 shrink-0 pr-1 select-none">
                    <div className={`w-0.5 bg-[#743951] rounded-full transform origin-bottom transition-all duration-300 ${isMusicPlaying ? 'h-3 animate-[bounceBar_0.8s_ease-in-out_infinite]' : 'h-1'}`} />
                    <div className={`w-0.5 bg-[#743951] rounded-full transform origin-bottom transition-all duration-300 ${isMusicPlaying ? 'h-4 animate-[bounceBar_0.8s_ease-in-out_infinite_0.15s]' : 'h-1.5'}`} />
                    <div className={`w-0.5 bg-[#743951] rounded-full transform origin-bottom transition-all duration-300 ${isMusicPlaying ? 'h-2.5 animate-[bounceBar_0.8s_ease-in-out_infinite_0.3s]' : 'h-1'}`} />
                  </div>
                </>
              ) : (
                <Music className="w-4 h-4 sm:w-5 sm:h-5 text-[#743951]" />
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

      {/* ── Scroll Spacer (Only needed on Desktop) ────────── */}
      {!isMobileDevice && <div ref={scrollSpacerRef} className="canvas-scroll-spacer" />}
    </>
  );
}
