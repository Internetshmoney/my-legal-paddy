'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, BookOpen, BriefcaseBusiness, Check, Download, Gavel, HeartHandshake, Landmark, RefreshCcw, Scale, Share2, Sparkles } from 'lucide-react';

const quizUrl = 'https://mylegalpaddy.app/career-prediction';

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

function roundedRect(context, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.roundRect(x, y, width, height, safeRadius);
}

function drawSparkle(context, x, y, size, color) {
  context.save();
  context.strokeStyle = color;
  context.lineWidth = 7;
  context.lineCap = 'round';
  context.beginPath();
  context.moveTo(x, y - size);
  context.quadraticCurveTo(x, y, x + size, y);
  context.quadraticCurveTo(x, y, x, y + size);
  context.quadraticCurveTo(x, y, x - size, y);
  context.quadraticCurveTo(x, y, x, y - size);
  context.stroke();
  context.restore();
}

function drawScales(context, x, y, scale = 1) {
  context.save();
  context.translate(x, y);
  context.scale(scale, scale);
  context.strokeStyle = '#b79b43';
  context.lineWidth = 7;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.beginPath();
  context.moveTo(0, -70);
  context.lineTo(0, 65);
  context.moveTo(-65, -42);
  context.lineTo(65, -42);
  context.moveTo(-48, -42);
  context.lineTo(-76, 12);
  context.lineTo(-20, 12);
  context.closePath();
  context.moveTo(48, -42);
  context.lineTo(20, 12);
  context.lineTo(76, 12);
  context.closePath();
  context.moveTo(-48, 65);
  context.lineTo(48, 65);
  context.stroke();
  context.restore();
}

function drawGavel(context, x, y, angle = -0.35) {
  context.save();
  context.translate(x, y);
  context.rotate(angle);
  context.strokeStyle = '#b79b43';
  context.fillStyle = '#b79b43';
  context.lineWidth = 11;
  context.lineCap = 'round';
  context.beginPath();
  context.moveTo(-12, 20);
  context.lineTo(70, 102);
  context.stroke();
  roundedRect(context, -58, -20, 104, 42, 12);
  context.fill();
  context.restore();
}

function wrapText(context, text, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  words.forEach((word) => {
    const nextLine = line ? `${line} ${word}` : word;
    if (context.measureText(nextLine).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = nextLine;
    }
  });
  if (line) lines.push(line);
  return lines;
}

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Unable to create result image.'))), 'image/png', 0.95);
  });
}

