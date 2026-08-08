'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen, BriefcaseBusiness, Check, Copy, Gavel, HeartHandshake, Landmark, RefreshCcw, Scale, Sparkles } from 'lucide-react';

const paths = {
  advocacy: { title: 'Litigation & Advocacy', icon: Gavel, summary: 'You are energized by argument, evidence and persuading people under pressure.', strengths: ['Oral advocacy', 'Fast analysis', 'Strategic thinking'], next: ['Join your moot and mock society', 'Observe court proceedings', 'Practise written and oral submissions'] },
  corporate: { title: 'Corporate & Commercial Law', icon: BriefcaseBusiness, summary: 'You enjoy structure, negotiation and helping organizations make sound decisions.', strengths: ['Commercial awareness', 'Negotiation', 'Attention to detail'], next: ['Study contracts and company law deeply', 'Follow business and finance news', 'Seek an internship with a commercial team'] },
  rights: { title: 'Human Rights & Public Interest', icon: HeartHandshake, summary: 'You are motivated by fairness, social impact and using law to protect people.', strengths: ['Empathy', 'Community focus', 'Purpose-driven research'], next: ['Volunteer with a legal-aid organization', 'Study constitutional and human-rights cases', 'Learn community advocacy and policy writing'] },
  technology: { title: 'Technology & Intellectual Property Law', icon: Sparkles, summary: 'You are curious about innovation and the legal questions created by new ideas.', strengths: ['Curiosity', 'Adaptability', 'Future-focused reasoning'], next: ['Explore privacy, AI and copyright law', 'Learn how digital products work', 'Write about emerging technology regulation'] },
  research: { title: 'Legal Research, Academia & Policy', icon: BookOpen, summary: 'You prefer deep thinking, careful writing and improving the rules behind institutions.', strengths: ['Research', 'Clear writing', 'Systems thinking'], next: ['Work on a journal or research project', 'Build strong citation and writing habits', 'Explore postgraduate study and policy internships'] },
  public: { title: 'Public Service & Criminal Justice', icon: Landmark, summary: 'You value public responsibility, order and institutions that make justice work.', strengths: ['Public-minded judgment', 'Evidence evaluation', 'Institutional thinking'], next: ['Study criminal procedure and evidence', 'Explore government and justice-sector internships', 'Attend public policy and justice events'] },
};

const questions = [
  { text: 'Which assignment would you volunteer for first?', options: [
    ['Presenting an argument before a panel', { advocacy: 3, public: 1 }], ['Reviewing a startup investment agreement', { corporate: 3, technology: 1 }], ['Researching a community rights violation', { rights: 3, research: 1 }], ['Explaining how AI affects copyright', { technology: 3, research: 1 }],
  ]},
  { text: 'What kind of problem holds your attention longest?', options: [
    ['A dispute with conflicting stories and evidence', { advocacy: 3, public: 2 }], ['A complex transaction with many moving parts', { corporate: 3 }], ['An unfair rule affecting vulnerable people', { rights: 3, research: 1 }], ['A new issue the law has not caught up with', { technology: 3, research: 2 }],
  ]},
  { text: 'Where do you naturally do your best work?', options: [
    ['Speaking and responding in real time', { advocacy: 3 }], ['Working with a team toward a practical deal', { corporate: 3 }], ['Listening to people and building trust', { rights: 3 }], ['Reading, writing and developing a careful position', { research: 3, technology: 1 }],
  ]},
  { text: 'Which course area sounds most appealing?', options: [
    ['Evidence and civil procedure', { advocacy: 3, public: 1 }], ['Company, tax and contract law', { corporate: 3 }], ['Constitutional and human-rights law', { rights: 3, public: 1 }], ['Intellectual property, privacy and cyberlaw', { technology: 3 }],
  ]},
  { text: 'What would make a future job feel meaningful?', options: [
    ['Winning a difficult case for a client', { advocacy: 3 }], ['Helping an organization grow responsibly', { corporate: 3 }], ['Creating a fairer outcome for people', { rights: 3 }], ['Improving laws, ideas or public institutions', { research: 2, public: 2 }],
  ]},
  { text: 'How do you usually make decisions?', options: [
    ['Quickly, after testing both sides', { advocacy: 3 }], ['By balancing risk, value and practical outcomes', { corporate: 3 }], ['By asking who may be affected or excluded', { rights: 3 }], ['By gathering information and looking for patterns', { research: 3, technology: 1 }],
  ]},
  { text: 'Which professional would you most like to shadow?', options: [
    ['A courtroom advocate', { advocacy: 3 }], ['An in-house counsel or deal lawyer', { corporate: 3 }], ['A legal-aid or civil-society lawyer', { rights: 3 }], ['A policy researcher or technology lawyer', { research: 2, technology: 2 }],
  ]},
  { text: 'Pick the result you would be proudest to achieve.', options: [
    ['A persuasive submission that changes the outcome', { advocacy: 3 }], ['A clear agreement that prevents future problems', { corporate: 3 }], ['A judgment or reform that protects a community', { rights: 3, public: 2 }], ['A new framework that guides law and innovation', { technology: 2, research: 3 }],
  ]},
];

