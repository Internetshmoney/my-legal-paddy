import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CareerPredictor from '@/components/career/CareerPredictor';

export const metadata = {
  title: 'Legal Career Predictor | My Legal Paddy',
  description: 'Take a student-friendly assessment to discover legal career paths that fit your interests, strengths and preferred working style.',
};

export default function CareerPredictionPage() {
  return (
    <main className="min-h-screen bg-[#f8f7f3] text-zinc-950 dark:bg-zinc-950 dark:text-white">
      <Navbar />
      <section className="border-b border-black/10 px-6 py-16 text-center dark:border-white/10 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#8f7d4d] dark:text-[#dfd29a]">Discover your legal path</span>
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-6xl">Where could your law degree take you?</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">Answer eight practical questions about how you think, work and solve problems. We’ll match your answers to legal career paths worth exploring.</p>
        </div>
      </section>
      <CareerPredictor />
      <Footer />
    </main>
  );
}
