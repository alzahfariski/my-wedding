"use client";

import { useState } from "react";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import LoveStoryDetailModal from "./LoveStoryDetailModal";

export default function LoveStorySection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Image 1: img_1.png at x=360 y=493 */}
      <div
        style={{
          position: "absolute",
          left: "360px",
          top: "493px",
        }}
        className="w-[280px] h-[236px] md:w-[476px] md:h-[402px] transition-transform duration-300 hover:scale-105"
      >
        <Image
          src="/assets/images/img_1.png"
          alt="Memory Image 1"
          fill
          className="object-cover"
          priority
          unoptimized
        />
      </div>

      {/* Image 2: img_2.png at x=244 y=812 */}
      <div
        style={{
          position: "absolute",
          left: "264px",
          top: "812px",
        }}
        className="w-[280px] h-[224px] md:w-[440px] md:h-[351px] transition-transform duration-300 hover:scale-105"
      >
        <Image
          src="/assets/images/img_2.png"
          alt="Memory Image 2"
          fill
          className="object-cover"
          priority
          unoptimized
        />
      </div>

      {/* Love Story Envelope Card Button on Corkboard */}
      <div
        style={{
          position: "absolute",
          left: "320px",
          top: "1142px",
        }}
        className="z-10"
      >
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="group relative w-[200px] md:w-[260px] bg-[#FAF6F0] p-4 md:p-5 rounded-xl border-2 border-[#743951]/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 rotate-[-3deg] hover:rotate-0 cursor-pointer select-none text-left flex flex-col items-center justify-center text-[#743951]"
          title="Buka Surat Love Story"
        >
          {/* Tape Decor */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-4 bg-amber-100/80 rotate-[2deg] shadow-sm border border-amber-200/40" />

          <span className="font-kalam text-[11px] md:text-[13px] text-stone-600 mt-1 flex items-center gap-1 text-center font-medium">
            <BookOpen className="w-3.5 h-3.5 text-[#743951]" />
            <span>Klik untuk membaca surat</span>
          </span>
        </button>
      </div>

      {/* Standalone Love Story Detail Envelope Modal */}
      <LoveStoryDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
