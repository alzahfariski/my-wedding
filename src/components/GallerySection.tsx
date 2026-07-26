"use client";

import Image from "next/image";

export default function GallerySection() {
  // Gallery content development process (currently empty)
  return (<>

    <div
      style={{
        position: "absolute",
      }}
      className="left-[1232px] top-[1157px] font-alex text-[128px] rotate-[-8deg] font-normal text-[#737373] leading-relaxed select-none"
    >
      Our Gallery
    </div>

    <div
      style={{
        position: "absolute",
        left: "1350px",
        top: "1831px",
      }}
      className="w-[450px] h-[200px] transition-transform duration-300 hover:scale-105"
    >
      <Image
        src="/assets/gallery/gallery_1.png"
        alt="Gallery"
        fill
        className="object-cover"
        priority
        unoptimized
      />
    </div>

    <div
      style={{
        position: "absolute",
        left: "1834px",
        top: "1847px",
      }}
      className="w-[150px] h-[200px] transition-transform duration-300 hover:scale-105"
    >
      <Image
        src="/assets/gallery/gallery_2.png"
        alt="Gallery"
        fill
        className="object-cover"
        priority
        unoptimized
      />
    </div>

    <div
      style={{
        position: "absolute",
        left: "1734px",
        top: "1612px",
      }}
      className="w-[300px] h-[200px] transition-transform duration-300 hover:scale-105"
    >
      <Image
        src="/assets/gallery/gallery_3.png"
        alt="Gallery"
        fill
        className="object-cover"
        priority
        unoptimized
      />
    </div>

    <div
      style={{
        position: "absolute",
        left: "1395px",
        top: "1472px",
      }}
      className="w-[300px] h-[340px] transition-transform duration-300 hover:scale-105"
    >
      <Image
        src="/assets/gallery/gallery_4.png"
        alt="Gallery"
        fill
        className="object-cover"
        priority
        unoptimized
      />
    </div>

    <div
      style={{
        position: "absolute",
        left: "1716px",
        top: "1296px",
      }}
      className="w-[300px] h-[300px] transition-transform duration-300 hover:scale-105"
    >
      <Image
        src="/assets/gallery/gallery_5.png"
        alt="Gallery"
        fill
        className="object-cover"
        priority
        unoptimized
      />
    </div>

    <div
      style={{
        position: "absolute",
        left: "1369px",
        top: "1296px",
      }}
      className="w-[300px] h-[160px] transition-transform duration-300 hover:scale-105"
    >
      <Image
        src="/assets/gallery/gallery_6.png"
        alt="Gallery"
        fill
        className="object-cover"
        priority
        unoptimized
      />
    </div>
  </>);
}
