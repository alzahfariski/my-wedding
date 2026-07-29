/**
 * Canvas Path Configuration
 *
 * Pure domain constants for the Infinite Canvas scroll experience.
 * Contains the SVG path data, canvas dimensions, and section waypoints.
 * This file is framework-agnostic — no React, Next.js, or GSAP imports.
 */

/** The SVG path that defines the camera's travel route across the canvas */
export const CANVAS_SVG_PATH =
  "M46.0552 42.3522C46.0552 42.3522 -56.444 1143.35 46.0552 1174.85C148.554 1206.35 341.33 939.262 564.555 933.854C861.168 926.667 1086.05 1338.35 1284.55 1215.85C1483.05 1093.35 1329.69 1016.14 1265.05 839.353C1168.63 575.623 1081.42 215.285 1256.55 34.3543C1347.47 -59.5708 1468.11 73.2273 1546.55 59.3539C1763.45 20.9963 1936.55 14.1607 2053.05 20.8544C2169.55 27.5482 2108.05 1764.35 2108.05 1764.35";

/** SVG path native viewBox dimensions (px) */
export const PATH_WIDTH = 2028;
export const PATH_HEIGHT = 1282;

/** SVG viewBox string for the path element (used for hidden calculation SVG) */
export const PATH_VIEWBOX = `0 0 ${PATH_WIDTH} ${PATH_HEIGHT}`;

/**
 * Full corkboard canvas dimensions (px).
 * The corkboard image is 3000×2500. The SVG path sits inside
 * the inner white area, offset from the wooden frame edges.
 */
export const CANVAS_WIDTH = 3000;
export const CANVAS_HEIGHT = 2500;

/**
 * Offset to position the SVG path inside the corkboard's inner area.
 * The wooden frame takes approximately ~536px left/right and ~609px top/bottom.
 * This centers the 1928×1282 path within the 3000×2500 canvas.
 *
 * Calculation:
 *   X offset = (3000 - 1928) / 2 = 536
 *   Y offset = (2500 - 1282) / 2 = 609
 */
export const PATH_OFFSET_X = (CANVAS_WIDTH - PATH_WIDTH) / 2;
export const PATH_OFFSET_Y = (CANVAS_HEIGHT - PATH_HEIGHT) / 2;

/** Canvas viewBox string (full corkboard) */
export const CANVAS_VIEWBOX = `0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`;

/**
 * Section waypoints along the path.
 * Each entry defines a "stop" where a content section is displayed.
 * `progress` is a 0→1 value along the total path length.
 * The camera will center on the path point at each progress value.
 */
export interface CanvasSectionWaypoint {
  /** Unique id for the section */
  readonly id: string;
  /** Label / title for the section */
  readonly label: string;
  /** Progress along the SVG path (0 = start, 1 = end) */
  readonly progress: number;
  /** Optional scale multiplier for 3D tunnel zoom effect (default 1) */
  readonly scale?: number;
  /** Optional rotation in degrees */
  readonly rotation?: number;
}

/**
 * Predefined section waypoints distributed along the SVG path.
 * These correspond to the key turning points / segments of the path.
 *
 * Path breakdown (approximate segments):
 *   0.00  → Start at (0.5, 1.19) — top-left
 *   ~0.12 → Drop to (0.5, 1133.69) — bottom-left
 *   ~0.22 → Move to (519, 892.69) — center-left
 *   ~0.35 → Move to (1172.5, 1280.19) — bottom-center
 *   ~0.45 → Up to (1172.5, 798.19) — mid-center
 *   ~0.55 → Back to (519, 431.69) — center-left upper
 *   ~0.65 → Up to (519, 1.19) — top-left area
 *   ~0.75 → Right to (1279.5, 1.19) — top-center-right
 *   ~0.82 → Down to (1279.5, 431.69) — mid-right
 *   ~0.87 → Right to (1481, 431.69) — mid-far-right
 *   ~0.93 → Diagonal to (1926.5, 1.19) — top-far-right
 *   1.00  → Down to (1911, 1280.19) — bottom-far-right
 */
export const SECTION_WAYPOINTS: readonly CanvasSectionWaypoint[] = [
  { id: "section-1", label: "Love Story", progress: 0.0, scale: 3.0 },
  { id: "section-2", label: "Groom & Bride", progress: 0.2, scale: 3.2 },
  { id: "section-3", label: "Our Gallery", progress: 0.42, scale: 2.8 },
  { id: "section-4", label: "Akad & Resepsi", progress: 0.6, scale: 3.0 },
  { id: "section-5", label: "Wedding Gift", progress: 0.74, scale: 2.5 },
  { id: "section-6", label: "Wedding Wish", progress: 0.85, scale: 3.0 },
  { id: "section-7", label: "Photo Booth", progress: 0.94, scale: 3.2 },
] as const;

/**
 * Default zoom level when the camera is between waypoints.
 * 1.0 = full corkboard visible. Values > 1 zoom in.
 */
export const DEFAULT_ZOOM = 1.0;

/** Total virtual scroll height multiplier (relative to viewport height) */
export const SCROLL_HEIGHT_MULTIPLIER = 7;
