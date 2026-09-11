'use client';

export default function ConfirmActionButton({ children, message, ...props }) {
  return <button {...props} type="submit" onClick={(event) => { if (!window.confirm(message)) event.preventDefault(); }} className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700">{children}</button>;
}
