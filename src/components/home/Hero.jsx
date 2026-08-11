"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const heroImages = [
  { src: '/team/law-students-group.jpg', alt: 'Law students dressed for legal training outside their university' },
  { src: '/team/law-students-four.jpg', alt: 'Four women law students dressed in black legal attire' },
];

export default function Hero() {
  return (
    <section className="w-full overflow-hidden border-b border-black/10 bg-white py-12 dark:border-white/10 dark:bg-zinc-950 sm:py-20 lg:py-28">
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        :global {
          @keyframes floatY {
            0% { transform: translateY(-6px); }
            50% { transform: translateY(6px); }
            100% { transform: translateY(-6px); }
          }
        }
      `}</style>
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="max-w-2xl animate-[fadeIn_0.8s_ease-out_forwards]">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
            My Legal Paddy
          </p>
          <h1 className="text-3xl font-semibold leading-tight tracking-[-0.02em] text-zinc-950 dark:text-white min-[380px]:text-4xl sm:text-5xl lg:text-6xl">
            Legal Insight. Career Direction. Smarter Decisions.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-300 sm:mt-6 sm:text-xl sm:leading-8">
            A refined platform for law students and early-career legal professionals seeking clarity, direction, and thoughtful guidance.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/articles"
              className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-800"
            >
              Explore Articles
            </Link>
            <Link
              href="/career-prediction"
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium text-zinc-800 transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-900 hover:text-zinc-950"
            >
              Try Career Prediction
            </Link>
          </div>
        </div>

        <div className="animate-[fadeInUp_0.9s_ease-out]">
          <div className="relative flex h-[300px] w-full items-center justify-center rounded-2xl min-[380px]:h-[340px] sm:h-[420px] lg:h-[520px]">
            {/* Muted gold glow behind images */}
            <div className="pointer-events-none absolute right-8 top-10 hidden h-80 w-80 translate-y-0 rounded-full bg-[#C9B974] opacity-10 blur-3xl md:block" />

            <ImageSlideshow />
          </div>
        </div>
      </div>
    </section>
  );
}

function ImageSlideshow() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!paused) {
      intervalRef.current = setInterval(() => {
        setIndex((i) => (i + 1) % heroImages.length);
      }, 4000);
    }
    return () => clearInterval(intervalRef.current);
  }, [paused]);

  return (
    <div
      className="relative flex h-full w-full items-center justify-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[3/4] h-full max-h-[500px] w-auto max-w-full overflow-hidden rounded-[1.5rem] border border-black/5 bg-white/90 shadow-[0_30px_60px_-40px_rgba(0,0,0,0.18)] sm:rounded-[2rem]">
        {heroImages.map(({ src, alt }, i) => (
          <div
            key={src}
            className={`absolute left-0 top-0 h-full w-full rounded-[2rem] transition-opacity duration-900 ease-in-out ${
              index === i ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            style={{ animation: 'floatY 6s ease-in-out infinite' }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="rounded-[1.5rem] object-cover object-center sm:rounded-[2rem]"
              sizes="(max-width: 640px) 225px, (max-width: 1024px) 315px, 375px"
              priority={i === 0}
            />
            {index === i && (
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] shadow-[0_20px_60px_-25px_rgba(0,0,0,0.25)]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
