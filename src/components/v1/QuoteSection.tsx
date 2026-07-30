'use client';

import React from 'react';

export const QuoteSection: React.FC = () => {
  return (
    <section className="quote-sec-wrap my-10 py-8 px-4 text-center bg-amber-900/5 border-y border-amber-200/60">
      <div className="quote-sec-inner max-w-lg mx-auto">
        <div className="quote-sec">
          <p className="quote-sec-caption font-serif italic text-sm md:text-base text-gray-800 leading-relaxed">
            &ldquo;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang&rdquo;
          </p>
          <p className="quote-sec-caption bottom text-xs font-semibold text-amber-900 mt-4 tracking-wider">
            (Qs. Ar-Rum: 21)
          </p>
        </div>
      </div>
    </section>
  );
};
