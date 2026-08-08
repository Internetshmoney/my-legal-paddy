'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, Moon, Search, X, Sun } from 'lucide-react';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Articles', href: '/articles' },
  { label: 'Tutors', href: '/tutors' },
  { label: 'About', href: '#' },
  { label: 'Contact', href: '#' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/60">
      <div className="mx-auto flex h-[116px] w-full max-w-[1280px] items-center justify-between px-6">
                <Link href="/" className="inline-flex h-28 min-w-[320px] items-center gap-4 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#c9b974]/35 sm:min-w-[380px]">
          <Image
            src="/brand/my-legal-paddy-dark.png"
            alt=""
            width={384}
            height={576}
            priority
            className="h-36 w-auto object-contain dark:hidden sm:h-40"
          />
          <Image
            src="/brand/my-legal-paddy-light.png"
            alt=""
            width={384}
            height={576}
            priority
            className="hidden h-36 w-auto object-contain dark:block sm:h-40"
          />
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="whitespace-nowrap text-base font-semibold uppercase text-black dark:text-white sm:text-lg">
              MY LEGAL PADDY
            </span>
            <span className="whitespace-nowrap text-xs font-medium text-[#8f7d4d] dark:text-[#d8ca92] sm:text-sm">
              The Law Students&apos; Friend
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
                    {links.map((link) => {
            const isActive = link.label === 'Home';
            return (
              <Link
                key={link.label}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={`group relative text-sm transition-colors duration-200 ${
                  isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <span className="relative z-10">{link.label}</span>
                <span className={`absolute left-0 -bottom-1 h-[2px] w-0 bg-[#C9B974] transition-all duration-300 ease-out group-hover:w-full ${isActive ? 'w-full' : ''}`} />
              </Link>
            );
          })}

        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Search"
            className="inline-flex h-10 w-10 min-w-[40px] items-center justify-center rounded-full text-zinc-700 dark:text-zinc-200 transition-all duration-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Search size={18} />
          </button>

          <button
            type="button"
            aria-label="Theme placeholder"
            className="hidden h-10 w-10 min-w-[40px] items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 transition-all duration-200 sm:inline-flex"
          >
            <Moon size={18} />
          </button>

          <a
            href="#"
            className="hidden min-w-[120px] items-center justify-center rounded-full bg-[#C9B974] px-5 py-2 text-sm font-semibold text-black transition-colors duration-200 hover:bg-[#bfa76a] md:inline-flex"
            aria-label="Subscribe"
          >
            Subscribe
          </a>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            className="inline-flex h-10 w-10 min-w-[40px] items-center justify-center rounded-md border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 transition-all duration-200 hover:border-zinc-900 md:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile full-screen slide-down menu */}
      <div
        className={`fixed inset-x-0 top-0 z-40 h-screen w-full transform bg-white/95 dark:bg-black/95 backdrop-blur transition-transform duration-500 ease-in-out md:hidden ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div className="mx-auto flex h-full max-w-[1280px] flex-col justify-between px-6 pt-20 pb-12">
                    <nav className="flex flex-col gap-6">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl font-medium text-zinc-900 dark:text-zinc-100 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex w-full flex-col items-center gap-4">
            <a
              href="#"
              className="inline-flex w-full max-w-md items-center justify-center rounded-full bg-[#C9B974] px-6 py-4 text-lg font-semibold text-black transition-colors duration-200 hover:bg-[#bfa76a]"
              onClick={() => setIsMenuOpen(false)}
            >
              Subscribe
            </a>

            <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
              <button className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-700 p-3">
                <Search size={16} />
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-700 p-3">
                <Sun size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
