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
      {/* ===== MOBILE LAYOUT (scrollable single column) ===== */}
      <div className="md:hidden w-full min-h-dvh bg-white flex flex-col items-center overflow-y-auto select-none">

        {/* Cover Right Image — tampil di atas pada mobile */}
        <div className="relative w-full max-w-[85vw] aspect-[4/5] mt-10">
          <Image
            src="/assets/cover/cover-right.png"
            alt="Wedding Cover Decor"
            fill
            sizes="85vw"
            className="object-contain"
            priority
          />
        </div>

        {/* Content Section — viewport-responsive sizing */}
        <div className="flex flex-col items-start w-[75vw] max-w-[320px] mt-[5vw] pb-[8vw]">
          {/* Guest Greeting Header */}
          <p className="text-handwritten-title text-stone-500 tracking-wider text-[3.2vw] text-left">
            Dear Mr/Mrs/Ms
          </p>

          {/* Dynamic Guest Name Card Tag */}
          <div className="relative w-full aspect-[4/1] mt-[2vw] flex items-center justify-center">
            <Image
              src="/assets/cover/tagname.png"
              alt="Guest Name Tag Card"
              fill
              sizes="75vw"
              className="object-contain"
              priority
            />
            <span
              className="relative z-10 text-handwritten-body text-[#743951] font-bold px-[4vw] text-center text-[4.5vw] truncate max-w-[85%] leading-none mt-0.5"
              title={guestName}
            >
              {guestName}
            </span>
          </div>

          {/* Open Board Button */}
          <button
            onClick={onOpen}
            className="flex items-center gap-[2vw] px-[5vw] py-[2.5vw] mt-[5vw] bg-[#947268] text-white font-semibold rounded-full border border-white/60 shadow-lg shadow-[#947268]/20 hover:bg-[#836158] hover:shadow-xl hover:shadow-[#947268]/30 hover:scale-105 active:scale-95 transition-all duration-300 text-[3.5vw] tracking-wider cursor-pointer"
          >
            <FolderOpen className="w-[4vw] h-[4vw]" />
            <span>Open Board</span>
          </button>
        </div>

      </div>

      {/* ===== DESKTOP LAYOUT (50/50 side-by-side, fixed viewport) ===== */}
      <div className="hidden md:flex w-full h-dvh min-h-dvh bg-white flex-row overflow-hidden select-none">

        {/* Left Column — Letter card + text + button */}
        <div className="w-[50%] flex flex-col items-center justify-center p-8 h-full overflow-y-auto">

          {/* Cover Left Decor */}
          <div className="relative w-full max-w-[640px] aspect-[4/3] mb-6">
            <Image
              src="/assets/cover/cover-left.png"
              alt="Wedding Left Decor"
              fill
              sizes="640px"
              className="object-contain"
              priority
            />
          </div>

          {/* Content Wrapper — viewport-responsive sizing */}
          <div className="flex flex-col items-start w-[22vw] max-w-[360px] mt-[0.5vw]">
            <p className="text-handwritten-title text-stone-500 tracking-wider text-[1vw] text-left">
              Dear Mr/Mrs/Ms
            </p>

            <div className="relative w-full aspect-[4/1] mt-[0.5vw] flex items-center justify-center">
              <Image
                src="/assets/cover/tagname.png"
                alt="Guest Name Tag Card"
                fill
                sizes="22vw"
                className="object-contain"
                priority
              />
              <span
                className="relative z-10 text-handwritten-body text-[#743951] font-bold px-[2vw] text-center text-[1.4vw] truncate max-w-[85%] leading-none mt-0.5"
                title={guestName}
              >
                {guestName}
              </span>
            </div>

            <button
              onClick={onOpen}
              className="flex items-center gap-[0.5vw] px-[1.5vw] py-[0.7vw] mt-[1.5vw] bg-[#947268] text-white font-semibold rounded-full border border-white/60 shadow-lg shadow-[#947268]/20 hover:bg-[#836158] hover:shadow-xl hover:shadow-[#947268]/30 hover:scale-105 active:scale-95 transition-all duration-300 text-[0.9vw] tracking-wider cursor-pointer"
            >
              <FolderOpen className="w-[1.2vw] h-[1.2vw]" />
              <span>Open Board</span>
            </button>
          </div>

        </div>

        {/* Right Column — Cover right image */}
        <div className="w-[50%] h-full flex items-center justify-center bg-white p-8">
          <div className="relative w-full max-w-[90%] aspect-[4/5]">
            <Image
              src="/assets/cover/cover-right.png"
              alt="Wedding Cover Decor"
              fill
              sizes="45vw"
              className="object-contain"
              priority
            />
          </div>
        </div>

      </div>
    </>
  );
}
