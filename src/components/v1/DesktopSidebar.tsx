'use client';

import React from 'react';

export const DesktopSidebar: React.FC = () => {
  return (
    <section className="secondary-pane">
      <div className="bg-cover">
        <div className="image-wrap">
          <img
            src="/assets/v1/cover/sampul-desktop.png"
            alt="Alzah & Effri Desktop Sidebar"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="cover-mask" />
      </div>

      <div className="inner text-center text-white z-10 p-8 flex flex-col justify-between h-full">
        <div className="head pt-12">
          <p className="sub-title uppercase tracking-widest text-xs mb-2">
            The Wedding of
          </p>
          <h1 className="title text-4xl md:text-5xl font-serif">
            Alzah &amp; Effri
          </h1>
          <p className="hashtag text-sm tracking-widest mt-2 opacity-90 font-serif">
            #AlzahEffri
          </p>
        </div>

        <div className="footer-date pb-12">
          <p className="date-str text-sm uppercase tracking-widest">
            Saturday, June 14th 2025
          </p>
        </div>
      </div>
    </section>
  );
};
