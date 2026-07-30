'use client';

import React, { useState, useEffect } from 'react';
import { PrimaryPane } from '@/components/v1/PrimaryPane';
import { TopCover } from '@/components/v1/TopCover';
import { HeroCoverSection } from '@/components/v1/HeroCoverSection';
import { GroomBrideSection } from '@/components/v1/GroomBrideSection';
import { GallerySection } from '@/components/v1/GallerySection';
import { SaveDateSection } from '@/components/v1/SaveDateSection';
import { AgendaSection } from '@/components/v1/AgendaSection';
import { WeddingGiftSection } from '@/components/v1/WeddingGiftSection';
import { WeddingWishSection } from '@/components/v1/WeddingWishSection';
import { QuoteSecSection } from '@/components/v1/QuoteSecSection';
import { QuoteMessageSection } from '@/components/v1/QuoteMessageSection';
import { MusicPlayer } from '@/components/v1/MusicPlayer';

export default function V1Page() {
  const [isCoverOpen, setIsCoverOpen] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize AOS (Animate On Scroll)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://anselmaalvaro.katsudoto.id/plugin/aos/dist/aos.js';
      script.async = true;
      script.onload = () => {
        if ((window as any).AOS) {
          (window as any).AOS.init({
            duration: 1000,
            once: false,
            mirror: true,
          });
        }
      };
      document.body.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, []);

  // Auto-play music & open cover upon user scroll interaction
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let hasStarted = false;

    const handleUserInteraction = () => {
      if (!hasStarted) {
        hasStarted = true;
        setIsCoverOpen(false);
        setIsPlaying(true);

        setTimeout(() => {
          if ((window as any).AOS) {
            (window as any).AOS.refresh();
          }
        }, 300);

        // Cleanup listeners after first interaction
        window.removeEventListener('scroll', handleUserInteraction);
        window.removeEventListener('wheel', handleUserInteraction);
        window.removeEventListener('touchmove', handleUserInteraction);

        const secPane = document.querySelector('.secondary-pane');
        if (secPane) {
          secPane.removeEventListener('scroll', handleUserInteraction);
        }
      }
    };

    window.addEventListener('scroll', handleUserInteraction, { passive: true });
    window.addEventListener('wheel', handleUserInteraction, { passive: true });
    window.addEventListener('touchmove', handleUserInteraction, { passive: true });

    const secPane = document.querySelector('.secondary-pane');
    if (secPane) {
      secPane.addEventListener('scroll', handleUserInteraction, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', handleUserInteraction);
      window.removeEventListener('wheel', handleUserInteraction);
      window.removeEventListener('touchmove', handleUserInteraction);
      if (secPane) {
        secPane.removeEventListener('scroll', handleUserInteraction);
      }
    };
  }, []);

  const handleOpenInvitation = () => {
    setIsCoverOpen(false);
    setIsPlaying(true);

    setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).AOS) {
        (window as any).AOS.refresh();
      }
    }, 300);
  };

  return (
    <div className={`v1-main-container ${isCoverOpen ? 'cover-active' : 'cover-opened'}`}>
      <section className="kat-page__side-to-side">
        {/* Desktop Left Sidebar Pane */}
        <PrimaryPane />

        {/* Desktop Right Main Pane & Mobile View */}
        <section className={`secondary-pane ${isCoverOpen ? '' : 'opened'}`}>
          {isCoverOpen && <TopCover onOpen={handleOpenInvitation} />}
          <HeroCoverSection />
          <GroomBrideSection />
          <GallerySection />
          <SaveDateSection />
          <AgendaSection />
          <WeddingGiftSection />
          <WeddingWishSection />
          <QuoteSecSection />
          <QuoteMessageSection />
        </section>
      </section>

      {/* Floating Music Player Toggle */}
      <MusicPlayer
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
      />
    </div>
  );
}