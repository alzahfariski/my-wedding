'use client';

import React, { useState, useEffect } from 'react';

export const SaveDateSection: React.FC = () => {
  const targetDate = new Date('2026-08-05T09:00:00+07:00').getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <section className="save-date-wrap">
      <div className="ornaments-wrapper">
        <div className="orn-sd-bg">
          <div className="image-wrap">
            <img src="/assets/v1/ornaments/bg-sd.png" alt="" />
          </div>
        </div>
      </div>
      <div className="save-date-head">
        <h1 className="save-date-title">Time is Knocking at the door</h1>
      </div>

      <div className="save-date-frame">
        <div className="ornaments-wrapper">
          <div className="orn-sd-5">
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-36.png" alt="" />
            </div>
          </div>
        </div>

        <div className="image-wrap">
          <img src="/assets/v1/ornaments/frame-sd.png" alt="" />
        </div>

        <div className="ornaments-wrapper">
          <div className="orn-sd-4">
            <div className="orn-sd-4-1">
              <div className="image-wrap">
                <img src="/assets/v1/ornaments/Orn-35.png" alt="" />
              </div>
            </div>
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-34.png" alt="" />
            </div>
          </div>
          <div className="orn-sd-3">
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-14.png" alt="" />
            </div>
          </div>
          <div className="orn-sd-2">
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-33.png" alt="" />
            </div>
          </div>
          <div className="orn-sd-1">
            <div className="orn-sd-1-1">
              <div className="image-wrap">
                <img src="/assets/v1/ornaments/Orn-11.png" alt="" />
              </div>
            </div>
            <div className="image-wrap">
              <img src="/assets/v1/ornaments/Orn-32.png" alt="" />
            </div>
          </div>
        </div>

        <div className="save-date">
          <div className="save-date-body">
            <div className="countdown">
              <div className="count-item">
                <h2 className="count-num count-day">{timeLeft.days}</h2>
                <small className="count-text">Days</small>
              </div>
              <div className="count-item">
                <h2 className="count-num count-hour">{timeLeft.hours}</h2>
                <small className="count-text">Hours</small>
              </div>
              <div className="count-item">
                <h2 className="count-num count-minute">{timeLeft.minutes}</h2>
                <small className="count-text">Minutes</small>
              </div>
              <div className="count-item">
                <h2 className="count-num count-second">{timeLeft.seconds}</h2>
                <small className="count-text">Seconds</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="add-to-calendar-wrap">
        <a
          className="add-to-calendar"
          href="https://www.google.com/calendar/render?action=TEMPLATE&amp;text=Effri+%26+Alzah+Wedding&amp;dates=20260805T090000/20260805T150000&amp;details=Hi%2C+You%27re+invited+to+our+wedding+ceremony+%7C+Effri+%26+Alzah+Wedding+%7C+Wednesday%2C+August+5th+2026"
          target="_blank"
          rel="noopener noreferrer"
          id="addToCalendar"
        >
          Add to Calendar
        </a>
      </div>
    </section>
  );
};
