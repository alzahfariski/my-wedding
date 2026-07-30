'use client';

import React from 'react';

export const HeroCoverSection: React.FC = () => {
  return (
    <section className="cover">
      <div className="bg-cover">
        <div className="image-wrap">
          <img src="/assets/v1/cover/bg-cover.png" alt="orn-cover" />
        </div>
      </div>

      <div className="cover-mask"></div>

      <div className="ornaments-wrapper">
        <div className="orn-cover-1 top anim-ornament-1">
          <div className="image-wrap">
            <img src="/assets/v1/ornaments/Orn-slip.png" alt="Ornament" />
          </div>
        </div>
      </div>

      <div className="inner">
        {/* Outer Decorative Ornaments */}
        <div className="ornaments-wrapper">
          <div className="orn-cover-14 right anim-ornament-1">
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-17.png" alt="Ornament" />
            </div>
          </div>
          <div className="orn-cover-14 left anim-ornament-1">
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-17.png" alt="Ornament" />
            </div>
          </div>

          <div className="orn-cover-12 right anim-ornament-1">
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-15.png" alt="Ornament" />
            </div>
          </div>
          <div className="orn-cover-12 left anim-ornament-1">
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-15.png" alt="Ornament" />
            </div>
          </div>

          <div className="orn-cover-13 right anim-ornament-2">
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-16.png" alt="Ornament" />
            </div>
          </div>
          <div className="orn-cover-13 left anim-ornament-2">
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-16.png" alt="Ornament" />
            </div>
          </div>

          <div className="orn-cover-11 right anim-ornament-2">
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-14.png" alt="Ornament" />
            </div>
          </div>
          <div className="orn-cover-9 left anim-ornament-2">
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-12.png" alt="Ornament" />
            </div>
          </div>
          <div className="orn-cover-10 left anim-ornament-2">
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-13.png" alt="Ornament" />
            </div>
          </div>
        </div>

        {/* Step 1: Head Title */}
        <div className="head anim-head">
          <p className="sub-title">The Wedding of</p>
          <h1 className="main-title">Effri<br />&amp;<br />Alzah</h1>
        </div>

        {/* Step 2: Frame & Photo Container */}
        <div className="body highlight">
          <div className="orn-cover-frame">
            <div className="orn-cover-8 left anim-ornament-2">
              <div className="image-wrap">
                <img src="/assets/v1/ornaments/Orn-11.png" alt="" />
              </div>
            </div>
            <div className="orn-cover-7 left anim-ornament-2">
              <div className="image-wrap">
                <img src="/assets/v1/ornaments/Orn-10.png" alt="" />
              </div>
            </div>
            <div className="orn-cover-7 right anim-ornament-2">
              <div className="image-wrap">
                <img src="/assets/v1/ornaments/Orn-09.png" alt="" />
              </div>
            </div>

            {/* Photo Container (anim-photo) */}
            <div className="cover-frame anim-photo" id="coverFrame">
              <div className="cover-picture cover-show" id="cover-main">
                <div className="picture desktop">
                  <img src="/assets/v1/cover/sampul-desktop.png" alt="Effri & Alzah Desktop" />
                </div>
                <div className="picture mobile">
                  <img src="/assets/v1/cover/sampul-mobile.png" alt="Effri & Alzah Mobile" />
                </div>
              </div>
            </div>

            {/* Frame Outline (anim-frame) */}
            <div className="image-wrap anim-frame">
              <img src="/assets/v1/cover/frame-cover.png" alt="Cover Frame" />
            </div>

            <div className="orn-cover-3 center anim-ornament-2">
              <div className="image-wrap">
                <img src="/assets/v1/ornaments/Orn-04.png" alt="" />
              </div>
            </div>

            <div className="orn-cover-4 left anim-ornament-2">
              <div className="image-wrap">
                <img src="/assets/v1/ornaments/Orn-05.png" alt="" />
              </div>
            </div>

            <div className="orn-cover-2 right anim-ornament-2">
              <div className="orn-cover-2-1">
                <div className="image-wrap">
                  <img src="/assets/v1/ornaments/Orn-03.png" alt="" />
                </div>
              </div>
              <div className="image-wrap">
                <img src="/assets/v1/ornaments/Orn-02.png" alt="" />
              </div>
            </div>
          </div>
        </div>

        <div className="ornaments-wrapper">
          <div className="orn-cover-5 right anim-ornament-2">
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-06.png" alt="Ornament" />
            </div>
          </div>
          <div className="orn-cover-6 left anim-ornament-2">
            <div className="orn-cover-6-1">
              <div className="image-wrap">
                <img src="/assets/v1/ornaments/Orn-08.png" alt="Ornament" />
              </div>
            </div>
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-07.png" alt="Ornament" />
            </div>
          </div>
          <div className="orn-cover-15 burung-1 anim-ornament-2">
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-burung-1.png" alt="Ornament" />
            </div>
          </div>
          <div className="orn-cover-16 burung-2 anim-ornament-2">
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-burung-2.png" alt="Ornament" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
