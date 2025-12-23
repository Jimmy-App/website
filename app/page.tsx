import Footer from '../components/landing/Footer';
import Hero from '../components/landing/Hero';
import Navbar from '../components/landing/Navbar';
import ClientExperienceSection from '../components/landing/ClientExperienceSection';
import PricingSection from '../components/landing/PricingSection';
import ManifestoSection from '../components/landing/ManifestoSection';
import CoreFeaturesSection from '../components/landing/CoreFeaturesSection';
import ProblemSection from '../components/landing/ProblemSection';

const App = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-purple-100 selection:text-purple-900">
      <Navbar />
      <Hero />
      <ProblemSection />
      <CoreFeaturesSection />
      <ClientExperienceSection />
      <PricingSection />
      <ManifestoSection />
      <Footer />
    </div>
  );
};

export default App;
