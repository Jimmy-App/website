import dynamic from 'next/dynamic';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import FadeIn from '../components/ui/FadeIn';

// Lazy load below-the-fold sections
const ProblemSection = dynamic(() => import('../components/landing/ProblemSection'));
const CoreFeaturesSection = dynamic(() => import('../components/landing/CoreFeaturesSection'));
const ClientExperienceSection = dynamic(() => import('../components/landing/ClientExperienceSection'));
const PricingSection = dynamic(() => import('../components/landing/PricingSection'));
const ManifestoSection = dynamic(() => import('../components/landing/ManifestoSection'));
const Footer = dynamic(() => import('../components/landing/Footer'));

const App = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-purple-100 selection:text-purple-900">
      <Navbar />
      <Hero />
      <FadeIn delay={0.2}><ProblemSection /></FadeIn>
      <FadeIn><CoreFeaturesSection /></FadeIn>
      <FadeIn><ClientExperienceSection /></FadeIn>
      <FadeIn><PricingSection /></FadeIn>
      <FadeIn><ManifestoSection /></FadeIn>
      <Footer />
    </div>
  );
};

export default App;
