'use client';

import React, { useState, useEffect } from 'react';

interface TopCoverProps {
  onOpen: () => void;
}

export const TopCover: React.FC<TopCoverProps> = (props) => {
  const [guestName, setGuestName] = useState<string>('Tamu Undangan');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const toParam = params.get('to') || params.get('u') || params.get('nama');
      if (toParam) {
        setGuestName(toParam);
      }
    }
  }, []);

  const handleOpenClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    props.onOpen();
  };

  return (
    <section className="top-cover relative z-20">
      {/* Background Ornaments with pointer-events-none */}
      <div className="ornaments-wrapper pointer-events-none">
        <div className="orn-tc-1">
          <div className="image-wrap">
            <img src="/assets/v1/ornaments/Orn-61.png" alt="" />
          </div>
        </div>
        <div className="orn-tc-3">
          <div className="orn-tc-3-2 right">
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-63.png" alt="" />
            </div>
          </div>
          <div className="orn-tc-3-2 left">
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-63.png" alt="" />
            </div>
          </div>
          <div className="orn-tc-3-1 right">
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-17.png" alt="" />
            </div>
          </div>
          <div className="orn-tc-3-1 left">
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-17.png" alt="" />
            </div>
          </div>
          <div className="image-wrap">
            <img src="/assets/v1/ornaments/Orn-53.png" alt="" />
          </div>
        </div>
        <div className="orn-tc-2">
          <div className="image-wrap">
            <img src="/assets/v1/ornaments/Orn-62.png" alt="" />
          </div>
        </div>

        <div className="orn-tc-4 right">
          <div className="image-wrap">
            <img src="/assets/v1/ornaments/Orn-30.png" alt="" />
          </div>
        </div>

        <div className="orn-tc-4 left">
          <div className="image-wrap">
            <img src="/assets/v1/ornaments/Orn-30.png" alt="" />
          </div>
        </div>
      </div>

      <div className="inner relative z-30">
        <div className="orn-tc-wrapper">
          <div className="logo-wrap">
            <div className="image-wrap">
              <img src="/assets/v1/cover/logo.png" alt="" className="logo" />
            </div>
            <div className="orn-ff-log1 burung-1">
              <div className="image-wrap">
                <img src="/assets/v1/ornaments/Orn-burung-1.png" alt="Ornament" />
              </div>
            </div>
            <div className="orn-ff-log2 burung-2">
              <div className="image-wrap">
                <img src="/assets/v1/ornaments/Orn-burung-2.png" alt="Ornament" />
              </div>
            </div>
          </div>
          <div className="tct-wrap">
            <h1 className="top-cover-title" id="trig-tc">
              Effri<br />&amp;<br />Alzah
            </h1>
          </div>
        </div>

        {/* Guest Details with Solid White Card Background */}
        <div className="details relative z-40 my-4">
          <div
            className="guest-card-box bg-white p-5 rounded-2xl border border-amber-900/25 shadow-md max-w-xs mx-auto text-center"
            style={{
              opacity: 1,
              visibility: 'visible',
              backgroundColor: '#ffffff',
              zIndex: 45,
            }}
          >
            <p
              className="guest-salutation text-xs font-semibold text-[#784d2b] tracking-wider mb-1"
              style={{ opacity: 1, visibility: 'visible', color: '#784d2b' }}
            >
              Dear Mr/Mrs/Ms
            </p>
            <h2
              className="guest-name-title text-xl font-bold text-[#291c13] capitalize tracking-wide leading-tight"
              style={{ opacity: 1, visibility: 'visible', color: '#291c13' }}
            >
              {guestName}
            </h2>
          </div>

          {/* Interactive Open Invitation Button */}
          <div className="link-wrap mt-5 relative z-50 pointer-events-auto">
            <button
              type="button"
              className="link button-open-invitation px-8 py-3 bg-[#784d2b] hover:bg-[#5f3c21] text-white font-medium text-xs sm:text-sm rounded-xl shadow-md cursor-pointer transition-all active:scale-95 pointer-events-auto"
              id="startToExplore"
              onClick={handleOpenClick}
              onTouchEnd={handleOpenClick}
            >
              Click here !
            </button>
          </div>
        </div>
      </div>

      <div className="ornaments-wrapper pointer-events-none">
        <div className="orn-ff-4">
          <div className="orn-ff-4-2">
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-12.png" alt="" />
            </div>
          </div>
          <div className="image-wrap">
            <img src="/assets/v1/ornaments/Orn-23.png" alt="" />
          </div>
          <div className="orn-ff-4-1">
            <div className="orn-ff-4-1-1">
              <div className="image-wrap">
                <img src="/assets/v1/ornaments/Orn-16.png" alt="" />
              </div>
            </div>
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-60.png" alt="" />
            </div>
          </div>
        </div>
        <div className="orn-ff-3">
          <div className="image-wrap">
            <img src="/assets/v1/ornaments/Orn-46.png" alt="" />
          </div>
        </div>
        <div className="orn-ff-2">
          <div className="orn-ff-2-1">
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-59.png" alt="" />
            </div>
          </div>
          <div className="image-wrap">
            <img src="/assets/v1/ornaments/Orn-58.png" alt="" />
          </div>
        </div>
        <div className="orn-ff-1">
          <div className="orn-ff-1-3">
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-13.png" alt="" />
            </div>
          </div>
          <div className="orn-ff-1-2">
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-23.png" alt="" />
            </div>
            <div className="orn-ff-1-2-1">
              <div className="orn-ff-1-2-1-1">
                <div className="image-wrap">
                  <img src="/assets/v1/ornaments/Orn-34.png" alt="" />
                </div>
              </div>
              <div className="image-wrap">
                <img src="/assets/v1/ornaments/Orn-40.png" alt="" />
              </div>
            </div>
          </div>
          <div className="orn-ff-1-1">
            <div className="orn-ff-1-1-2">
              <div className="image-wrap">
                <img src="/assets/v1/ornaments/Orn-14.png" alt="" />
              </div>
            </div>
            <div className="orn-ff-1-1-1">
              <div className="image-wrap">
                <img src="/assets/v1/ornaments/Orn-35.png" alt="" />
              </div>
            </div>
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-57.png" alt="" />
            </div>
          </div>
          <div className="image-wrap">
            <img src="/assets/v1/ornaments/Orn-56.png" alt="" />
          </div>
        </div>
      </div>
    </section>
  );
};
