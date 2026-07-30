"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, Heart } from "lucide-react";

interface StorySection {
  id: string;
  imageHeader: string;
  content: string;
}

const LOVE_STORY_SECTIONS: StorySection[] = [
  {
    id: "section-1",
    imageHeader: "/assets/story/section1.png",
    content:
      "Delapan tahun lalu, kisah kami dimulai dari sebuah pertemuan sederhana. Tidak ada yang menyangka bahwa langkah kecil itu akan membawa kami pada perjalanan yang begitu panjang.",
  },
  {
    id: "section-2",
    imageHeader: "/assets/story/section2.png",
    content:
      "Seiring waktu, kami belajar bahwa cinta bukan hanya tentang kebersamaan. Ia tumbuh melalui kepercayaan, kesabaran, dan komitmen yang terus kami jaga di setiap langkah.",
  },
  {
    id: "section-3",
    imageHeader: "/assets/story/section3.png",
    content:
      "Ada saat ketika jarak menjadi bagian dari cerita kami. Kami merayakan momen-momen penting dari kejauhan, saling menguatkan di masa sulit, dan terus memilih satu sama lain meski dipisahkan oleh ruang dan waktu.",
  },
  {
    id: "section-4",
    imageHeader: "/assets/story/section4.png",
    content:
      "Tanpa terasa, perjalanan itu telah membawa kami melewati delapan tahun penuh cerita. Setiap tawa, tantangan, dan penantian menjadi bagian yang membentuk kami hingga hari ini.",
  },
  {
    id: "section-5",
    imageHeader: "/assets/story/section5.png",
    content:
      "Hari ini, semua perjalanan itu mengantarkan kami pada awal yang baru. Kami tidak hanya merayakan hari pernikahan, tetapi juga merayakan delapan tahun perjuangan, kesetiaan, dan cinta yang telah membawa kami sampai di titik ini.",
  },
];

