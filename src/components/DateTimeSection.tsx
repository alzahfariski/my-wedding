"use client";

import { useState, useEffect } from "react";
import { MapPin, Calendar } from "lucide-react";
import Image from "next/image";

interface DateTimeSectionProps {
  isMobile?: boolean;
}

export default function DateTimeSection({ isMobile = false }: DateTimeSectionProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = new Date("2026-08-05T09:00:00+07:00").getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const displayDays = mounted ? timeLeft.days : 0;
  const displayHours = mounted ? timeLeft.hours : 0;
  const displayMinutes = mounted ? timeLeft.minutes : 0;
  const displaySeconds = mounted ? timeLeft.seconds : 0;

  if (isMobile) {
    return (
      <section id="section-4" className="w-full flex flex-col items-center py-8 px-4 text-center select-none">
        <h2 className="font-alex text-5xl font-normal text-[#737373] mb-4">It’s the Day!</h2>

        {/* Location Row */}
        <div className="w-full max-w-sm flex items-center justify-center gap-2 mb-4 text-left">
          <div className="relative w-8 h-8 shrink-0">
            <Image
              src="/assets/icons/map.png"
              alt="Map Icon"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <p className="font-kalam text-sm font-normal text-[#000000] leading-snug">
            JI. Poros, Rt. 015, Desa Mekar Jaya (SPG) Merangin, Jambi
          </p>
        </div>

        {/* Calendar Image */}
        <div className="relative w-full max-w-xs h-[200px] overflow-hidden mb-4">
          <Image
            src="/assets/images/calendar.png"
            alt="Calendar"
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Countdown Section */}
        <h3 className="font-kalam text-2xl font-normal text-[#000000] mb-3">Save The Date</h3>
        
        <div className="grid grid-cols-4 gap-3 font-kalam mb-6 w-full max-w-xs">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-normal italic leading-none text-[#000000]">{displayDays}</span>
            <span className="text-xs font-light text-[#000000]">Days</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-normal italic leading-none text-[#000000]">{displayHours}</span>
            <span className="text-xs font-light text-[#000000]">Hours</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-normal italic leading-none text-[#000000]">{displayMinutes}</span>
            <span className="text-xs font-light text-[#000000]">Minutes</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-normal italic leading-none text-[#000000]">{displaySeconds}</span>
            <span className="text-xs font-light text-[#000000]">Seconds</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 w-full max-w-xs">
          <a
            href="https://www.google.com/maps/search/?api=1&query=JI.+Poros,+Rt.+015,+Desa+Mekar+Jaya+(SPG)+Merangin,+Jambi"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#947268] text-white font-normal rounded-full border border-white/60 shadow-lg shadow-[#947268]/20 font-kalam text-sm active:scale-95 transition-transform"
          >
            <MapPin className="w-4 h-4" />
            <span>View the Map</span>
          </a>

          <a
            href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+of+Putra+%26+Putri&dates=20260805T020000Z/20260805T060000Z&details=Pernikahan+Putra+%26+Putri.+Mohon+kehadiran+dan+doa+restunya.&location=JI.+Poros,+Rt.+015,+Desa+Mekar+Jaya+(SPG)+Merangin,+Jambi&sf=true&output=xml"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#743951] text-white font-normal rounded-full border border-white/60 shadow-lg shadow-[#743951]/20 font-kalam text-sm active:scale-95 transition-transform"
          >
            <Calendar className="w-4 h-4" />
            <span>Add to Calendar</span>
          </a>
        </div>
      </section>
    );
  }

  return (
    <>
      <div
        style={{
          position: "absolute",
        }}
        className="left-[1413px] top-[394px] font-alex text-[96px] font-normal text-[#737373] leading-relaxed select-none"
      >
        It’s the Day!
      </div>

      <div
        style={{
          position: "absolute",
          left: "1382px",
          top: "526px",
        }}
        className="w-[40px] h-[40px] transition-transform duration-300 hover:scale-105"
      >
        <Image
          src="/assets/icons/map.png"
          alt="Map Icon"
          fill
          className="object-cover"
          priority
          unoptimized
        />
      </div>


      <div
        style={{
          position: "absolute",
        }}
        className="left-[1439px]  top-[526px]  w-[476px] font-kalam text-[24px] font-normal text-[#000000] leading-relaxed select-none"
      >
        JI. Poros, Rt. 015, Desa Mekar Jaya (SPG) Merangin, Jambi
      </div>

      <div
        style={{
          position: "absolute",
        }}
        className="left-[1769px]  top-[646px]  font-kalam text-[36px] font-normal text-[#000000] leading-relaxed select-none"
      >
        Save The Date
      </div>

      <div
        style={{
          position: "absolute",
          left: "1244px",
          top: "636px",
        }}
        className="w-[476px] h-[336px] transition-transform duration-300 hover:scale-105"
      >
        <Image
          src="/assets/images/calendar.png"
          alt="calenda images"
          fill
          className="object-cover"
          priority
          unoptimized
        />
      </div>

      {/* Countdown Timer */}
      <div
        style={{
          position: "absolute",
          left: "1769px",
          top: "727px",
          width: "120px",
        }}
        className="flex flex-row items-center gap-x-6 text-center font-kalam select-none"
      >
        <div className="flex flex-col items-center">
          <span className="text-[36px] font-normal italic leading-[0.9] text-[#000000]">
            {displayDays}
          </span>
          <span className="text-[20px] font-light leading-normal text-[#000000]">
            Days
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[36px] font-normal italic leading-[0.9] text-[#000000]">
            {displayHours}
          </span>
          <span className="text-[20px] font-light leading-normal text-[#000000]">
            Hours
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[36px] font-normal italic leading-[0.9] text-[#000000]">
            {displayMinutes}
          </span>
          <span className="text-[20px] font-light leading-normal text-[#000000]">
            Minutes
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[36px] font-normal italic leading-[0.9] text-[#000000]">
            {displaySeconds}
          </span>
          <span className="text-[20px] font-light leading-normal text-[#000000]">
            Seconds
          </span>
        </div>
      </div>

      {/* Button: View the Map */}
      <a
        href="https://www.google.com/maps/search/?api=1&query=JI.+Poros,+Rt.+015,+Desa+Mekar+Jaya+(SPG)+Merangin,+Jambi"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "absolute",
          left: "1769px",
          top: "842px",
        }}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-[#947268] text-white font-semibold rounded-full border border-white/60 shadow-lg shadow-[#947268]/20 hover:bg-[#836158] hover:shadow-xl hover:shadow-[#947268]/30 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer select-none font-kalam text-[14px]"
      >
        <MapPin className="w-4 h-4" />
        <span>View the Map</span>
      </a>

      {/* Button: Add to Calendar */}
      <a
        href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+of+Putra+%26+Putri&dates=20260805T020000Z/20260805T060000Z&details=Pernikahan+Putra+%26+Putri.+Mohon+kehadiran+dan+doa+restunya.&location=JI.+Poros,+Rt.+015,+Desa+Mekar+Jaya+(SPG)+Merangin,+Jambi&sf=true&output=xml"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "absolute",
          left: "1929px",
          top: "842px",
        }}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-[#743951] text-white font-semibold rounded-full border border-white/60 shadow-lg shadow-[#743951]/20 hover:bg-[#5c2d40] hover:shadow-xl hover:shadow-[#743951]/30 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer select-none font-kalam text-[14px]"
      >
        <Calendar className="w-4 h-4" />
        <span>Add to Calendar</span>
      </a>
    </>
  );
}
