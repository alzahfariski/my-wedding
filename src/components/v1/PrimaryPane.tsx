'use client';

import React, { useState, useEffect } from 'react';

export const PrimaryPane: React.FC = () => {
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

  return (
    <section className="primary-pane">
      <div className="inner">
        <div className="ornaments-wrapper">
          <div className="orn-tc-1">
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-61.png" alt="" />
            </div>
          </div>
          <div className="orn-pp-2 right">
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-63.png" alt="" />
            </div>
          </div>
          <div className="orn-pp-2 left">
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-63.png" alt="" />
            </div>
          </div>
          <div className="orn-pp-1 right">
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-17.png" alt="" />
            </div>
          </div>
          <div className="orn-pp-1 left">
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-17.png" alt="" />
            </div>
          </div>
          <div className="orn-tc-3">
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-53.png" alt="" />
            </div>
          </div>
          <div className="orn-tc-2">
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-62.png" alt="" />
            </div>
          </div>
        </div>

        <div className="inner-wrapper">
          <div className="head-wrap">
            <div className="logo-wrap">
              <div className="image-wrap">
                <img src="/assets/v1/cover/logo.png" alt="" className="logo" />
              </div>
            </div>
          </div>

          {/* Solid Background Card for Guest Name */}
          <div
            className="details guest-card-box"
            style={{
              opacity: 1,
              visibility: 'visible',
              zIndex: 50,
              position: 'relative',
              backgroundColor: '#ffffff',
              border: '1px solid rgba(120, 77, 43, 0.25)',
              borderRadius: '16px',
              padding: '24px 32px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              margin: '24px auto',
              maxWidth: '340px',
              width: '90%',
              textAlign: 'center',
            }}
          >
            <p
              className="guest-salutation"
              style={{
                color: '#784d2b',
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '6px',
                letterSpacing: '0.5px',
                display: 'block',
              }}
            >
              Dear Mr/Mrs/Ms
            </p>
            <h2
              className="guest-name-title"
              style={{
                color: '#291c13',
                fontSize: '22px',
                fontWeight: 600,
                textTransform: 'capitalize',
                letterSpacing: '0.5px',
                lineHeight: 1.3,
                display: 'block',
              }}
            >
              {guestName}
            </h2>
          </div>

          <div className="ornaments-wrapper"></div>
        </div>

        <div className="ornaments-wrapper">
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
          <div className="orn-ff-3 right">
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-46.png" alt="" />
            </div>
          </div>
          <div className="orn-ff-3 left">
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
      </div>
    </section>
  );
};
