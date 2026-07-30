'use client';

import React from 'react';

export const QuoteMessageSection: React.FC = () => {
  return (
    <section className="quote-message-wrap">
      <div className="orn-clip-mask">
        <div className="image-wrap">
          <img src="/assets/v1/ornaments/Orn-clip.png" alt="Ornament" />
        </div>
      </div>

      <div className="quote-message">
        <div className="quote-message-inner-wrap">
          <div className="quote-message-inner">
            <div className="orn-agenda-top">
              <div className="image-wrap">
                <img src="/assets/v1/ornaments/Orn-01.png" alt="orn-cover" />
              </div>
            </div>
            <h1 className="quote-message-title zin-3">Thank you</h1>
            <p className="quote-message-desc zin-3">
              We would like to express our gratitude for your presence and prayers in this special moment of ours.
              We hope that you will be willing to attend and enjoy the entire series of our events.
            </p>
          </div>

          <div className="ornaments-wrapper">
            <div className="orn-qm-4 right">
              <div className="orn-qm-4-1">
                <div className="image-wrap">
                  <img src="/assets/v1/ornaments/Orn-14.png" alt="" />
                </div>
              </div>
              <div className="image-wrap">
                <img src="/assets/v1/ornaments/Orn-24.png" alt="" />
              </div>
            </div>
            <div className="orn-qm-4 left">
              <div className="orn-qm-4-1">
                <div className="image-wrap">
                  <img src="/assets/v1/ornaments/Orn-14.png" alt="" />
                </div>
              </div>
              <div className="image-wrap">
                <img src="/assets/v1/ornaments/Orn-24.png" alt="" />
              </div>
            </div>
            <div className="orn-qm-3 right">
              <div className="image-wrap">
                <img src="/assets/v1/ornaments/Orn-55.png" alt="" />
              </div>
            </div>
            <div className="orn-qm-3 left">
              <div className="image-wrap">
                <img src="/assets/v1/ornaments/Orn-55.png" alt="" />
              </div>
            </div>
            <div className="orn-qm-2 right">
              <div className="image-wrap">
                <img src="/assets/v1/ornaments/Orn-10.png" alt="" />
              </div>
            </div>
            <div className="orn-qm-2 left">
              <div className="image-wrap">
                <img src="/assets/v1/ornaments/Orn-09.png" alt="" />
              </div>
            </div>
            <div className="orn-qm-1 right">
              <div className="image-wrap">
                <img src="/assets/v1/ornaments/Orn-54.png" alt="" />
              </div>
            </div>
            <div className="orn-qm-1 left">
              <div className="image-wrap">
                <img src="/assets/v1/ornaments/Orn-54.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
