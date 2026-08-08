import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import TutorApplicationForm from '../../components/tutors/TutorApplicationForm';
import { BadgeCheck, BookOpen, CalendarClock, CircleDollarSign } from 'lucide-react';
import { listTutors } from '@/lib/appwrite/data';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Law Tutors | My Legal Paddy',
  description: 'Find a law tutor or apply to teach university law students and earn per hour.',
};

const subjects = ['Contract Law', 'Constitutional Law', 'Criminal Law', 'Law of Torts', 'Commercial Law', 'Jurisprudence'];

export default async function TutorsPage() {
  const tutors = await listTutors({ approvedOnly: true });
  return (
    <main>
      <Navbar />
      <section className="bg-[#f5f1e6] px-6 py-20 dark:bg-zinc-950">
        <div className="mx-auto max-w-[1100px] text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8f7d4d]">My Legal Paddy Tutors</span>
          <h1 className="mx-auto mt-5 max-w-4xl text-5xl font-semibold leading-[1.08] text-zinc-950 dark:text-white sm:text-6xl">Law school is easier with the right paddy.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">Book focused help from capable law tutors—or turn your strongest subjects into paid hourly sessions.</p>
        </div>
      </section>

      <section id="find-a-tutor" className="px-6 py-20">
        <div className="mx-auto max-w-[1100px]">
          {tutors.length > 0 && <div className="mb-16"><p className="text-sm font-semibold text-[#8f7d4d]">APPROVED TUTORS</p><h2 className="mt-3 text-4xl font-semibold">Meet your next law tutor</h2><div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{tutors.map(tutor => <article key={tutor.$id} className="rounded-3xl border bg-white p-6 shadow-sm dark:bg-zinc-900"><div className="flex size-14 items-center justify-center rounded-full bg-[#f5f1e6] text-xl font-semibold text-[#8f7d4d]">{tutor.name?.charAt(0)}</div><h3 className="mt-5 text-xl font-semibold">{tutor.name}</h3><p className="mt-1 text-sm text-zinc-500">{tutor.university} · {tutor.level}</p><p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{tutor.bio}</p><p className="mt-4 text-sm font-medium">{tutor.subjects}</p><p className="mt-4 text-lg font-semibold text-[#8f7d4d]">₦{Number(tutor.hourlyRate).toLocaleString()}/hour</p></article>)}</div></div>}
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <span className="text-sm font-semibold text-[#8f7d4d]">FOR STUDENTS</span>
              <h2 className="mt-3 text-4xl font-semibold">Find help for your next course or exam</h2>
              <p className="mt-4 leading-7 text-zinc-600 dark:text-zinc-400">Browse approved tutors for the subjects where you need focused help. New profiles appear here after review.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {subjects.map((subject) => <div key={subject} className="flex items-center gap-3 rounded-2xl border bg-white p-5 dark:bg-zinc-900"><BookOpen className="text-[#9c874b]" size={20} /><span className="font-medium">{subject}</span></div>)}
            </div>
          </div>
        </div>
      </section>

      <section id="become-a-tutor" className="bg-zinc-950 px-6 py-20 text-white">
        <div className="mx-auto grid max-w-[1100px] gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <span className="text-sm font-semibold text-[#dfd29a]">BECOME A TUTOR</span>
            <h2 className="mt-3 text-4xl font-semibold">Teach what you know. Earn per hour.</h2>
            <p className="mt-5 leading-7 text-zinc-300">Apply to join our tutor network. You choose the subjects you teach, your availability and your proposed hourly rate.</p>
            <div className="mt-8 space-y-5">
              <p className="flex gap-3"><BadgeCheck className="mt-0.5 shrink-0 text-[#C9B974]" /> Applications are reviewed before profiles go live.</p>
              <p className="flex gap-3"><CalendarClock className="mt-0.5 shrink-0 text-[#C9B974]" /> Arrange sessions around your own timetable.</p>
              <p className="flex gap-3"><CircleDollarSign className="mt-0.5 shrink-0 text-[#C9B974]" /> Set a fair hourly rate for your experience.</p>
            </div>
          </div>
          <TutorApplicationForm />
        </div>
      </section>
      <Footer />
    </main>
  );
}
