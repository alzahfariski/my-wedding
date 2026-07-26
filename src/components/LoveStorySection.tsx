"use client";

import Image from "next/image";

export default function LoveStorySection() {
  return (
    <>
      {/* Image 1: img_1.png at x=320 y=493 */}
      <div
        style={{
          position: "absolute",
          left: "320px",
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
          left: "244px",
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
    </>
  );
}