async function createResultImage(result) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const context = canvas.getContext('2d');

  const background = context.createLinearGradient(0, 0, 1080, 1350);
  background.addColorStop(0, '#fffdf6');
  background.addColorStop(0.58, '#f6efd8');
  background.addColorStop(1, '#eadcae');
  context.fillStyle = background;
  context.fillRect(0, 0, 1080, 1350);

  context.fillStyle = '#121212';
  context.beginPath();
  context.arc(1020, 45, 310, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = 'rgba(201,185,116,.28)';
  context.beginPath();
  context.arc(50, 1295, 260, 0, Math.PI * 2);
  context.fill();

  drawScales(context, 930, 180, 0.72);
  drawGavel(context, 130, 1135, -0.55);
  drawSparkle(context, 125, 225, 35, '#b79b43');
  drawSparkle(context, 930, 1060, 28, '#121212');

  roundedRect(context, 74, 70, 420, 66, 33);
  context.fillStyle = '#121212';
  context.fill();
  context.fillStyle = '#f4df91';
  context.font = '700 24px Arial, sans-serif';
  context.letterSpacing = '2px';
  context.fillText('MY LEGAL PADDY', 110, 112);
  context.letterSpacing = '0px';

  context.fillStyle = '#786633';
  context.font = '700 25px Arial, sans-serif';
  context.fillText('MY LEGAL CAREER MATCH', 80, 330);

  context.fillStyle = '#121212';
  context.font = '700 76px Arial, sans-serif';
  const titleLines = wrapText(context, result.title, 900);
  titleLines.forEach((line, index) => context.fillText(line, 80, 430 + index * 84));

  const summaryY = 480 + titleLines.length * 84;
  context.fillStyle = '#4b4b43';
  context.font = '400 32px Arial, sans-serif';
  const summaryLines = wrapText(context, result.summary, 900);
  summaryLines.slice(0, 4).forEach((line, index) => context.fillText(line, 80, summaryY + index * 46));

  const strengthsY = summaryY + summaryLines.slice(0, 4).length * 46 + 70;
  context.fillStyle = '#121212';
  context.font = '700 24px Arial, sans-serif';
  context.fillText('THIS PATH REWARDS', 80, strengthsY);

  let chipX = 80;
  let chipY = strengthsY + 42;
  context.font = '600 25px Arial, sans-serif';
  result.strengths.forEach((strength) => {
    const chipWidth = context.measureText(strength).width + 58;
    if (chipX + chipWidth > 995) {
      chipX = 80;
      chipY += 72;
    }
    roundedRect(context, chipX, chipY, chipWidth, 54, 27);
    context.fillStyle = '#fffdf7';
    context.fill();
    context.strokeStyle = 'rgba(91,75,32,.24)';
    context.lineWidth = 2;
    context.stroke();
    context.fillStyle = '#5e4f27';
    context.fillText(strength, chipX + 29, chipY + 36);
    chipX += chipWidth + 14;
  });

  roundedRect(context, 70, 1080, 940, 190, 36);
  context.fillStyle = '#121212';
  context.fill();
  context.fillStyle = '#f7e8af';
  context.font = '700 32px Arial, sans-serif';
  context.fillText("WHAT'S YOUR LEGAL PATH?", 110, 1140);
  context.fillStyle = '#ffffff';
  context.font = '400 25px Arial, sans-serif';
  context.fillText('Take the free career quiz at', 110, 1188);
  context.font = '700 28px Arial, sans-serif';
  context.fillText('mylegalpaddy.app/career-prediction', 110, 1232);
  context.fillStyle = '#f7e8af';
  context.font = '700 20px Arial, sans-serif';
  context.fillText("THE LAW STUDENTS' FRIEND", 764, 1142);

  const blob = await canvasToBlob(canvas);
  return { blob, dataUrl: canvas.toDataURL('image/png', 0.95) };
}

