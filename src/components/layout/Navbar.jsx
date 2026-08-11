'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Moon, Search, X, Sun } from 'lucide-react';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Articles', href: '/articles' },
  { label: 'Tutors', href: '/tutors' },
  { label: 'Career Quiz', href: '/career-prediction' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

function subscribeToTheme(callback) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}

function getThemeSnapshot() {
  return document.documentElement.classList.contains('dark');
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isDark = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, () => false);
  const pathname = usePathname();

  function toggleTheme() {
    const next = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('mlp-theme', next ? 'dark' : 'light');
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/60">
      <div className="mx-auto flex h-20 w-full max-w-[1280px] items-center justify-between gap-1 px-3 sm:h-24 sm:gap-4 sm:px-6 lg:h-[116px]">
        <Link href="/" className="inline-flex min-w-0 flex-1 items-center gap-2 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#c9b974]/35 sm:gap-3 md:flex-none lg:gap-4">
          <Image
            src="/brand/my-legal-paddy-dark.png"
            alt=""
            width={384}
            height={576}
            priority
            className="h-14 w-auto shrink-0 object-contain dark:hidden sm:h-20 lg:h-36"
          />
          <Image
            src="/brand/my-legal-paddy-light.png"
            alt=""
            width={384}
            height={576}
            priority
            className="hidden h-14 w-auto shrink-0 object-contain dark:block sm:h-20 lg:h-36"
          />
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-sm font-semibold uppercase text-black dark:text-white sm:text-base lg:text-lg">
              MY LEGAL PADDY
            </span>
            <span className="truncate text-[10px] font-medium text-[#8f7d4d] dark:text-[#d8ca92] max-[360px]:hidden sm:text-xs lg:text-sm">
              The Law Students&apos; Friend
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
                    {links.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
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

        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          <Link
            href="/search"
            aria-label="Search articles"
            className="inline-flex h-9 w-9 min-w-9 items-center justify-center rounded-full text-zinc-700 transition-all duration-200 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800 sm:h-10 sm:w-10 sm:min-w-10"
          >
            <Search size={18} />
          </Link>

          <button
            type="button"
            aria-label={isDark ? 'Use light mode' : 'Use dark mode'}
            aria-pressed={isDark}
            onClick={toggleTheme}
            className="inline-flex h-9 w-9 min-w-9 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 transition-all duration-200 dark:border-zinc-700 dark:text-zinc-200 sm:h-10 sm:w-10 sm:min-w-10"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link
            href="/#newsletter"
            className="hidden min-w-[120px] items-center justify-center rounded-full bg-[#C9B974] px-5 py-2 text-sm font-semibold text-black transition-colors duration-200 hover:bg-[#bfa76a] md:inline-flex"
            aria-label="Subscribe"
          >
            Subscribe
          </Link>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            className="inline-flex h-9 w-9 min-w-9 items-center justify-center rounded-md border border-zinc-300 text-zinc-700 transition-all duration-200 hover:border-zinc-900 dark:border-zinc-700 dark:text-zinc-200 sm:h-10 sm:w-10 sm:min-w-10 md:hidden"
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
        <div className="mx-auto flex h-full max-w-[1280px] flex-col justify-between overflow-y-auto px-5 pb-8 pt-24 sm:px-6 sm:pb-12 sm:pt-28">
                    <nav className="flex flex-col gap-6">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-xl font-medium text-zinc-900 transition-colors duration-200 dark:text-zinc-100 sm:text-2xl"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex w-full flex-col items-center gap-4">
            <Link
              href="/#newsletter"
              className="inline-flex w-full max-w-md items-center justify-center rounded-full bg-[#C9B974] px-6 py-4 text-lg font-semibold text-black transition-colors duration-200 hover:bg-[#bfa76a]"
              onClick={() => setIsMenuOpen(false)}
            >
              Subscribe
            </Link>

            <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
              <Link href="/search" onClick={() => setIsMenuOpen(false)} aria-label="Search articles" className="inline-flex items-center gap-2 rounded-full border border-zinc-200 p-3 dark:border-zinc-700">
                <Search size={16} />
              </Link>
              <button type="button" onClick={toggleTheme} aria-label={isDark ? 'Use light mode' : 'Use dark mode'} className="inline-flex items-center gap-2 rounded-full border border-zinc-200 p-3 dark:border-zinc-700">
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
