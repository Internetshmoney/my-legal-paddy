import { ArrowUpRight, Clock3, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';

const email = 'mylegalpaddy@gmail.com';
const phone = '+2349058607390';
const whatsappUrl = 'https://wa.me/2349058607390';

export const metadata = {
  title: 'Contact Us',
  description: 'Contact My Legal Paddy by email, telephone or WhatsApp for questions about legal articles, tutoring, partnerships and our student community.',
  alternates: { canonical: '/contact' },
  openGraph: {
    type: 'website',
    url: '/contact',
    title: 'Contact My Legal Paddy',
    description: 'Get in touch about legal articles, tutoring, partnerships and the My Legal Paddy student community.',
  },
};

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact My Legal Paddy',
  url: 'https://mylegalpaddy.app/contact',
  mainEntity: {
    '@type': 'Organization',
    '@id': 'https://mylegalpaddy.app/#organization',
    email,
    telephone: phone,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: phone,
      email,
      contactType: 'customer support',
      areaServed: 'NG',
      availableLanguage: 'English',
    },
  },
};

const contactOptions = [
  {
    icon: Mail,
    label: 'Email us',
    value: email,
    description: 'For articles, collaborations, tutoring and general questions.',
    href: `mailto:${email}`,
    action: 'Send an email',
  },
  {
    icon: Phone,
    label: 'Call us',
    value: '+234 905 860 7390',
    description: 'Speak directly with the My Legal Paddy team.',
    href: `tel:${phone}`,
    action: 'Call now',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp us',
    value: '+234 905 860 7390',
    description: 'Send us a quick message and we will respond as soon as possible.',
    href: whatsappUrl,
    action: 'Start a chat',
  },
];

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema).replace(/</g, '\\u003c') }}
      />
      <Navbar />
      <main className="min-h-[70vh] bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white">
        <section className="relative overflow-hidden border-b border-black/10 bg-[#f8f7f3] px-4 py-16 dark:border-white/10 dark:bg-black sm:px-6 sm:py-24">
          <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full border-[42px] border-[#c9b974]/15" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 size-72 rounded-full bg-[#c9b974]/10 blur-2xl" aria-hidden="true" />
          <div className="relative mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8f7d4d] dark:text-[#d8ca92]">Contact My Legal Paddy</p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.03em] sm:text-6xl">Let&apos;s talk about your legal journey.</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              Have a question, an article idea, a tutoring enquiry or a partnership in mind? Choose the easiest way to reach us.
            </p>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-6 md:grid-cols-3">
              {contactOptions.map(({ icon: Icon, label, value, description, href, action }) => (
                <article key={label} className="flex flex-col rounded-[2rem] border border-black/10 bg-white p-7 shadow-[0_28px_80px_-58px_rgba(0,0,0,.55)] dark:border-white/10 dark:bg-zinc-900 sm:p-8">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-[#f3e8bd] text-[#75643d]">
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#8f7d4d] dark:text-[#d8ca92]">{label}</p>
                  <h2 className="mt-2 break-words text-xl font-semibold">{value}</h2>
                  <p className="mt-4 flex-1 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{description}</p>
                  <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-zinc-950">
                    {action}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </article>
              ))}
            </div>

            <div className="mt-10 grid gap-5 rounded-[2rem] border border-black/10 bg-[#f8f7f3] p-7 dark:border-white/10 dark:bg-black sm:grid-cols-2 sm:p-10">
              <div className="flex gap-4">
                <MapPin className="mt-1 shrink-0 text-[#8f7d4d]" size={22} aria-hidden="true" />
                <div><h2 className="font-semibold">Based in Nigeria</h2><p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">Supporting university law students and young legal professionals across Africa.</p></div>
              </div>
              <div className="flex gap-4">
                <Clock3 className="mt-1 shrink-0 text-[#8f7d4d]" size={22} aria-hidden="true" />
                <div><h2 className="font-semibold">Response time</h2><p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">We aim to reply to messages within one to two working days.</p></div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
