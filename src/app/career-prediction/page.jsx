import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CareerPredictor from '@/components/career/CareerPredictor';

export const metadata = {
  title: 'Legal Career Path Predictor for Law Students',
  description: 'Take a student-friendly assessment to discover legal career paths that fit your interests, strengths and preferred working style.',
  alternates: { canonical: '/career-prediction' },
  openGraph: {
    type: 'website',
    url: '/career-prediction',
    title: 'Legal Career Path Predictor for Law Students',
    description: 'Work through 12 realistic legal scenarios and discover career paths suited to your strengths, instincts and working style.',
  },
};

export default function CareerPredictionPage() {
  return (
    <main className="min-h-screen bg-[#f8f7f3] text-zinc-950 dark:bg-zinc-950 dark:text-white">
      <Navbar />
      <section className="border-b border-black/10 px-6 py-16 text-center dark:border-white/10 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#8f7d4d] dark:text-[#dfd29a]">Discover your legal path</span>
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-6xl">Where could your law degree take you?</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">Work through 12 realistic legal scenarios drawn from a bank of more than 100. Your choices reveal how you handle pressure, evidence, people and difficult trade-offs.</p>
        </div>
      </section>
      <CareerPredictor />
      <Footer />
    </main>
  );
}
