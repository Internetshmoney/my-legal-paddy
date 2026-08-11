"use client";

import { CheckCircle2, Mail } from 'lucide-react';
import { useActionState } from 'react';
import { subscribeToNewsletter } from '@/app/newsletter/actions';

export default function Newsletter() {
  const [state, action, pending] = useActionState(subscribeToNewsletter, {});

  return (
    <section id="newsletter" className="w-full scroll-mt-24 border-b border-black/10 bg-white py-16 dark:border-white/10 dark:bg-zinc-950 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-4xl">
          <div className="absolute -inset-4 rounded-[2rem] bg-[#c9b974]/10 blur-2xl dark:bg-[#c9b974]/5" aria-hidden="true" />

          <div className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-[#f8f7f3] px-5 py-12 text-center shadow-[0_30px_90px_-60px_rgba(0,0,0,0.5)] dark:border-white/10 dark:bg-zinc-900/95 sm:px-8 lg:px-16 lg:py-16">
            <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full border border-[#c9b974]/35 bg-[#fbf6df] text-[#8b7748] shadow-[0_18px_38px_-28px_rgba(0,0,0,0.45)] dark:bg-[#2b2517] dark:text-[#dfcf95]">
              <Mail className="size-6" aria-hidden="true" />
            </div>

            <p className="text-xs font-semibold uppercase text-[#8f7d4d] dark:text-[#d8ca92]">
              NEWSLETTER
            </p>
            <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold leading-tight text-zinc-950 dark:text-white sm:text-5xl">
              Stay Ahead in Your Legal Journey
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">
              Receive thoughtful legal insights, internship opportunities, scholarships, career advice and exclusive updates directly in your inbox. No spam-just valuable content.
            </p>

            <form action={action} className="mx-auto mt-8 max-w-2xl">
              <div className="flex flex-col gap-3 rounded-[1.5rem] border border-black/10 bg-white p-2 shadow-[0_22px_55px_-42px_rgba(0,0,0,0.5)] transition-all duration-300 focus-within:border-[#c9b974]/70 focus-within:shadow-[0_24px_70px_-48px_rgba(0,0,0,0.6)] dark:border-white/10 dark:bg-zinc-950 sm:flex-row">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  name="website"
                  className="hidden"
                  tabIndex="-1"
                  autoComplete="off"
                  aria-hidden="true"
                />
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  aria-invalid={Boolean(state?.error)}
                  aria-describedby={state?.error ? 'newsletter-error' : 'newsletter-trust'}
                  className="min-h-12 flex-1 rounded-[1.1rem] bg-transparent px-4 text-base text-zinc-950 outline-none placeholder:text-zinc-400 dark:text-white dark:placeholder:text-zinc-500"
                />
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex min-h-12 items-center justify-center rounded-[1.1rem] bg-[#c9b974] px-6 text-sm font-semibold text-zinc-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#bca964] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#c9b974]/35"
                >
                  {pending ? 'Subscribing…' : 'Subscribe'}
                </button>
              </div>

              <div className="mt-4 min-h-6">
                {state?.error ? (
                  <p id="newsletter-error" className="text-sm font-medium text-red-600 dark:text-red-400">
                    {state.error}
                  </p>
                ) : state?.success ? (
                  <p id="newsletter-trust" className="text-sm font-medium text-emerald-700 dark:text-emerald-400">{state.success}</p>
                ) : (
                  <p id="newsletter-trust" className="text-sm text-zinc-500 dark:text-zinc-400">
                    Join 5,000+ readers &bull; Unsubscribe anytime
                  </p>
                )}
              </div>
            </form>
          </div>

          <div
            role="status"
            aria-live="polite"
            className={`pointer-events-none absolute left-1/2 top-4 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#c9b974]/35 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-[0_18px_45px_-30px_rgba(0,0,0,0.6)] transition-all duration-300 dark:bg-zinc-950 dark:text-white ${
              state?.success ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
            }`}
          >
            <CheckCircle2 className="size-4 text-[#9c874f]" aria-hidden="true" />
            {state?.success || 'You are on the list.'}
          </div>
        </div>
      </div>
    </section>
  );
}
