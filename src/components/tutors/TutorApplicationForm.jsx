'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

const inputClass = 'mt-2 w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-[#C9B974] focus:ring-2 focus:ring-[#C9B974]/20';

export default function TutorApplicationForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-[#C9B974]/30 bg-white/[0.05] p-10 text-center"><CheckCircle2 size={54} className="text-[#C9B974]" /><h3 className="mt-5 text-2xl font-semibold">Application received</h3><p className="mt-3 max-w-md leading-7 text-zinc-300">Thank you for applying. The My Legal Paddy team will contact you after reviewing your details.</p><button type="button" onClick={() => setSubmitted(false)} className="mt-7 text-sm font-semibold text-[#dfd29a] underline underline-offset-4">Submit another application</button></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 sm:p-8">
      <h3 className="text-2xl font-semibold">Tutor application</h3>
      <p className="mt-2 text-sm text-zinc-400">All fields are required. Payments and identity verification will be confirmed during onboarding.</p>
      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <label className="text-sm text-zinc-300">Full name<input required name="name" autoComplete="name" placeholder="Your full name" className={inputClass} /></label>
        <label className="text-sm text-zinc-300">Email address<input required type="email" name="email" autoComplete="email" placeholder="you@example.com" className={inputClass} /></label>
        <label className="text-sm text-zinc-300">University<input required name="university" placeholder="Your university" className={inputClass} /></label>
        <label className="text-sm text-zinc-300">Level or qualification<input required name="level" placeholder="e.g. 400 level or LL.B" className={inputClass} /></label>
        <label className="text-sm text-zinc-300 sm:col-span-2">Subjects you can teach<input required name="subjects" placeholder="e.g. Contract Law, Criminal Law" className={inputClass} /></label>
        <label className="text-sm text-zinc-300">Hourly rate (₦)<input required min="1000" step="500" type="number" name="rate" placeholder="5000" className={inputClass} /></label>
        <label className="text-sm text-zinc-300">Weekly availability<input required name="availability" placeholder="e.g. Weekends, 4 hours" className={inputClass} /></label>
        <label className="text-sm text-zinc-300 sm:col-span-2">Why would you be a good tutor?<textarea required name="bio" rows="4" placeholder="Tell us about your knowledge and teaching experience" className={inputClass} /></label>
      </div>
      <label className="mt-5 flex items-start gap-3 text-sm leading-6 text-zinc-400"><input required type="checkbox" className="mt-1 accent-[#C9B974]" /> I confirm that these details are accurate and agree to be contacted about tutor onboarding.</label>
      <button type="submit" className="mt-7 w-full rounded-full bg-[#C9B974] px-6 py-3.5 font-semibold text-black transition hover:bg-[#d8ca92]">Apply to become a tutor</button>
    </form>
  );
}
