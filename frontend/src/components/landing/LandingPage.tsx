import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import ProductShowcase from "./ProductShowcase";
import HowItWorks from "./HowItWorks";
import FeaturesBento from "./FeaturesBento";
import ComparisonSection from "./ComparisonSection";
import FaqSection from "./FaqSection";
import CtaBanner from "./CtaBanner";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-orange-100 selection:text-orange-900">
      <Navbar />

      <main>
        <HeroSection />
        <ProductShowcase />
        <HowItWorks />
        <FeaturesBento />
        <ComparisonSection />
        <FaqSection />
        <CtaBanner />
      </main>

      <Footer />
    </div>
  );
}
