"use client";

import Image from "next/image";

const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function GroomBrideSection() {
  return (
    <>
      {/* Image 3: img_3.png at x=282 y=1315 */}
      <div
        style={{
          position: "absolute",
          left: "282px",
          top: "1315px",
        }}
        className="w-[100px] h-[100px] md:w-[136px] md:h-[136px] transition-transform duration-300 hover:scale-105"
      >
        <Image
          src="/assets/images/img_3.png"
          alt="Groom and Bride Icon"
          fill
          className="object-cover"
          priority
          unoptimized
        />
      </div>

      {/* Image 4: img_4.png */}
      <div
        style={{
          position: "absolute",
          left: "514px",
          top: "1528px",
        }}
        className="w-[240px] h-[312px] md:w-[355px] md:h-[435px] transition-transform duration-300 hover:scale-105"
      >
        <Image
          src="/assets/images/img_4.png"
          alt="Groom"
          fill
          className="object-cover"
          priority
          unoptimized
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: "1680px",
        }}
        className="left-[301px] md:left-[301px] font-kalam text-[24px] md:text-[32px] font-normal text-[#743951] leading-none select-none"
      >
        The Groom
      </div>

      <div
        style={{
          position: "absolute",
          top: "1721px",
        }}
        className="left-[301px] md:left-[301px] w-[150px] md:w-[162px] font-kalam text-[12px] md:text-[14px] font-normal text-[#743951] leading-relaxed select-none"
      >
        Putra dari Bapak Sukardi & Ibu Fitri Lestari
      </div>

      <a
        href="https://www.instagram.com/alzahfariski/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "absolute",
          left: "291px",
          top: "1791px",
        }}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-[#947268] text-white font-normal rounded-full border border-white/60 shadow-lg shadow-[#947268]/20 hover:bg-[#836158] hover:shadow-xl hover:shadow-[#947268]/30 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer select-none font-kalam text-[16px]"
      >
        <InstagramIcon className="w-4.5 h-4.5" />
        <span>alzahfariski</span>
      </a>

      {/* Title: "The Groom & Bride" at x=415 y=1323 */}
      <div
        style={{
          position: "absolute",
          top: "1323px",
        }}
        className="left-[395px] md:left-[415px] font-kalam text-[24px] md:text-[32px] font-normal text-[#743951] leading-none select-none"
      >
        The Groom & Bride
      </div>

      {/* Body: "Our journey of love..." at x=415 y=1380 */}
      <div
        style={{
          position: "absolute",
        }}
        className="left-[395px] md:left-[415px] top-[1365px] md:top-[1380px] w-[220px] md:w-[480px] font-kalam text-[13px] md:text-[16px] font-normal text-stone-600 leading-relaxed select-none"
      >
        Our journey of love has led us to this beautiful moment, and we
        would love for you to be a part of it. Please join us as we say
        'I do' and celebrate this new chapter together!
      </div>

      {/* Image 5: img_5.png */}
      <div
        style={{
          position: "absolute",
          left: "900px",
          top: "1244px",
        }}
        className="w-[240px] h-[290px] md:w-[355px] md:h-[428px] transition-transform duration-300 hover:scale-105"
      >
        <Image
          src="/assets/images/img_5.png"
          alt="Bride"
          fill
          className="object-cover"
          priority
          unoptimized
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: "1700px",
        }}
        className="left-[810px] md:left-[1013px] font-kalam text-[24px] md:text-[32px] font-normal text-[#743951] leading-none select-none"
      >
        The Bride
      </div>

      <div
        style={{
          position: "absolute",
        }}
        className="left-[810px] md:left-[1013px] top-[1725px] md:top-[1740px] w-[160px] md:w-[184px] font-kalam text-[12px] md:text-[14px] font-normal text-[#743951] leading-relaxed select-none"
      >
        Putri dari Bapak Suyitno & Ibu Pujirah
      </div>

      <a
        href="https://www.instagram.com/effridwiyana/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "absolute",
          left: "1003px",
          top: "1800px",
        }}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-[#947268] text-white font-normal rounded-full border border-white/60 shadow-lg shadow-[#947268]/20 hover:bg-[#836158] hover:shadow-xl hover:shadow-[#947268]/30 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer select-none font-kalam text-[16px]"
      >
        <InstagramIcon className="w-4.5 h-4.5" />
        <span>effridwiyana</span>
      </a>

    </>
  );
}
