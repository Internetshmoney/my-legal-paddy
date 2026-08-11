'use client';

import { useState } from 'react';
import { Camera, Check, Link as LinkIcon, MessageCircle, Share2 } from 'lucide-react';

const buttonClass = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:-translate-y-0.5 hover:border-[#c9b974] hover:text-zinc-950 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:text-white';

export default function ArticleShare({ title, slug, heading = 'Share this article', prominent = false }) {
  const [copied, setCopied] = useState(false);
  const url = `https://mylegalpaddy.app/articles/${slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${title} — My Legal Paddy`);

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  async function shareToInstagram() {
    if (navigator.share) {
      await navigator.share({ title, text: `${title} — My Legal Paddy`, url }).catch(() => {});
      return;
    }
    await copyLink();
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
  }

  async function nativeShare() {
    if (navigator.share) {
      await navigator.share({ title, text: `${title} — My Legal Paddy`, url }).catch(() => {});
    } else {
      await copyLink();
    }
  }

  return (
    <aside className={prominent ? 'mt-12 rounded-3xl border border-[#c9b974]/35 bg-[#fbf6df]/70 p-6 dark:bg-[#2b2517]/40 sm:p-8' : 'mt-8 border-t border-black/10 pt-6 dark:border-white/10'} aria-label="Share this article">
      <p className={prominent ? 'text-xl font-semibold text-foreground sm:text-2xl' : 'text-sm font-semibold text-foreground'}>{heading}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <a className={buttonClass} href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer"><span aria-hidden="true" className="font-bold">f</span> Facebook</a>
        <a className={buttonClass} href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} /> WhatsApp</a>
        <a className={buttonClass} href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noopener noreferrer"><span aria-hidden="true" className="text-xs font-bold">in</span> LinkedIn</a>
        <button type="button" className={buttonClass} onClick={shareToInstagram}><Camera size={17} /> Instagram</button>
        <button type="button" className={buttonClass} onClick={copyLink}>{copied ? <Check size={17} /> : <LinkIcon size={17} />} {copied ? 'Copied' : 'Copy link'}</button>
        <button type="button" className={`${buttonClass} sm:hidden`} onClick={nativeShare}><Share2 size={17} /> More</button>
      </div>
    </aside>
  );
}
