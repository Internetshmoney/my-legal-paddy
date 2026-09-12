'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Italic, Link as LinkIcon, List, ListOrdered, Redo2, Underline, Undo2 } from 'lucide-react';
import { createArticle } from '@/app/admin/actions';
import { updateDraftArticle } from '@/app/admin/articles/actions';

const field = 'mt-2 min-w-0 w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#9c874b] sm:px-4 sm:text-base';
const toolButton = 'grid h-10 w-full place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-700 transition hover:border-[#b5a05e] hover:bg-[#faf7eb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8f7d4d] sm:h-9 sm:w-9 sm:shrink-0';

function RichTextEditor({ initialValue, onChange, countRef }) {
  const editorRef = useRef(null);
  const inputRef = useRef(null);
  const selectionRef = useRef(null);

  function syncContent() {
    const html = editorRef.current?.innerHTML || '';
    if (inputRef.current) inputRef.current.value = html;
    if (countRef?.current) countRef.current.textContent = String(html.length);
    onChange(html);
  }

  function rememberSelection() {
    const selection = window.getSelection();
    if (selection?.rangeCount && editorRef.current?.contains(selection.anchorNode)) selectionRef.current = selection.getRangeAt(0).cloneRange();
  }

  function command(name, commandValue = null) {
    const editor = editorRef.current;
    if (!editor) return;
    if (selectionRef.current) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(selectionRef.current);
    }
    editor.focus({ preventScroll: true });
    document.execCommand('styleWithCSS', false, true);
    document.execCommand(name, false, commandValue);
    syncContent();
    rememberSelection();
  }

  function addLink() {
    const url = window.prompt('Enter the full link address (https://…)');
    if (!url) return;
    let parsed;
    try { parsed = new URL(url); } catch { window.alert('Enter a valid full link address.'); return; }
    if (!['http:', 'https:', 'mailto:'].includes(parsed.protocol)) { window.alert('Links must use HTTP, HTTPS or mailto.'); return; }
    command('createLink', parsed.toString());
  }

  const buttons = [
    ['bold', Bold, 'Bold'], ['italic', Italic, 'Italic'], ['underline', Underline, 'Underline'],
    ['justifyLeft', AlignLeft, 'Align left'], ['justifyCenter', AlignCenter, 'Align centre'], ['justifyRight', AlignRight, 'Align right'], ['justifyFull', AlignJustify, 'Justify'],
    ['insertUnorderedList', List, 'Bulleted list'], ['insertOrderedList', ListOrdered, 'Numbered list'],
    ['undo', Undo2, 'Undo'], ['redo', Redo2, 'Redo'],
  ];

  return <div className="mt-2 overflow-hidden rounded-xl border border-zinc-200 bg-white focus-within:border-[#9c874b]">
    <div className="border-b border-zinc-200 bg-zinc-50 p-2 sm:flex sm:flex-wrap sm:gap-1.5" role="toolbar" aria-label="Article formatting tools" onPointerDownCapture={rememberSelection}>
      <div className="grid grid-cols-2 gap-1.5 sm:contents">
        <select aria-label="Text style" defaultValue="p" onChange={(event) => command('formatBlock', `<${event.target.value}>`)} className="h-10 min-w-0 rounded-lg border border-zinc-200 bg-white px-2 text-sm sm:h-9 sm:min-w-28">
          <option value="p">Paragraph</option><option value="h2">Heading 2</option><option value="h3">Heading 3</option><option value="blockquote">Quote</option>
        </select>
        <select aria-label="Font family" defaultValue="Arial" onChange={(event) => command('fontName', event.target.value)} className="h-10 min-w-0 rounded-lg border border-zinc-200 bg-white px-2 text-sm sm:h-9 sm:min-w-28">
          <option value="Arial">Arial</option><option value="Georgia">Georgia</option><option value="Times New Roman">Times</option><option value="Verdana">Verdana</option>
        </select>
        <select aria-label="Font size" defaultValue="3" onChange={(event) => command('fontSize', event.target.value)} className="h-10 min-w-0 rounded-lg border border-zinc-200 bg-white px-2 text-sm sm:h-9 sm:w-24">
          <option value="2">Small</option><option value="3">Normal</option><option value="4">Large</option><option value="5">X-large</option><option value="6">Display</option>
        </select>
        <label className="flex h-10 min-w-0 items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 text-xs font-medium text-zinc-600 sm:h-9">Colour<input type="color" aria-label="Text colour" defaultValue="#18181b" onChange={(event) => command('foreColor', event.target.value)} className="h-6 w-7 cursor-pointer border-0 bg-transparent p-0" /></label>
      </div>
      <div className="mt-1.5 grid grid-cols-6 gap-1.5 sm:contents">
        {buttons.map(([name, Icon, label]) => <button key={name} type="button" className={toolButton} title={label} aria-label={label} onMouseDown={(event) => event.preventDefault()} onClick={() => command(name)}><Icon size={17} /></button>)}
        <button type="button" className={toolButton} title="Add link" aria-label="Add link" onMouseDown={(event) => event.preventDefault()} onClick={addLink}><LinkIcon size={17} /></button>
      </div>
    </div>
    <div ref={editorRef} contentEditable suppressContentEditableWarning role="textbox" aria-multiline="true" aria-label="Article body" onInput={syncContent} onKeyUp={rememberSelection} onPointerUp={rememberSelection} onSelect={rememberSelection} onBlur={rememberSelection} dangerouslySetInnerHTML={{ __html: initialValue }} className="article-content min-h-72 max-w-full overflow-x-auto break-words px-3 py-4 text-base leading-7 outline-none [overflow-wrap:anywhere] sm:min-h-96 sm:px-6" />
    <textarea ref={inputRef} name="content" defaultValue={initialValue} hidden readOnly />
  </div>;
}

