import Link from 'next/link';
import { ArrowRight, BookOpenCheck, Clock3, GraduationCap, WalletCards } from 'lucide-react';

const benefits = [
  { icon: BookOpenCheck, title: 'Learn difficult courses', text: 'Get focused help with core law subjects from tutors who understand university coursework.' },
  { icon: Clock3, title: 'Choose a convenient time', text: 'Book one-on-one sessions around lectures, assignments and exam preparation.' },
  { icon: WalletCards, title: 'Teach and earn hourly', text: 'Strong law students and graduates can set an hourly rate and earn by helping others.' },
];

export default function Tutors() {
  return (
    <section className="bg-[#11110f] px-6 py-24 text-white" id="tutors">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C9B974]/40 bg-[#C9B974]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#dfd29a]">
              <GraduationCap size={16} /> Peer tutoring
            </span>
            <h2 className="mt-6 max-w-xl text-4xl font-semibold leading-tight sm:text-5xl">
              Get unstuck in class. Or get paid to help.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-300 sm:text-lg">
              My Legal Paddy connects university law students with trusted tutors for practical, one-on-one academic support.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/tutors#find-a-tutor" className="inline-flex items-center gap-2 rounded-full bg-[#C9B974] px-6 py-3 font-semibold text-black transition hover:bg-[#d8ca92]">
                Find a tutor <ArrowRight size={17} />
              </Link>
              <Link href="/tutors#become-a-tutor" className="inline-flex items-center rounded-full border border-white/25 px-6 py-3 font-semibold text-white transition hover:border-[#C9B974] hover:text-[#dfd29a]">
                Become a tutor
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {benefits.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#C9B974]/15 text-[#dfd29a]"><Icon size={21} /></span>
                <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
