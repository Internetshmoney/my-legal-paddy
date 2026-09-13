'use client';

export default function ConfirmActionButton({ children, message, confirmationText = '', ...props }) {
  function confirmAction(event) {
    if (confirmationText) {
      const answer = window.prompt(`${message}\n\nType ${confirmationText} to continue.`);
      if (answer !== confirmationText) event.preventDefault();
      return;
    }
    if (!window.confirm(message)) event.preventDefault();
  }

  return <button {...props} type="submit" onClick={confirmAction} className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700">{children}</button>;
}
