
import Hero from "@/components/Hero";
import HBOTCalculator from "@/components/HBOTCalculator";
import BookingSection from "@/components/BookingSection";
import TrustSection from "@/components/TrustSection";
import ResearchSection from "@/components/ResearchSection";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`min-h-screen bg-gradient-to-b from-hbo-charcoal to-hbo-charcoal/95 font-libre ${isMobile ? 'pb-0' : ''}`}>
      <Navigation />
      <Hero />
      <div className="relative z-10 bg-white">
        <HBOTCalculator />
      </div>
      <div className="relative z-10 bg-hbo-charcoal/98">
        <ResearchSection />
        <BookingSection />
        <TrustSection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
