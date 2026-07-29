"use client";

import Image from "next/image";
import { FolderOpen } from "lucide-react";

interface CoverPageProps {
  guestName: string;
  onOpen: () => void;
}

export default function CoverPage({ guestName, onOpen }: CoverPageProps) {
  return (
    <>
      {/* ===== MOBILE LAYOUT (Fixed 100% Viewport, No Scroll) ===== */}
      <div className="md:hidden w-full h-dvh max-h-dvh bg-white flex flex-col items-center justify-between p-4 py-6 overflow-hidden select-none">
        {/* Cover Right Image — Top section (Flex 1 to auto-fit screen height) */}
        <div className="relative w-full max-w-[80vw] flex-1 min-h-0 aspect-[4/5] my-auto">
          <Image
            src="/assets/cover/cover-right.png"
            alt="Wedding Cover Decor"
            fill
            sizes="80vw"
            className="object-contain"
            priority
          />
        </div>

        {/* Content Section — Bottom section (Shrink 0) */}
        <div className="flex flex-col items-center w-full max-w-[290px] shrink-0 pt-2 pb-2">
          {/* Guest Greeting Header */}
          <p className="text-handwritten-title text-stone-500 tracking-wider text-xs sm:text-sm text-center">
            Dear Mr/Mrs/Ms
          </p>

          {/* Dynamic Guest Name Card Tag */}
          <div className="relative w-full aspect-[4/1] mt-1 flex items-center justify-center">
            <Image
              src="/assets/cover/tagname.png"
              alt="Guest Name Tag Card"
              fill
              sizes="290px"
              className="object-contain"
              priority
            />
            <span
              className="relative z-10 text-handwritten-body text-[#743951] font-bold px-4 text-center text-base sm:text-lg truncate max-w-[85%] leading-none mt-0.5"
              title={guestName}
            >
              {guestName}
            </span>
          </div>

          {/* Open Board Button */}
          <div className="w-full flex justify-center mt-3">
            <button
              onClick={onOpen}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#947268] text-white font-semibold rounded-full border border-white/60 shadow-lg shadow-[#947268]/20 hover:bg-[#836158] active:scale-95 transition-all text-xs tracking-wider cursor-pointer"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Open Board</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===== DESKTOP LAYOUT (50/50 side-by-side, fixed 100% viewport, no scroll) ===== */}
      <div className="hidden md:flex w-full h-dvh max-h-dvh bg-white flex-row overflow-hidden select-none p-6">
        {/* Left Column — Letter card + text + button */}
        <div className="w-1/2 flex flex-col items-center justify-center p-6 h-full overflow-hidden">
          {/* Cover Left Decor */}
          <div className="relative w-full max-w-[520px] max-h-[55vh] aspect-[4/3] mb-4">
            <Image
              src="/assets/cover/cover-left.png"
              alt="Wedding Left Decor"
              fill
              sizes="520px"
              className="object-contain"
              priority
            />
          </div>

          {/* Content Wrapper — viewport-responsive sizing */}
          <div className="flex flex-col items-start w-full max-w-[320px] shrink-0 mt-2">
            <p className="text-handwritten-title text-stone-500 tracking-wider text-sm text-left">
              Dear Mr/Mrs/Ms
            </p>

            <div className="relative w-full aspect-[4/1] mt-1 flex items-center justify-center">
              <Image
                src="/assets/cover/tagname.png"
                alt="Guest Name Tag Card"
                fill
                sizes="320px"
                className="object-contain"
                priority
              />
              <span
                className="relative z-10 text-handwritten-body text-[#743951] font-bold px-4 text-center text-base truncate max-w-[85%] leading-none mt-0.5"
                title={guestName}
              >
                {guestName}
              </span>
            </div>

            <button
              onClick={onOpen}
              className="flex items-center gap-2 px-5 py-2 mt-4 bg-[#947268] text-white font-semibold rounded-full border border-white/60 shadow-lg shadow-[#947268]/20 hover:bg-[#836158] hover:shadow-xl hover:shadow-[#947268]/30 hover:scale-105 active:scale-95 transition-all text-xs tracking-wider cursor-pointer"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Open Board</span>
            </button>
          </div>
        </div>

        {/* Right Column — Cover right image */}
        <div className="w-1/2 h-full flex items-center justify-center bg-white p-6 overflow-hidden">
          <div className="relative w-full max-w-[480px] max-h-[85vh] aspect-[4/5]">
            <Image
              src="/assets/cover/cover-right.png"
              alt="Wedding Cover Decor"
              fill
              sizes="480px"
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </>
  );
}
