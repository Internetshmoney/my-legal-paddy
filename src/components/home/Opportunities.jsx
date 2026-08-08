import { ArrowRight, Clock3, Sparkles } from 'lucide-react';

const options = [
  { letter: 'A', text: 'Seek an injunction.' },
  { letter: 'B', text: 'Negotiate privately.' },
  { letter: 'C', text: 'Report immediately.' },
  { letter: 'D', text: 'Investigate internally.' },
];

export default function Opportunities() {
  return (
    <section className="w-full border-b border-black/10 bg-[#f8f7f3] py-16 dark:border-white/10 dark:bg-zinc-950 sm:py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:px-8">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase text-[#8f7d4d] dark:text-[#d8ca92]">
            INTERACTIVE EXPERIENCE
          </p>
          <h2 className="mt-5 text-4xl font-semibold leading-tight text-zinc-950 dark:text-white sm:text-5xl">
            Discover Your Legal Path
          </h2>
          <p className="mt-6 text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">
            Answer a few realistic legal scenarios and discover which area of law best matches your instincts, strengths and decision-making style.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="#"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_-24px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
            >
              Start Prediction
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center text-sm font-semibold text-zinc-700 underline decoration-[#c9b974]/60 underline-offset-8 transition-colors duration-300 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
            >
              Learn How It Works
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-3 rounded-[2rem] border border-[#c9b974]/20 bg-[#c9b974]/10 blur-2xl dark:bg-[#c9b974]/5" aria-hidden="true" />
          <article className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-white/95 p-5 shadow-[0_30px_90px_-55px_rgba(0,0,0,0.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_36px_100px_-58px_rgba(0,0,0,0.62)] dark:border-white/10 dark:bg-zinc-900/95 sm:p-7">
            <div className="flex items-center justify-between gap-4 border-b border-black/10 pb-5 dark:border-white/10">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#c9b974]/30 bg-[#f8f0d6] px-3 py-1.5 text-xs font-semibold text-[#79683f] dark:bg-[#322913] dark:text-[#e1d198]">
                <Sparkles className="size-3.5" aria-hidden="true" />
                Preview Scenario
              </div>
              <div className="h-px min-w-10 flex-1 bg-[#c9b974]/30" aria-hidden="true" />
            </div>

            <div className="py-7 sm:py-8">
              <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Scenario</p>
              <h3 className="mt-3 text-2xl font-semibold leading-snug text-zinc-950 dark:text-white sm:text-3xl">
                A startup discovers a former employee copied confidential client data before leaving the company. What would you do first?
              </h3>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {options.map((option) => (
                <div
                  key={option.letter}
                  className="group rounded-2xl border border-black/10 bg-zinc-50/90 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c9b974]/60 hover:bg-white hover:shadow-[0_18px_45px_-34px_rgba(0,0,0,0.45)] dark:border-white/10 dark:bg-zinc-950/80 dark:hover:border-[#c9b974]/50 dark:hover:bg-zinc-900"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#c9b974]/45 bg-[#fbf7e8] text-sm font-semibold text-[#7b6a41] transition-colors duration-300 group-hover:bg-[#c9b974] group-hover:text-zinc-950 dark:bg-[#2b2517] dark:text-[#e3d59c]">
                      {option.letter}
                    </span>
                    <p className="text-sm font-medium leading-6 text-zinc-800 dark:text-zinc-200">
                      {option.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3 border-t border-black/10 pt-5 dark:border-white/10 sm:grid-cols-2">
              <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-950/70">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  <Clock3 className="size-4 text-[#9c874f]" aria-hidden="true" />
                  Estimated Time
                </div>
                <p className="mt-2 text-lg font-semibold text-zinc-950 dark:text-white">3 minutes</p>
              </div>
              <div className="rounded-2xl bg-zinc-950 p-4 text-white dark:bg-white dark:text-zinc-950">
                <p className="text-xs font-semibold text-[#d8ca92] dark:text-[#8a784b]">Result</p>
                <p className="mt-2 text-lg font-semibold leading-snug">Receive your predicted legal specialization.</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