export default function CareerPredictor() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [shareImage, setShareImage] = useState('');
  const [shareStatus, setShareStatus] = useState('');
  const complete = answers.length === questions.length;
  const resultKey = useMemo(() => {
    if (!complete) return null;
    const scores = Object.fromEntries(Object.keys(paths).map((key) => [key, 0]));
    answers.forEach((answer, index) => Object.entries(questions[index].options[answer][1]).forEach(([key, value]) => { scores[key] += value; }));
    return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  }, [answers, complete]);

  useEffect(() => {
    let active = true;
    if (!resultKey) {
      return () => { active = false; };
    }
    createResultImage(paths[resultKey])
      .then(({ dataUrl }) => { if (active) setShareImage(dataUrl); })
      .catch(() => { if (active) setShareStatus('Your result is ready, but the preview could not be generated.'); });
    return () => { active = false; };
  }, [resultKey]);

  function choose(index) {
    const next = [...answers.slice(0, step), index];
    setAnswers(next);
    if (step < questions.length - 1) setStep(step + 1);
  }

  function restart() { setAnswers([]); setStep(0); setShareImage(''); setShareStatus(''); }

  async function shareResult() {
    const result = paths[resultKey];
    const { blob } = await createResultImage(result);
    const file = new File([blob], `my-legal-paddy-${resultKey}-result.png`, { type: 'image/png' });
    const text = `My strongest legal career match is ${result.title}! Discover yours with the My Legal Paddy career quiz.`;

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ title: 'My Legal Paddy career result', text, url: quizUrl, files: [file] });
        setShareStatus('Shared! Invite your friends to discover their legal path too.');
        return;
      } catch (error) {
        if (error?.name === 'AbortError') return;
      }
    }

    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = file.name;
    anchor.click();
    URL.revokeObjectURL(downloadUrl);
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${quizUrl}`)}`, '_blank', 'noopener,noreferrer');
    setShareStatus('Image downloaded. Attach it in the WhatsApp window that just opened.');
  }

  async function downloadResult() {
    const { blob } = await createResultImage(paths[resultKey]);
    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = `my-legal-paddy-${resultKey}-result.png`;
    anchor.click();
    URL.revokeObjectURL(downloadUrl);
    setShareStatus('Result image downloaded.');
  }

  if (complete && resultKey) {
    const result = paths[resultKey];
    const Icon = result.icon;
    return <section className="px-4 py-16 sm:px-6 sm:py-24"><div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_35px_100px_-55px_rgba(0,0,0,.4)] dark:border-white/10 dark:bg-zinc-900">
      <div className="bg-zinc-950 p-8 text-center text-white sm:p-12"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C9B974] text-black"><Icon size={31} /></span><p className="mt-6 text-xs font-bold uppercase tracking-[.22em] text-[#dfd29a]">Your strongest match</p><h2 className="mt-3 text-4xl font-semibold sm:text-5xl">{result.title}</h2><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-300">{result.summary}</p></div>
      <div className="grid gap-10 p-8 sm:p-12 md:grid-cols-2"><div><h3 className="text-xl font-semibold">Strengths this path rewards</h3><ul className="mt-5 space-y-3">{result.strengths.map((item) => <li key={item} className="flex gap-3"><Check className="mt-0.5 shrink-0 text-[#8f7d4d]" size={19} />{item}</li>)}</ul></div><div><h3 className="text-xl font-semibold">What to do next</h3><ol className="mt-5 space-y-3">{result.next.map((item, index) => <li key={item} className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f3e8bd] text-xs font-bold text-[#75643d]">{index + 1}</span>{item}</li>)}</ol></div></div>
      <div className="border-t border-black/10 bg-[#f8f7f3] p-6 dark:border-white/10 dark:bg-black/30 sm:p-10">
        <div className="grid items-center gap-8 md:grid-cols-[.78fr_1.22fr]">
          <div className="mx-auto w-full max-w-[310px] rotate-[-1.5deg] overflow-hidden rounded-3xl border-4 border-white bg-white shadow-[0_25px_70px_-35px_rgba(0,0,0,.55)] transition hover:rotate-0 hover:scale-[1.02] dark:border-zinc-800 dark:bg-zinc-800">
            {shareImage ? <Image src={shareImage} alt={`Share card for ${result.title}`} width={1080} height={1350} unoptimized className="h-auto w-full" /> : <div className="aspect-[4/5] animate-pulse bg-zinc-200 dark:bg-zinc-800" />}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[.22em] text-[#8f7d4d] dark:text-[#dfd29a]">Don&apos;t keep it to yourself</p>
            <h3 className="mt-3 text-3xl font-semibold tracking-[-.02em] sm:text-4xl">Your result deserves a reveal.</h3>
            <p className="mt-4 max-w-xl leading-7 text-zinc-600 dark:text-zinc-300">Share your personalised result card and challenge your friends to discover where their own law degree could take them.</p>
            <button onClick={shareResult} className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 text-base font-bold text-[#073b1c] shadow-[0_18px_45px_-28px_rgba(37,211,102,.9)] transition hover:-translate-y-0.5 hover:bg-[#20c45d] sm:w-auto"><Share2 size={19} /> Share my result</button>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3">
              <button onClick={downloadResult} className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 underline decoration-[#C9B974] underline-offset-4 dark:text-zinc-300"><Download size={15} /> Download image</button>
              <button onClick={restart} className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-300"><RefreshCcw size={15} /> Retake quiz</button>
              <Link href="/tutors" className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-600 dark:text-zinc-300">Explore tutors <ArrowRight size={15} /></Link>
            </div>
            {shareStatus ? <p role="status" className="mt-4 text-sm font-medium text-[#75643d] dark:text-[#dfd29a]">{shareStatus}</p> : null}
            <p className="mt-4 text-xs leading-5 text-zinc-500">On mobile, choose WhatsApp from your share sheet to send the image and quiz link together.</p>
          </div>
        </div>
      </div>
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
