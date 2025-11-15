import { HeroSection } from '@/components/organisms/HeroSection';
import { FeaturesSection } from '@/components/organisms/FeaturesSection';
import { HowItWorksSection } from '@/components/organisms/HowItWorksSection';
import { Footer } from '@/components/organisms/Footer';

export default function WelcomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <Footer />
    </div>
  );
}
