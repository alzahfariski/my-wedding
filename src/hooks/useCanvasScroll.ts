"use client";

import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PATH_OFFSET_X,
  PATH_OFFSET_Y,
  SCROLL_HEIGHT_MULTIPLIER,
  SECTION_WAYPOINTS,
} from "@/domain/canvasPath";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
}

/**
 * Point on the SVG path with computed coordinates.
 */
interface PathPoint {
  readonly x: number;
  readonly y: number;
}

/**
 * Return type of the useCanvasScroll hook.
 * Provides refs for DOM attachment and computed waypoint positions.
 */
export interface CanvasScrollResult {
  /** Ref for the scroll spacer (tall invisible div that captures scroll) */
  scrollSpacerRef: React.RefObject<HTMLDivElement | null>;
  /** Ref for the world canvas layer that gets translated */
  canvasRef: React.RefObject<HTMLDivElement | null>;
  /** Ref for the hidden SVG path element used for calculations */
  pathRef: React.RefObject<SVGPathElement | null>;
  /** Computed absolute positions of each section waypoint on the canvas */
  waypointPositions: PathPoint[];
}

/**
 * Samples a point at `progress` (0→1) along an SVG <path> element.
 */
function getPointAtProgress(
  pathElement: SVGPathElement,
  progress: number
): PathPoint {
  const totalLength = pathElement.getTotalLength();
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const point = pathElement.getPointAtLength(totalLength * clampedProgress);
  // Translate from path-local coords to canvas-space by adding the offset
  return { x: point.x + PATH_OFFSET_X, y: point.y + PATH_OFFSET_Y };
}

/**
 * Hook that orchestrates the Infinite Canvas scroll experience.
 *
 * How it works:
 * 1. A tall invisible "spacer" div gives the page scrollable height.
 * 2. GSAP ScrollTrigger watches scroll progress (0→1).
 * 3. On each scroll update, the current position along the SVG path is computed.
 * 4. The canvas layer is translated so the path point is centered in the viewport.
 * 5. An optional scale effect creates a 3D tunnel zoom feel.
 */
export function useCanvasScroll(): CanvasScrollResult {
  const scrollSpacerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const waypointPositionsRef = useRef<PathPoint[]>([]);

  /**
   * Computes absolute positions for each section waypoint.
   * Called once after mount when the path element is available.
   */
  const computeWaypointPositions = useCallback((): PathPoint[] => {
    const pathEl = pathRef.current;
    if (!pathEl) return [];

    return SECTION_WAYPOINTS.map((wp) => getPointAtProgress(pathEl, wp.progress));
  }, []);

  useEffect(() => {
    const spacer = scrollSpacerRef.current;
    const canvas = canvasRef.current;
    const pathEl = pathRef.current;

    if (!spacer || !canvas || !pathEl) return;

    // Compute waypoint positions for section placement
    waypointPositionsRef.current = computeWaypointPositions();

    // Compute the scale factor to map canvas coords to screen pixels.
    // We scale the canvas so its width fills the viewport, maintaining aspect ratio.
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scaleFactor = Math.max(
      viewportWidth / CANVAS_WIDTH,
      viewportHeight / CANVAS_HEIGHT
    ) * 1.2; // slight overshoot so sections feel "zoomed in"

    // Set canvas size in real pixels
    canvas.style.width = `${CANVAS_WIDTH * scaleFactor}px`;
    canvas.style.height = `${CANVAS_HEIGHT * scaleFactor}px`;

    // Set spacer height for scroll range
    spacer.style.height = `${SCROLL_HEIGHT_MULTIPLIER * 100}vh`;

    // Create a proxy object for GSAP to tween
    const progressProxy = { value: 0 };

    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: spacer,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.5,
      onUpdate: (self) => {
        progressProxy.value = self.progress;

        const point = getPointAtProgress(pathEl, self.progress);

        // Find which waypoint section we're closest to for scale interpolation
        let currentScale = 1;
        for (let i = 0; i < SECTION_WAYPOINTS.length - 1; i++) {
          const wpCurrent = SECTION_WAYPOINTS[i];
          const wpNext = SECTION_WAYPOINTS[i + 1];
          if (
            self.progress >= wpCurrent.progress &&
            self.progress <= wpNext.progress
          ) {
            const localProgress =
              (self.progress - wpCurrent.progress) /
              (wpNext.progress - wpCurrent.progress);
            const scaleA = wpCurrent.scale ?? 1;
            const scaleB = wpNext.scale ?? 1;
            currentScale = scaleA + (scaleB - scaleA) * localProgress;
            break;
          }
        }

        // If past the last waypoint, use the last waypoint's scale
        const lastWp = SECTION_WAYPOINTS[SECTION_WAYPOINTS.length - 1];
        if (self.progress > (lastWp?.progress ?? 1)) {
          currentScale = lastWp?.scale ?? 1;
        }

        // Translate canvas so the path point is centered in viewport
        const translateX = -(point.x * scaleFactor) + viewportWidth / 2;
        const translateY = -(point.y * scaleFactor) + viewportHeight / 2;

        gsap.set(canvas, {
          x: translateX,
          y: translateY,
          scale: currentScale,
          transformOrigin: `${point.x * scaleFactor}px ${point.y * scaleFactor}px`,
        });
      },
    });

    // Set initial position at path start
    const initialPoint = getPointAtProgress(pathEl, 0);
    const initX = -(initialPoint.x * scaleFactor) + viewportWidth / 2;
    const initY = -(initialPoint.y * scaleFactor) + viewportHeight / 2;
    gsap.set(canvas, {
      x: initX,
      y: initY,
      scale: SECTION_WAYPOINTS[0]?.scale ?? 1,
      transformOrigin: `${initialPoint.x * scaleFactor}px ${initialPoint.y * scaleFactor}px`,
    });

    return () => {
      scrollTriggerInstance.kill();
    };
  }, [computeWaypointPositions]);

  return {
    scrollSpacerRef,
    canvasRef,
    pathRef,
    waypointPositions: waypointPositionsRef.current,
  };
}
