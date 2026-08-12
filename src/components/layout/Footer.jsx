import {
  ArrowUpRight,
  Mail,
  MapPin,
  MessageCircle,
  Music2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const exploreLinks = [
  { label: 'Home', href: '/' },
  { label: 'Articles', href: '/articles' },
  { label: 'Discover Your Legal Path', href: '/career-prediction' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];
const resourceLinks = [
  'Privacy Policy',
  'Terms of Use',
  'Cookie Policy',
  'Disclaimer',
];

const socialLinks = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/my-legal-paddy/', text: 'in' },
  { label: 'Instagram', href: '#', text: 'ig' },
  { label: 'X Twitter', href: '#', text: 'X' },
  { label: 'TikTok', href: '#', icon: Music2 },
  { label: 'WhatsApp', href: 'https://chat.whatsapp.com/DfYUhgx0DWAA22zkW3Nc7Z', icon: MessageCircle },
];

function FooterLink({ href = '#', children, className = '' }) {
  const baseClass = `group inline-flex w-fit items-center gap-1.5 text-sm leading-6 text-zinc-600 transition-all duration-300 hover:translate-x-0.5 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#c9b974]/35 dark:text-zinc-400 dark:hover:text-white ${className}`;

  if (typeof href === 'string' && href.startsWith('/')) {
    return (
      <Link href={href} className={baseClass}>
        <span>{children}</span>
        <span className="h-px w-0 bg-[#c9b974] transition-all duration-300 group-hover:w-4" aria-hidden="true" />
      </Link>
    );
  }

  return (
    <a href={href} className={baseClass}>
      <span>{children}</span>
      <span className="h-px w-0 bg-[#c9b974] transition-all duration-300 group-hover:w-4" aria-hidden="true" />
    </a>
  );
}

function FooterColumn({ title, children }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">{title}</h3>
      <div className="mt-5 flex flex-col gap-3">{children}</div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="w-full bg-[#f8f7f3] text-zinc-950 dark:bg-black dark:text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_0.7fr_0.7fr_0.85fr] lg:gap-12">
          <div className="min-w-0 max-w-md">
            <Link href="/" className="inline-flex max-w-full items-center gap-3 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#c9b974]/35 sm:gap-5">
              <Image
                src="/brand/my-legal-paddy-dark.png"
                alt=""
                width={384}
                height={576}
                className="h-28 w-auto shrink-0 object-contain dark:hidden sm:h-36 lg:h-48"
              />
              <Image
                src="/brand/my-legal-paddy-light.png"
                alt=""
                width={384}
                height={576}
                className="hidden h-28 w-auto shrink-0 object-contain dark:block sm:h-36 lg:h-48"
              />
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="truncate text-base font-semibold uppercase text-black dark:text-white sm:text-lg">
                  MY LEGAL PADDY
                </span>
                <span className="truncate text-xs font-medium text-[#8f7d4d] dark:text-[#d8ca92] sm:text-sm">
                  The Law Students&apos; Friend
                </span>
              </span>
            </Link>

            <p className="mt-6 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              Helping law students and young legal professionals discover opportunities, build careers and stay informed through thoughtful legal content and community.
            </p>

            <div className="mt-7 flex flex-wrap gap-3" aria-label="Social links">
              {socialLinks.map(({ label, href, icon: Icon, text }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-black/10 bg-white text-zinc-700 shadow-[0_14px_30px_-25px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c9b974]/70 hover:text-zinc-950 hover:shadow-[0_18px_35px_-24px_rgba(0,0,0,0.5)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#c9b974]/35 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:text-white"
                >
                  {Icon ? (
                    <Icon className="size-4" aria-hidden="true" />
                  ) : (
                    <span className="text-xs font-semibold uppercase" aria-hidden="true">
                      {text}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Explore">
            {exploreLinks.map((link) => (
              <FooterLink key={link.label} href={link.href}>
                {link.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Resources">
            {resourceLinks.map((link) => (
              <FooterLink key={link}>{link}</FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Contact">
            <a
              href="mailto:mylegalpaddy@gmail.com"
              className="inline-flex max-w-full items-center gap-2 break-all text-sm text-zinc-600 transition-colors duration-300 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#c9b974]/35 dark:text-zinc-400 dark:hover:text-white"
            >
              <Mail className="size-4 text-[#9c874f]" aria-hidden="true" />
              mylegalpaddy@gmail.com
            </a>
            <p className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <MapPin className="size-4 text-[#9c874f]" aria-hidden="true" />
              Nigeria
            </p>
            <a
              href="https://chat.whatsapp.com/DfYUhgx0DWAA22zkW3Nc7Z"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#c9b974]/35 bg-white px-4 py-2 text-center text-sm font-semibold text-zinc-900 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c9b974]/70 hover:bg-[#fbf6df] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#c9b974]/35 dark:bg-zinc-900 dark:text-white dark:hover:bg-[#2b2517] sm:w-fit"
            >
              Join WhatsApp Community
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          </FooterColumn>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-black/10 pt-6 text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 My Legal Paddy. All rights reserved.</p>
          <p>Built with &#10084;&#65039; by Azaana Digital</p>
        </div>
      </div>
    </footer>
  );
}
