"use client";

import { useState } from "react";
import Image from "next/image";
import GalleryDetailModal from "./GalleryDetailModal";

export default function GallerySection() {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const handleOpenLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const handleCloseLightbox = () => {
    setSelectedPhotoIndex(null);
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
        }}
        className="left-[1532px] top-[1127px] font-alex text-[128px] rotate-[-8deg] font-normal text-[#737373] leading-relaxed select-none"
      >
        Our Gallery
      </div>

      {/* Gallery 1 */}
      <div
        style={{
          position: "absolute",
          left: "1510px",
          top: "1831px",
        }}
        className="w-[450px] h-[200px] transition-transform duration-300 hover:scale-105 cursor-pointer group select-none"
        onClick={() => handleOpenLightbox(0)}
      >
        <Image
          src="/assets/gallery/gallery_1.png"
          alt="Gallery 1"
          fill
          className="object-cover rounded-lg group-hover:brightness-105 transition-all"
          priority
          unoptimized
        />
      </div>

      {/* Gallery 2 */}
      <div
        style={{
          position: "absolute",
          left: "1994px",
          top: "1847px",
        }}
        className="w-[150px] h-[200px] transition-transform duration-300 hover:scale-105 cursor-pointer group select-none"
        onClick={() => handleOpenLightbox(1)}
      >
        <Image
          src="/assets/gallery/gallery_2.png"
          alt="Gallery 2"
          fill
          className="object-cover rounded-lg group-hover:brightness-105 transition-all"
          priority
          unoptimized
        />
      </div>

      {/* Gallery 3 */}
      <div
        style={{
          position: "absolute",
          left: "1894px",
          top: "1612px",
        }}
        className="w-[300px] h-[200px] transition-transform duration-300 hover:scale-105 cursor-pointer group select-none"
        onClick={() => handleOpenLightbox(2)}
      >
        <Image
          src="/assets/gallery/gallery_3.png"
          alt="Gallery 3"
          fill
          className="object-cover rounded-lg group-hover:brightness-105 transition-all"
          priority
          unoptimized
        />
      </div>

      {/* Gallery 4 */}
      <div
        style={{
          position: "absolute",
          left: "1555px",
          top: "1472px",
        }}
        className="w-[300px] h-[340px] transition-transform duration-300 hover:scale-105 cursor-pointer group select-none"
        onClick={() => handleOpenLightbox(3)}
      >
        <Image
          src="/assets/gallery/gallery_4.png"
          alt="Gallery 4"
          fill
          className="object-cover rounded-lg group-hover:brightness-105 transition-all"
          priority
          unoptimized
        />
      </div>

      {/* Gallery 5 */}
      <div
        style={{
          position: "absolute",
          left: "1876px",
          top: "1296px",
        }}
        className="w-[300px] h-[300px] transition-transform duration-300 hover:scale-105 cursor-pointer group select-none"
        onClick={() => handleOpenLightbox(4)}
      >
        <Image
          src="/assets/gallery/gallery_5.png"
          alt="Gallery 5"
          fill
          className="object-cover rounded-lg group-hover:brightness-105 transition-all"
          priority
          unoptimized
        />
      </div>

      {/* Gallery 6 */}
      <div
        style={{
          position: "absolute",
          left: "1549px",
          top: "1296px",
        }}
        className="w-[300px] h-[160px] transition-transform duration-300 hover:scale-105 cursor-pointer group select-none"
        onClick={() => handleOpenLightbox(5)}
      >
        <Image
          src="/assets/gallery/gallery_6.png"
          alt="Gallery 6"
          fill
          className="object-cover rounded-lg group-hover:brightness-105 transition-all"
          priority
          unoptimized
        />
      </div>

      {/* Balloon Decorative Element */}
      <div
        style={{
          position: "absolute",
          left: "1408px",
          top: "1653px",
        }}
        className="w-[214px] h-[214px] transition-transform duration-300 hover:scale-105 select-none"
      >
        <Image
          src="/assets/images/img_6.png"
          alt="baloon"
          fill
          className="object-cover"
          priority
          unoptimized
        />
      </div>

      {/* Gallery Detail Lightbox Modal */}
      <GalleryDetailModal
        isOpen={selectedPhotoIndex !== null}
        initialIndex={selectedPhotoIndex ?? 0}
        onClose={handleCloseLightbox}
      />
    </>
  );
}
