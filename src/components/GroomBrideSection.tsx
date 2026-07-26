"use client";

import Image from "next/image";

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
          left: "494px",
          top: "1468px",
        }}
        className="w-[240px] h-[312px] md:w-[334px] md:h-[435px] transition-transform duration-300 hover:scale-105"
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
          left: "920px",
          top: "1304px",
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
          top: "1760px",
        }}
        className="left-[830px] md:left-[1033px] font-kalam text-[24px] md:text-[32px] font-normal text-[#743951] leading-none select-none"
      >
        The Bride
      </div>

      <div
        style={{
          position: "absolute",
        }}
        className="left-[830px] md:left-[1033px] top-[1795px] md:top-[1800px] w-[180px] md:w-[204px] font-kalam text-[12px] md:text-[14px] font-normal text-[#743951] leading-relaxed select-none"
      >
        Putri dari Bapak Suyitno (banjir) & Ibu Pujirah
      </div>
    </>
  );
}