export default function CareerPredictor() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [copied, setCopied] = useState(false);
  const complete = answers.length === questions.length;
  const resultKey = useMemo(() => {
    if (!complete) return null;
    const scores = Object.fromEntries(Object.keys(paths).map((key) => [key, 0]));
    answers.forEach((answer, index) => Object.entries(questions[index].options[answer][1]).forEach(([key, value]) => { scores[key] += value; }));
    return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  }, [answers, complete]);

  function choose(index) {
    const next = [...answers.slice(0, step), index];
    setAnswers(next);
    if (step < questions.length - 1) setStep(step + 1);
  }

  function restart() { setAnswers([]); setStep(0); setCopied(false); }
  async function copyResult() {
    const text = `My Legal Paddy career result: ${paths[resultKey].title}. Discover yours at ${window.location.href}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
  }

  if (complete && resultKey) {
    const result = paths[resultKey];
    const Icon = result.icon;
    return <section className="px-6 py-16 sm:py-24"><div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_35px_100px_-55px_rgba(0,0,0,.4)] dark:border-white/10 dark:bg-zinc-900">
      <div className="bg-zinc-950 p-8 text-center text-white sm:p-12"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C9B974] text-black"><Icon size={31} /></span><p className="mt-6 text-xs font-bold uppercase tracking-[.22em] text-[#dfd29a]">Your strongest match</p><h2 className="mt-3 text-4xl font-semibold sm:text-5xl">{result.title}</h2><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-300">{result.summary}</p></div>
      <div className="grid gap-10 p-8 sm:p-12 md:grid-cols-2"><div><h3 className="text-xl font-semibold">Strengths this path rewards</h3><ul className="mt-5 space-y-3">{result.strengths.map((item) => <li key={item} className="flex gap-3"><Check className="mt-0.5 shrink-0 text-[#8f7d4d]" size={19} />{item}</li>)}</ul></div><div><h3 className="text-xl font-semibold">What to do next</h3><ol className="mt-5 space-y-3">{result.next.map((item, index) => <li key={item} className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f3e8bd] text-xs font-bold text-[#75643d]">{index + 1}</span>{item}</li>)}</ol></div></div>
      <div className="flex flex-wrap justify-center gap-3 border-t border-black/10 p-6 dark:border-white/10"><button onClick={restart} className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold"><RefreshCcw size={16} /> Retake quiz</button><button onClick={copyResult} className="inline-flex items-center gap-2 rounded-full bg-[#C9B974] px-5 py-3 text-sm font-semibold text-black"><Copy size={16} /> {copied ? 'Copied' : 'Share result'}</button><Link href="/tutors" className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-black">Explore tutors <ArrowRight size={16} /></Link></div>
    </div><p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-6 text-zinc-500">This is a guidance tool, not a fixed verdict. Explore several practice areas through courses, internships and conversations before deciding.</p></section>;
  }

  const question = questions[step];
  return <section className="px-6 py-16 sm:py-24"><div className="mx-auto max-w-3xl">
    <div className="mb-7 flex items-center justify-between text-sm font-medium text-zinc-500"><span>Question {step + 1} of {questions.length}</span><span>{Math.round(((step + 1) / questions.length) * 100)}%</span></div>
    <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"><div className="h-full rounded-full bg-[#C9B974] transition-all" style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></div>
    <div className="mt-8 rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_30px_90px_-60px_rgba(0,0,0,.45)] dark:border-white/10 dark:bg-zinc-900 sm:p-10"><div className="flex items-start gap-4"><span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f3e8bd] text-[#75643d] sm:flex"><Scale size={23} /></span><h2 className="text-2xl font-semibold leading-tight sm:text-3xl">{question.text}</h2></div><div className="mt-8 grid gap-3">{question.options.map(([label], index) => <button key={label} onClick={() => choose(index)} className="group flex w-full items-center justify-between rounded-2xl border border-black/10 px-5 py-4 text-left font-medium transition hover:-translate-y-0.5 hover:border-[#C9B974] hover:bg-[#fbf6df] dark:border-white/10 dark:hover:bg-[#2b2517]"><span>{label}</span><ArrowRight className="shrink-0 text-zinc-400 transition group-hover:translate-x-1 group-hover:text-[#8f7d4d]" size={18} /></button>)}</div></div>
    <div className="mt-6 flex justify-between"><button disabled={step === 0} onClick={() => setStep(step - 1)} className="inline-flex items-center gap-2 text-sm font-semibold disabled:invisible"><ArrowLeft size={16} /> Previous</button><button onClick={restart} className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white">Start over</button></div>
  </div></section>;
}
