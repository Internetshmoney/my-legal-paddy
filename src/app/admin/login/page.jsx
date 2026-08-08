import { redirect } from 'next/navigation';
import Link from 'next/link';
import LoginForm from '@/components/admin/LoginForm';
import { appwriteConfigured } from '@/lib/appwrite/config';
import { getCurrentAdmin } from '@/lib/appwrite/server';

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  if (await getCurrentAdmin()) redirect('/admin');
  return <main className="flex min-h-screen items-center justify-center bg-[#f5f1e6] p-6"><section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl"><Link href="/" className="text-sm text-zinc-500">← Back to website</Link><p className="mt-8 text-xs font-bold uppercase tracking-[.2em] text-[#8f7d4d]">My Legal Paddy</p><h1 className="mt-3 text-3xl font-semibold">Admin dashboard</h1><p className="mt-3 text-zinc-600">Sign in with an approved Appwrite account.</p>{appwriteConfigured ? <LoginForm /> : <p className="mt-7 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">Appwrite has not been configured. Complete the setup in <code>APPWRITE_SETUP.md</code> first.</p>}</section></main>;
}
