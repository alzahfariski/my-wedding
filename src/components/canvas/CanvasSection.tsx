"use client";

import { type ReactNode } from "react";

interface CanvasSectionProps {
  /** Unique section identifier */
  id: string;
  /** Absolute X position (unused in zoom mode — positioned by parent) */
  x: number;
  /** Absolute Y position (unused in zoom mode — positioned by parent) */
  y: number;
  /** Scale factor (unused in zoom mode) */
  scaleFactor: number;
  /** Optional rotation in degrees */
  rotation?: number;
  /** Section label shown as a title */
  label: string;
  /** Content to render inside the section */
  children?: ReactNode;
}

/**
 * Section card for the Infinite Canvas corkboard.
 *
 * Styled as a paper note pinned to the board.
 * In zoom mode, positioning is handled by the parent wrapper
 * via CSS percentage + translate(-50%, -50%).
 */
export default function CanvasSection({
  id,
  rotation = 0,
  label,
  children,
}: CanvasSectionProps) {
  return (
    <div
      id={id}
      className="flex items-center justify-center"
      style={{
        width: "280px",
        height: "200px",
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "center center",
      }}
    >
      {/* Card container with corkboard pin aesthetic */}
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {/* Push-pin decoration */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-900/30 border border-red-300/50" />
          <div className="w-0.5 h-1.5 bg-stone-400 mx-auto -mt-0.5 rounded-b-sm" />
        </div>

        {/* Paper card */}
        <div className="relative w-full h-full bg-white/95 rounded-sm shadow-xl shadow-stone-900/20 border border-stone-200/60 p-4 flex flex-col items-center justify-center overflow-hidden backdrop-blur-sm">
          {/* Subtle paper texture */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#854d0e_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Section label */}
          <h3 className="relative z-10 text-script-title text-stone-700 mb-2 text-center leading-tight">
            {label}
          </h3>

          {/* Content area */}
          <div className="relative z-10 w-full flex-1 flex items-center justify-center text-handwritten-body text-stone-600 text-center">
            {children ?? (
              <p className="text-stone-400 italic text-sm">
                Konten segera hadir...
              </p>
            )}
          </div>
        </div>

        {/* Subtle tape decoration on corners */}
        <div className="absolute -top-1 -left-1 w-8 h-4 bg-amber-100/60 rotate-[-15deg] rounded-sm shadow-sm" />
        <div className="absolute -top-1 -right-1 w-8 h-4 bg-amber-100/60 rotate-[15deg] rounded-sm shadow-sm" />
      </div>
    </div>
  );
}
