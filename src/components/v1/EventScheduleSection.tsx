'use client';

import React, { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const EventScheduleSection: React.FC = () => {
  // Target date: June 13, 2025 07:30:00 UTC+7 (1749873600 Unix timestamp)
  const targetDate = new Date('2025-06-13T07:30:00+07:00').getTime();

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const mapsUrl = "https://maps.google.com/?q=Pullman+Bandung+Grand+Central";

  return (
    <>
      {/* Save The Date / Countdown */}
      <section className="save-date-wrap">
        <div className="save-date-head text-center my-6">
          <h1 className="save-date-title font-serif text-2xl md:text-3xl text-amber-900">
            Time is Knocking at the door
          </h1>
        </div>

        <div className="save-date">
          <div className="save-date-body">
            <div className="countdown grid grid-cols-4 gap-2 max-w-xs mx-auto text-center my-6">
              <div className="count-item bg-amber-50/80 p-3 rounded-lg border border-amber-200 shadow-sm">
                <h2 className="count-num count-day text-2xl font-bold text-amber-900">
                  {timeLeft.days}
                </h2>
                <span className="text-[10px] uppercase tracking-wider text-amber-800">Days</span>
              </div>
              <div className="count-item bg-amber-50/80 p-3 rounded-lg border border-amber-200 shadow-sm">
                <h2 className="count-num count-hour text-2xl font-bold text-amber-900">
                  {timeLeft.hours}
                </h2>
                <span className="text-[10px] uppercase tracking-wider text-amber-800">Hours</span>
              </div>
              <div className="count-item bg-amber-50/80 p-3 rounded-lg border border-amber-200 shadow-sm">
                <h2 className="count-num count-minute text-2xl font-bold text-amber-900">
                  {timeLeft.minutes}
                </h2>
                <span className="text-[10px] uppercase tracking-wider text-amber-800">Minutes</span>
              </div>
              <div className="count-item bg-amber-50/80 p-3 rounded-lg border border-amber-200 shadow-sm">
                <h2 className="count-num count-second text-2xl font-bold text-amber-900">
                  {timeLeft.seconds}
                </h2>
                <span className="text-[10px] uppercase tracking-wider text-amber-800">Seconds</span>
              </div>
            </div>

            <div className="add-to-calendar-wrap text-center my-4">
              <a
                className="add-to-calendar inline-block bg-amber-900 text-white text-xs px-5 py-2.5 rounded-full uppercase tracking-wider shadow hover:bg-amber-800 transition-colors"
                id="addToCalendar"
                href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Effri+%26+Alzah+Wedding&dates=20250614T040000Z/20250614T070000Z&details=Wedding+Reception+Effri+%26+Alzah&location=Pullman+Bandung+Grand+Central"
                target="_blank"
                rel="noopener noreferrer"
              >
                Add to Calendar
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Agenda Events */}
      <section className="agenda-wrap py-10">
        <div className="agenda-inner">
          <div className="agenda-head text-center mb-8">
            <h2 className="agenda-title font-serif text-3xl text-amber-900">
              Love is Calling,
            </h2>
            <p className="agenda-description text-sm tracking-widest text-amber-800 uppercase mt-1">
              Save the Date!
            </p>
          </div>

          <div className="agenda-body space-y-8 max-w-md mx-auto">
            {/* Event 0: Akad Nikah */}
            <div className="event-item ev-0 bg-white/90 p-6 rounded-2xl border border-amber-200/80 shadow-md text-center">
              <div className="activity-title-wrap mb-2">
                <h3 className="activity-title font-serif text-2xl text-amber-900">
                  Akad Nikah
                </h3>
                <p className="ev-day text-sm text-gray-700 mt-1 font-semibold">
                  Friday, June 13 2025
                </p>
                <p className="activity-time text-xs text-amber-800 mt-1">
                  07:30 - 10:30 WIB
                </p>
              </div>
              <p className="activity-description text-xs text-gray-600 mt-3 leading-relaxed">
                With Gratitude to the Almighty, the Wedding ceremony will be held on Friday, June 13th 2025, witnessed by family and dear friends.
              </p>
            </div>

            {/* Event 1: Reception */}
            <div className="event-item ev-1 bg-white/90 p-6 rounded-2xl border border-amber-200/80 shadow-md text-center">
              <div className="activity-title-wrap mb-2">
                <h3 className="activity-title font-serif text-2xl text-amber-900">
                  Reception
                </h3>
                <p className="ev-day text-sm text-gray-700 mt-1 font-semibold">
                  Saturday, June 14 2025
                </p>
                <p className="activity-time text-xs text-amber-800 mt-1">
                  11:00 - 14:00 WIB
                </p>
              </div>

              <div className="activity-details my-3">
                <p className="activity-hall font-bold text-sm text-gray-800">
                  Ballroom - Pullman Bandung Grand Central
                </p>
                <p className="activity-address text-xs text-gray-600 mt-1">
                  JI. Poros, Rt. 015, Desa Mekar Jaya (SPG) Kec.Tabir Selaran, Merangin, Jambi
                </p>
              </div>

              <div className="activity-link-wrap mt-4">
                <a
                  className="activity-link inline-flex items-center gap-1.5 bg-amber-800 hover:bg-amber-900 text-white text-xs px-4 py-2 rounded-full shadow transition-colors"
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fas fa-map-marker-alt"></i> View Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
