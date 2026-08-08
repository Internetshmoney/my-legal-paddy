'use client';

import { useActionState } from 'react';
import { loginAdmin } from '@/app/admin/actions';

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAdmin, {});
  return (
    <form action={action} className="mt-8 space-y-5">
      <label className="block text-sm font-medium">Email<input name="email" type="email" required autoComplete="email" className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-[#9c874b]" /></label>
      <label className="block text-sm font-medium">Password<input name="password" type="password" required autoComplete="current-password" className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-[#9c874b]" /></label>
      {state?.error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}
      <button disabled={pending} className="w-full rounded-full bg-zinc-950 px-5 py-3 font-semibold text-white disabled:opacity-60">{pending ? 'Signing in…' : 'Sign in'}</button>
    </form>
  );
}
