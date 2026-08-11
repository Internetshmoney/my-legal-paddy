import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, BookOpen, BriefcaseBusiness, GraduationCap, Users } from 'lucide-react';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';

const linkedinUrl = 'https://www.linkedin.com/in/msendoo-stephanie-asuga-413789248/';

export const metadata = {
  title: 'About Us',
  description: 'Meet My Legal Paddy and founder Msendoo Stephanie Asuga, and learn how we support university law students through knowledge, guidance and community.',
  alternates: { canonical: '/about' },
  openGraph: {
    type: 'website',
    url: '/about',
    title: 'About My Legal Paddy',
    description: 'A student-focused legal education platform helping university law students learn, connect and build confident careers.',
    images: [{
      url: '/team/msendoo-stephanie-asuga.jpeg',
      width: 1491,
      height: 2048,
      alt: 'Msendoo Stephanie Asuga, founder of My Legal Paddy',
    }],
  },
};

const founderSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Msendoo Stephanie Asuga',
  jobTitle: 'Founder, My Legal Paddy',
  image: 'https://mylegalpaddy.app/team/msendoo-stephanie-asuga.jpeg',
  url: 'https://mylegalpaddy.app/about',
  sameAs: [linkedinUrl],
  worksFor: { '@id': 'https://mylegalpaddy.app/#organization' },
};

const pillars = [
  { icon: BookOpen, title: 'Accessible knowledge', text: 'Clear legal articles and practical learning resources written with students in mind.' },
  { icon: GraduationCap, title: 'Academic support', text: 'Tutoring and guidance that help students approach difficult courses with confidence.' },
  { icon: BriefcaseBusiness, title: 'Career direction', text: 'Ideas, tools and opportunities that help students explore life beyond the classroom.' },
  { icon: Users, title: 'A real community', text: 'A growing network where law students can learn together, connect and feel supported.' },
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(founderSchema).replace(/</g, '\\u003c') }}
      />
      <Navbar />
      <main className="bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white">
        <section className="border-b border-black/10 bg-[#f8f7f3] px-4 py-16 dark:border-white/10 dark:bg-black sm:px-6 sm:py-24">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8f7d4d] dark:text-[#d8ca92]">About us</p>
            <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.03em] sm:text-6xl">
              Making the law journey clearer, more connected and more rewarding.
            </h1>
            <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              My Legal Paddy is a student-focused legal education platform built to support university law students through accessible legal knowledge, academic guidance, career discovery, tutoring, opportunities and community.
            </p>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8f7d4d] dark:text-[#d8ca92]">What we do</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">The law students&apos; friend, at every stage.</h2>
              <p className="mt-5 text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">
                We bring useful information and people closer to students. From thoughtful articles and one-to-one tutoring to career tools, webinars and a supportive peer network, our goal is to make legal education feel less overwhelming and more practical.
              </p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {pillars.map(({ icon: Icon, title, text }) => (
                <article key={title} className="rounded-3xl border border-black/10 bg-[#f8f7f3] p-6 dark:border-white/10 dark:bg-zinc-900">
                  <div className="flex size-11 items-center justify-center rounded-full bg-[#c9b974]/15 text-[#8f7d4d] dark:text-[#d8ca92]">
                    <Icon size={20} aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-black/10 bg-[#f8f7f3] px-4 py-16 dark:border-white/10 dark:bg-black sm:px-6 sm:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
            <div className="mx-auto w-full max-w-md overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_30px_90px_-55px_rgba(0,0,0,0.55)] dark:border-white/10 dark:bg-zinc-900">
              <Image
                src="/team/msendoo-stephanie-asuga.jpeg"
                alt="Msendoo Stephanie Asuga, founder of My Legal Paddy"
                width={1491}
                height={2048}
                className="h-auto w-full object-cover"
                sizes="(max-width: 1024px) 90vw, 420px"
              />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8f7d4d] dark:text-[#d8ca92]">Founder, My Legal Paddy</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">Msendoo Stephanie Asuga</h2>
              <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
                Msendoo Stephanie Asuga is a law graduate, bar aspirant and the founder of My Legal Paddy. She created the platform to give law students clearer academic support, practical career direction and a community that makes the university law journey feel less isolating.
              </p>
              <p className="mt-4 text-base leading-8 text-zinc-600 dark:text-zinc-300">
                Her interests sit at the meeting point of legal education, technology and accessible student-focused innovation. Through My Legal Paddy, she is building a space where students can learn with confidence, find useful opportunities and grow alongside one another.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#0a66c2] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#084f96]">
                  Connect on LinkedIn
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
                <Link href="mailto:mylegalpaddy@gmail.com" className="inline-flex items-center rounded-full border border-black/15 px-6 py-3 text-sm font-semibold transition hover:border-[#c9b974] dark:border-white/20">
                  Email My Legal Paddy
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
