"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  { id: "1", src: "/assets/gallery/gallery_1.png", alt: "Gallery Photo 1" },
  { id: "2", src: "/assets/gallery/gallery_2.png", alt: "Gallery Photo 2" },
  { id: "3", src: "/assets/gallery/gallery_3.png", alt: "Gallery Photo 3" },
  { id: "4", src: "/assets/gallery/gallery_4.png", alt: "Gallery Photo 4" },
  { id: "5", src: "/assets/gallery/gallery_5.png", alt: "Gallery Photo 5" },
  { id: "6", src: "/assets/gallery/gallery_6.png", alt: "Gallery Photo 6" },
];

interface GalleryDetailModalProps {
  isOpen: boolean;
  initialIndex?: number;
  onClose: () => void;
}

export default function GalleryDetailModal({
  isOpen,
  initialIndex = 0,
  onClose,
}: GalleryDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  // Lock scroll & pause auto-scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      if (typeof window !== "undefined") {
        (window as any).isModalOpen = true;
        window.dispatchEvent(new CustomEvent("pause-auto-scroll"));
      }
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      if (typeof window !== "undefined") {
        (window as any).isModalOpen = false;
        window.dispatchEvent(new CustomEvent("resume-auto-scroll"));
      }
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      if (typeof window !== "undefined") {
        (window as any).isModalOpen = false;
        window.dispatchEvent(new CustomEvent("resume-auto-scroll"));
      }
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? GALLERY_ITEMS.length - 1 : prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === GALLERY_ITEMS.length - 1 ? 0 : prev + 1));
  }, []);

  // Keyboard Navigation (Left / Right / Escape)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handlePrev, handleNext, onClose]);

  // Non-passive scroll prevention on backdrop
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay || !isOpen) return;

    const preventDefault = (e: TouchEvent | WheelEvent) => {
      if (e.cancelable) e.preventDefault();
    };

    overlay.addEventListener("touchmove", preventDefault, { passive: false });
    overlay.addEventListener("wheel", preventDefault, { passive: false });

    return () => {
      overlay.removeEventListener("touchmove", preventDefault);
      overlay.removeEventListener("wheel", preventDefault);
    };
  }, [isOpen]);

  // Swipe handlers for mobile touch
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;

    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setTouchStartX(null);
  };

  if (!isOpen || !mounted) return null;

  const currentItem = GALLERY_ITEMS[currentIndex] || GALLERY_ITEMS[0];

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md transition-opacity duration-300 p-4 sm:p-8 select-none"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Header Bar */}
      <div
        className="absolute top-4 left-4 right-4 flex items-center justify-between z-50 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Index counter */}
        <span className="font-kalam text-lg sm:text-xl font-bold bg-black/40 px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-sm shadow-md">
          {currentIndex + 1} / {GALLERY_ITEMS.length}
        </span>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="p-2.5 rounded-full bg-black/40 hover:bg-white/20 border border-white/20 text-white/90 hover:text-white transition-all cursor-pointer shadow-md active:scale-95"
          title="Tutup (Esc)"
        >
          <X className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      </div>

      {/* Main Image Container */}
      <div
        className="relative w-full max-w-5xl h-[75vh] sm:h-[82vh] max-h-[85vh] flex items-center justify-center my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-stone-900/50">
          <Image
            key={currentItem.id}
            src={currentItem.src}
            alt={currentItem.alt}
            fill
            className="object-contain transition-all duration-300 animate-fadeIn"
            priority
            unoptimized
          />
        </div>
      </div>

      {/* Navigation Buttons (Left & Right) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handlePrev();
        }}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/50 hover:bg-white/20 border border-white/20 text-white/90 hover:text-white transition-all cursor-pointer z-50 shadow-xl active:scale-90"
        title="Sebelumnya (Panah Kiri)"
      >
        <ChevronLeft className="w-7 h-7 sm:w-9 sm:h-9" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/50 hover:bg-white/20 border border-white/20 text-white/90 hover:text-white transition-all cursor-pointer z-50 shadow-xl active:scale-90"
        title="Berikutnya (Panah Kanan)"
      >
        <ChevronRight className="w-7 h-7 sm:w-9 sm:h-9" />
      </button>

      {/* Thumbnail Bar at Bottom */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 bg-black/60 backdrop-blur-md px-3 sm:px-5 py-2 rounded-full border border-white/20 z-50 max-w-[90vw] overflow-x-auto scrollbar-none"
        onClick={(e) => e.stopPropagation()}
      >
        {GALLERY_ITEMS.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
              idx === currentIndex
                ? "border-amber-400 scale-110 shadow-lg shadow-amber-400/30 ring-2 ring-amber-400/50"
                : "border-white/30 opacity-60 hover:opacity-100 hover:scale-105"
            }`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="object-cover"
              unoptimized
            />
          </button>
        ))}
      </div>
    </div>,
    document.body
  );
}