interface LoveStoryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoveStoryDetailModal({
  isOpen,
  onClose,
}: LoveStoryDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const [animStage, setAnimStage] = useState<
    "closed" | "opening-flap" | "rising-letter" | "expanding" | "expanded" | "closing-flap"
  >("closed");

  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync opening animation sequence when isOpen turns true
  useEffect(() => {
    if (isOpen) {
      setAnimStage("opening-flap");

      const t1 = setTimeout(() => {
        setAnimStage("rising-letter");
      }, 400);

      const t2 = setTimeout(() => {
        setAnimStage("expanding");
      }, 850);

      const t3 = setTimeout(() => {
        setAnimStage("expanded");
      }, 1300);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else {
      setAnimStage("closed");
    }
  }, [isOpen]);

  // Disable background page/canvas scroll & turn off auto-scroll when Love Story detail modal is active
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

  // Non-passive scroll lockdown on backdrop so swiping background never moves home canvas
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay || !isOpen) return;

    const preventBackgroundScroll = (e: TouchEvent | WheelEvent) => {
      const target = e.target as HTMLElement | null;
      const isScrollableContent = target?.closest(".overflow-y-auto");
      if (!isScrollableContent && e.cancelable) {
        e.preventDefault();
      }
    };

    overlay.addEventListener("touchmove", preventBackgroundScroll, { passive: false });
    overlay.addEventListener("wheel", preventBackgroundScroll, { passive: false });

    return () => {
      overlay.removeEventListener("touchmove", preventBackgroundScroll);
      overlay.removeEventListener("wheel", preventBackgroundScroll);
    };
  }, [isOpen]);

  // Smooth close sequence: Letter shrinks -> slides back into envelope pocket -> flap closes -> modal unmounts
  const handleClose = () => {
    setAnimStage("rising-letter");

    setTimeout(() => {
      setAnimStage("opening-flap");
    }, 450);

    setTimeout(() => {
      setAnimStage("closing-flap");
    }, 850);

    setTimeout(() => {
      setAnimStage("closed");
      onClose();
    }, 1300);
  };

  if (!isOpen || !mounted) return null;

  const isFlapOpen =
    animStage === "opening-flap" ||
    animStage === "rising-letter" ||
    animStage === "expanding" ||
    animStage === "expanded";

  const isSealVisible =
    animStage === "closed" ||
    animStage === "opening-flap" ||
    animStage === "closing-flap";

  return createPortal(
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 transition-all duration-500 ease-out ${animStage !== "closed"
        ? "bg-black/75 backdrop-blur-md opacity-100"
        : "opacity-0 pointer-events-none"
        }`}
      onClick={handleClose}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      {/* Main Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl flex items-center justify-center select-none min-h-[300px]"
      >
        {/* 3D Envelope Box (Centered Base Container) */}
        <div className="relative w-[320px] h-[210px] sm:w-[400px] sm:h-[260px] perspective-[1200px] flex items-center justify-center">

          {/* LAYER 1: BADAN SURAT BELAKANG (Envelope Back Body) - z-0 */}
          <div className="absolute inset-0 bg-[#EFE8DC] rounded-xl border-2 border-[#947268]/40 shadow-2xl overflow-hidden z-0">
            <div className="absolute inset-0 bg-gradient-to-t from-stone-400/20 to-transparent" />
          </div>

          {/* LAYER 2: ISI SURAT (Letter Paper Sheet)
              - Tucked inside envelope at z-10 (behind front pocket z-20)
              - Slides UP out of pocket to z-40 when rising/expanding
              - Expands into full reading card at z-50
          */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute bg-[#FAF7F2] border-2 border-[#743951]/30 rounded-2xl shadow-2xl transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col font-kalam text-[#743951] overflow-hidden ${animStage === "expanded"
                ? "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-6xl h-[90vh] max-h-[90vh] scale-100 z-50 p-4 sm:p-8 md:p-12 opacity-100"
                : animStage === "expanding"
                  ? "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-4xl h-[80vh] scale-95 z-50 p-4 sm:p-8 opacity-100"
                  : animStage === "rising-letter"
                    ? "w-[90%] sm:w-[92%] h-[240px] -translate-y-28 sm:-translate-y-36 scale-100 z-40 p-4 opacity-100 shadow-2xl"
                    : "w-[85%] sm:w-[88%] h-[180px] translate-y-2 scale-90 opacity-70 z-10 p-3"
              }`}
          >
            {/* Close Button (Visible during expansion & reading) */}
            {(animStage === "expanded" || animStage === "expanding") && (
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-4 right-4 text-stone-400 hover:text-[#743951] p-2 rounded-full hover:bg-[#743951]/10 transition-colors cursor-pointer z-50"
                title="Tutup Surat"
              >
                <X className="w-7 h-7 md:w-8 md:h-8" />
              </button>
            )}

            {/* Preview Header when letter is tucked / rising in small mode */}
            {animStage !== "expanded" && animStage !== "expanding" && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <span className="font-alex text-2xl sm:text-3xl font-normal text-[#743951] border-b border-[#743951]/20 pb-1 mb-2 w-full">
                  Our Love Story
                </span>
                <p className="text-xs text-stone-600 italic line-clamp-2 px-2">
                  Delapan tahun lalu, kisah kami dimulai dari sebuah pertemuan sederhana...
                </p>
              </div>
            )}

            {/* Full Readable Content when letter expands into full view */}
            {(animStage === "expanded" || animStage === "expanding") && (
              <div className="flex flex-col h-full opacity-100 transition-opacity duration-300">
                {/* Letter Header */}
                <div className="text-center border-b-2 border-[#743951]/20 pb-4 mb-6 mt-2">
                  <h2 className="font-alex text-5xl sm:text-6xl md:text-7xl font-normal text-[#743951]">
                    Our Love Story
                  </h2>
                  <p className="font-kalam text-sm sm:text-base text-stone-500 mt-1 italic">
                    Alzah & Effri — Perjalanan 8 Tahun
                  </p>
                </div>

                {/* Scrollable Letter Content Body */}
                <div
                  className="overflow-y-auto flex-1 pr-3 sm:pr-6 space-y-7 scrollbar-thin scrollbar-thumb-[#743951]/20 overscroll-contain"
                  onWheel={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                >
                  {LOVE_STORY_SECTIONS.map((sec, idx) => (
                    <div key={sec.id} className="flex flex-col">
                      {/* Side-by-Side: Gambar di Kiri, Text di Kanan */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 md:gap-8">
                        {/* Gambar di Kiri */}
                        <div className="relative w-full sm:w-[220px] md:w-[280px] h-[130px] sm:h-[160px] md:h-[180px] shrink-0 rounded-xl overflow-hidden p-2">
                          <Image
                            src={sec.imageHeader}
                            alt={`Section ${idx + 1}`}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </div>

                        {/* Text Sejajar di Kanan */}
                        <p className="flex-1 font-kalam text-base sm:text-lg md:text-xl text-stone-700 leading-relaxed font-normal">
                          {sec.content}
                        </p>
                      </div>

                      {idx < LOVE_STORY_SECTIONS.length - 1 && (
                        <div className="flex items-center justify-center gap-4 my-6 sm:my-8 opacity-40">
                          <div className="h-px bg-[#743951] flex-1 max-w-[140px]" />
                          <Heart className="w-4 h-4 text-[#743951] fill-[#743951]" />
                          <div className="h-px bg-[#743951] flex-1 max-w-[140px]" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* LAYER 3: BADAN SURAT DEPAN (Envelope Front Pocket Flaps) - z-20
              Pocket covers the bottom half of the tucked letter (z-10)
          */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {/* Bottom Triangle Flap */}
            <div
              className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#E6DDD0] border-t border-[#947268]/30 shadow-md"
              style={{
                clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
              }}
            />
            {/* Left Triangle Flap */}
            <div
              className="absolute top-0 bottom-0 left-0 w-1/2 bg-[#DDD3C4] border-r border-[#947268]/20"
              style={{
                clipPath: "polygon(0 0, 100% 50%, 0 100%)",
              }}
            />
            {/* Right Triangle Flap */}
            <div
              className="absolute top-0 bottom-0 right-0 w-1/2 bg-[#DDD3C4] border-l border-[#947268]/20"
              style={{
                clipPath: "polygon(100% 0, 0 50%, 100% 100%)",
              }}
            />
          </div>

          {/* LAYER 4: TUTUP SURAT (Top Envelope Flap with Wax Seal)
              - When closed: z-30 (covers front pocket z-20 and tucked letter z-10)
              - When open: rotates 180° upwards to z-10
          */}
          <div
            className={`absolute top-0 left-0 right-0 h-1/2 bg-[#E1D7C8] border-b border-[#947268]/40 origin-top transition-transform duration-500 ease-in-out shadow-sm ${isFlapOpen
              ? "[transform:rotateX(180deg)] bg-[#d4c8b6] z-10"
              : "[transform:rotateX(0deg)] z-30"
              }`}
            style={{
              clipPath: "polygon(0 0, 50% 100%, 100% 0)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Wax Seal Stamp on Top Flap */}
            <div
              className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#743951] border-2 border-amber-200/60 shadow-md flex items-center justify-center text-white transition-opacity duration-300 ${isSealVisible ? "opacity-100" : "opacity-0"
                }`}
            >
              <Heart className="w-4 h-4 fill-white" />
            </div>
          </div>

        </div>

      </div>
    </div>,
    document.body
  );
}
