'use client';

import React, { useState } from 'react';

const GALLERY_PHOTOS = [
  "/assets/gallery/gallery_1.png",
  "/assets/gallery/gallery_2.png",
  "/assets/gallery/gallery_3.png",
  "/assets/gallery/gallery_4.png",
  "/assets/gallery/gallery_5.png",
  "/assets/gallery/gallery_6.png",
];

export const GallerySection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % GALLERY_PHOTOS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length);
  };

  const activePhoto = GALLERY_PHOTOS[currentIndex];

  return (
    <section className="photo-wrap">
      {/* Background Side Ornaments */}
      <div className="orn-photo-4 right">
        <div className="image-wrap">
          <img src="/assets/v1/ornaments/Orn-30.png" alt="Ornament Right" />
        </div>
      </div>
      <div className="orn-photo-4 left">
        <div className="image-wrap">
          <img src="/assets/v1/ornaments/Orn-30.png" alt="Ornament Left" />
        </div>
      </div>

      <div className="photo-inner">
        {/* Gallery Title */}
        <div className="photo-head">
          <h1 className="photo-title">Our Gallery</h1>
        </div>

        <div className="photo-body">
          <div className="photo-nav-wrap">
            {/* Main Featured Photo Preview */}
            <div className="photo-nav">
              <div className="photo-item active">
                <div className="preview-wrap">
                  {/* Top Ornaments */}
                  <div className="ornaments-wrapper">
                    <div className="orn-photo-3 right">
                      <div className="image-wrap">
                        <img src="/assets/v1/ornaments/Orn-11.png" alt="" />
                      </div>
                    </div>
                    <div className="orn-photo-3 left">
                      <div className="image-wrap">
                        <img src="/assets/v1/ornaments/Orn-11.png" alt="" />
                      </div>
                    </div>
                    <div className="orn-photo-2 right">
                      <div className="orn-photo-2-1">
                        <div className="image-wrap">
                          <img src="/assets/v1/ornaments/Orn-13.png" alt="" />
                        </div>
                      </div>
                      <div className="image-wrap">
                        <img src="/assets/v1/ornaments/Orn-46.png" alt="" />
                      </div>
                    </div>
                    <div className="orn-photo-2 left">
                      <div className="orn-photo-2-1">
                        <div className="image-wrap">
                          <img src="/assets/v1/ornaments/Orn-13.png" alt="" />
                        </div>
                      </div>
                      <div className="image-wrap">
                        <img src="/assets/v1/ornaments/Orn-46.png" alt="" />
                      </div>
                    </div>
                  </div>

                  {/* Main Preview Photo Container */}
                  <div
                    className="featured-photo-box cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <img
                      src={activePhoto}
                      alt="Featured Gallery Photo"
                      className="featured-photo-img"
                    />
                    <div className="zoom-hint-overlay">
                      <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm2.5-4h-2v2H9v-2H7V9.5h2v-2h1v2h2V10z" />
                      </svg>
                    </div>
                  </div>

                  {/* Bottom Ornaments */}
                  <div className="ornaments-wrapper">
                    <div className="orn-photo-1 right">
                      <div className="orn-photo-1-1">
                        <div className="image-wrap">
                          <img src="/assets/v1/ornaments/Orn-47.png" alt="" />
                        </div>
                      </div>
                    </div>
                    <div className="orn-photo-1 left">
                      <div className="orn-photo-1-1">
                        <div className="image-wrap">
                          <img src="/assets/v1/ornaments/Orn-47.png" alt="" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail Grid & Slider Controls */}
            <div className="photo-slider-wrap">
              <button
                type="button"
                className="photo-arrow prev"
                onClick={handlePrev}
                title="Previous Photo"
              >
                <svg className="w-8 h-8 fill-black" viewBox="0 0 24 24">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
              </button>

              <div className="photo-grid-container">
                {GALLERY_PHOTOS.map((photoUrl, idx) => (
                  <div
                    key={idx}
                    className={`thumb-card ${idx === currentIndex ? 'active-thumb' : ''}`}
                    onClick={() => setCurrentIndex(idx)}
                  >
                    <img
                      src={photoUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="thumb-img"
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="photo-arrow next"
                onClick={handleNext}
                title="Next Photo"
              >
                <svg className="w-8 h-8 fill-black" viewBox="0 0 24 24">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Zoom Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white hover:text-amber-400 p-2"
            onClick={() => setIsModalOpen(false)}
          >
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
          <img
            src={activePhoto}
            alt="Full Preview"
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </section>
  );
};
