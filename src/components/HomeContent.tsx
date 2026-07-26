"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

  const initScrollEngine = useCallback(() => {
    const spacer = scrollSpacerRef.current;
    const canvas = canvasRef.current;
    const pathEl = pathRef.current;

    if (!spacer || !canvas || !pathEl) return;

    // Set scroll spacer height
    spacer.style.height = `${SCROLL_HEIGHT_MULTIPLIER * 100}vh`;

    // Compute base scale to cover viewport (equivalent of "background-size: cover")
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const baseScale = Math.max(vw / CANVAS_WIDTH, vh / CANVAS_HEIGHT);

    // Initial state: view full (scale = 1.0) and centered on canvas center (0.5, 0.5)
    const initialScale = baseScale * 1.0;
    gsap.set(canvas, {
      x: vw / 2 - 0.5 * CANVAS_WIDTH * initialScale,
      y: vh / 2 - 0.5 * CANVAS_HEIGHT * initialScale,
      scale: initialScale,
      transformOrigin: "0% 0%",
    });

    let introPlaying = true;

    // ScrollTrigger — zoom + pan along path
    const trigger = ScrollTrigger.create({
      trigger: spacer,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2,
      onUpdate: (self) => {
        if (introPlaying) return; // skip updates during intro zoom

        const isMobile = window.innerWidth < 768;
        const scaleMultiplier = isMobile ? 0.75 : 1.0;

        const pathProgress = self.progress;
        const point = getPointAtProgress(pathEl, pathProgress);

        // Interpolate zoom scale between waypoints based on pathProgress
        let currentScale = SECTION_WAYPOINTS[0]?.scale ?? 3.0;
        for (let i = 0; i < SECTION_WAYPOINTS.length - 1; i++) {
          const a = SECTION_WAYPOINTS[i];
          const b = SECTION_WAYPOINTS[i + 1];
          if (pathProgress >= a.progress && pathProgress <= b.progress) {
            const tScale =
              (pathProgress - a.progress) / (b.progress - a.progress);
            currentScale =
              (a.scale ?? 3.0) +
              ((b.scale ?? 3.0) - (a.scale ?? 3.0)) * tScale;
            break;
          }
        }

        const lastWp = SECTION_WAYPOINTS[SECTION_WAYPOINTS.length - 1];
        if (pathProgress > (lastWp?.progress ?? 1.0)) {
          currentScale = lastWp?.scale ?? 3.0;
        }

        const totalScale = baseScale * currentScale * scaleMultiplier;

        // Position corkboard so the target point is centered in viewport
        const tx = vw / 2 - point.x * CANVAS_WIDTH * totalScale;
        const ty = vh / 2 - point.y * CANVAS_HEIGHT * totalScale;

        gsap.to(canvas, {
          x: tx,
          y: ty,
          scale: totalScale,
          transformOrigin: "0% 0%",
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      },
    });

    // Intro zoom animation function
    const playIntroAnimation = () => {
      const isMobile = window.innerWidth < 768;
      const scaleMultiplier = isMobile ? 0.75 : 1.0;

      const startPoint = getPointAtProgress(pathEl, 0.0);
      const startScale = SECTION_WAYPOINTS[0]?.scale ?? 3.0;
      const targetScale = baseScale * startScale * scaleMultiplier;

      const tx = vw / 2 - startPoint.x * CANVAS_WIDTH * targetScale;
      const ty = vh / 2 - startPoint.y * CANVAS_HEIGHT * targetScale;

      gsap.to(canvas, {
        x: tx,
        y: ty,
        scale: targetScale,
        transformOrigin: "0% 0%",
        duration: 2.8, // Smooth, slow zoom-in
        delay: 0.8, // Hold at full scale for 0.8 seconds
        ease: "power2.inOut",
        overwrite: "auto",
        onComplete: () => {
          introPlaying = false;
        },
      });
    };

    window.addEventListener("open-board", playIntroAnimation);

    return () => {
      trigger.kill();
      window.removeEventListener("open-board", playIntroAnimation);
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
          ref={canvasRef}
          className="canvas-board"
          style={{
            backgroundImage: `url(${CORKBOARD_IMAGE_PATH})`,
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
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

      {/* ── Hidden SVG for path calculations ─────────────── */}
      <svg
        className="absolute opacity-0 pointer-events-none"
        viewBox={PATH_VIEWBOX}
        width="0"
        height="0"
        aria-hidden="true"
      >
        <path ref={pathRef} d={CANVAS_SVG_PATH} />
      </svg>

      {/* ── Scroll Spacer ────────────────────────────────── */}
      <div ref={scrollSpacerRef} className="canvas-scroll-spacer" />
    </>
  );
}
