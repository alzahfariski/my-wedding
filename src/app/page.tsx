"use client";

import { useState } from "react";
import Image from "next/image";
import LoadingScreen from "@/components/LoadingScreen";
import CinematicGate from "@/components/CinematicGate";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isGateMounted, setIsGateMounted] = useState(true);

  return (
    <>
      {/* Loading Screen */}
      {isLoading && <LoadingScreen onFinished={() => setIsLoading(false)} />}

      {/* Cinematic Gate Screen */}
      {!isLoading && isGateMounted && (
        <CinematicGate onOpen={() => setIsGateMounted(false)} />
      )}

      {/* Main Invitation Page Content */}
      <div
        className={`flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black transition-all duration-1000 ease-out ${
          isLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start shadow-sm border-x border-zinc-100 dark:border-zinc-900 min-h-screen">
          <div className="w-full flex justify-center sm:justify-start">
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={100}
              height={20}
              priority
            />
          </div>
          
          <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left my-auto">
            <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider text-rose-600 bg-rose-50 dark:bg-rose-950/30 dark:text-rose-400">
              Welcome to our Celebration
            </span>
            <h1 className="max-w-md text-4xl font-serif font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">
              Save the Date & Join Our Journey
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              We are excited to share our special day with you. Explore the details of our wedding invitation below.
            </p>
          </div>
          
          <div className="flex flex-col gap-4 text-base font-medium w-full sm:flex-row justify-center sm:justify-start">
            <button
              onClick={() => alert("Terima kasih sudah membuka undangan!")}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-rose-600 text-white transition-all hover:bg-rose-700 shadow-lg shadow-rose-200 dark:shadow-none md:w-[180px] cursor-pointer"
            >
              Buka Undangan
            </button>
            <a
              className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-zinc-200 px-5 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 md:w-[158px]"
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Lihat Detail
            </a>
          </div>
        </main>
      </div>
    </>
  );
}