export default function ArticleComposer({ article = null }) {
  const editing = Boolean(article);
  const [state, action, pending] = useActionState(editing ? updateDraftArticle : createArticle, {});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [title, setTitle] = useState(article?.title || '');
  const [excerpt, setExcerpt] = useState(article?.excerpt || '');
  const initialContent = article?.content || '';
  const contentRef = useRef(initialContent);
  const contentCountRef = useRef(null);
  const [previewContent, setPreviewContent] = useState(initialContent);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!previewOpen) return undefined;
    closeButtonRef.current?.focus();
    const closeOnEscape = (event) => { if (event.key === 'Escape') setPreviewOpen(false); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [previewOpen]);

  return <form action={action} className="w-full min-w-0 overflow-hidden rounded-2xl border bg-white p-3 shadow-sm sm:rounded-3xl sm:p-6" encType="multipart/form-data">
    {editing ? <input type="hidden" name="id" value={article.id} /> : null}
    <div><p className="text-xs font-bold uppercase tracking-widest text-[#8f7d4d]">{editing ? 'Edit draft' : 'New article'}</p><h2 className="mt-2 text-2xl font-semibold">{editing ? 'Refine your article' : 'Write and publish'}</h2></div>
    <div className="mt-6 grid min-w-0 gap-5 md:grid-cols-2 [&>label]:min-w-0">
      <label className="text-sm font-medium md:col-span-2">Title <span className="float-right text-xs font-normal text-zinc-500">{title.length}/255</span><input className={field} name="title" maxLength="255" required value={title} onChange={(event) => setTitle(event.target.value)} /></label>
      <label className="text-sm font-medium">Slug (optional)<input className={field} name="slug" maxLength="90" placeholder="generated-from-title" defaultValue={article?.slug || ''} /></label>
      <label className="text-sm font-medium">Category<input className={field} name="category" maxLength="100" required placeholder="e.g. Criminal Law" defaultValue={article?.category || ''} /></label>
      <label className="text-sm font-medium md:col-span-2">Writer’s name<input className={field} name="author" maxLength="150" required placeholder="Enter the actual writer for this article" defaultValue={article?.author || ''} /></label>
      <label className="text-sm font-medium md:col-span-2">Summary <span className="float-right text-xs font-normal text-zinc-500">{excerpt.length}/2000</span><textarea className={field} name="excerpt" maxLength="2000" rows="3" required value={excerpt} onChange={(event) => setExcerpt(event.target.value)} /></label>
      <label className="text-sm font-medium">Cover image upload<input className={`${field} file:mr-2 file:max-w-[52%] file:truncate`} name="image" type="file" accept="image/jpeg,image/png,image/webp" /><span className="mt-1 block text-xs font-normal text-zinc-500">{editing ? 'Leave empty to keep the current upload.' : 'JPEG, PNG or WebP; maximum 10 MB.'}</span></label>
      <label className="text-sm font-medium">Or approved cover image URL<input className={field} name="imageUrl" type="url" maxLength="2000" defaultValue={article?.imageUrl || ''} /></label>
      <div className="md:col-span-2"><div className="flex flex-wrap justify-between gap-2 text-sm font-medium"><span>Article body</span><span className="text-xs font-normal text-zinc-500"><span ref={contentCountRef}>{initialContent.length}</span>/100000 characters</span></div><RichTextEditor initialValue={initialContent} countRef={contentCountRef} onChange={(html) => { contentRef.current = html; }} /></div>
    </div>
    <div className="mt-5 grid gap-3 text-sm sm:flex sm:flex-wrap sm:gap-6"><label className="flex items-center gap-2"><input name="featured" type="checkbox" defaultChecked={Boolean(article?.featured)} /> Feature this article</label><label className="flex items-center gap-2"><input name="publishNow" type="checkbox" /> {editing ? 'Publish after saving' : 'Publish immediately'}</label></div>
    {state?.error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}
    {state?.success && <p role="status" className="mt-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{state.success}</p>}
    <div className="mt-6 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={() => { setPreviewContent(contentRef.current); setPreviewOpen(true); }} className="rounded-full border px-7 py-3 font-semibold">Preview</button><button disabled={pending} className="rounded-full bg-zinc-950 px-7 py-3 font-semibold text-white disabled:opacity-60">{pending ? 'Saving…' : editing ? 'Save changes' : 'Save article'}</button></div>
    {previewOpen ? <div role="dialog" aria-modal="true" aria-labelledby="article-preview-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6"><div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-2xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-8"><div className="flex items-center justify-between gap-4"><h2 id="article-preview-title" className="text-2xl font-semibold">{title || 'Untitled article'}</h2><button ref={closeButtonRef} type="button" onClick={() => setPreviewOpen(false)} className="rounded-full border px-4 py-2 text-sm">Close</button></div><p className="mt-4 text-zinc-600">{excerpt || 'No summary yet.'}</p><div className="article-content mt-8 border-t pt-7" dangerouslySetInnerHTML={{ __html: previewContent || '<p>No article content yet.</p>' }} /></div></div> : null}
  </form>;
}
