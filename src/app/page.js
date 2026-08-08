import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/home/Hero';
import FeaturedArticles from '../components/home/FeaturedArticles';
import Opportunities from '../components/home/Opportunities';
import Community from '../components/home/Community';
import Newsletter from '../components/home/Newsletter';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <FeaturedArticles />
      <Opportunities />
      <Community />
      <Newsletter />
      <Footer />
    </main>
  );
}
