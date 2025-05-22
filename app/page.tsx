import Hero from '@/components/home/hero';
import ToolsGrid from '@/components/home/tools-grid';
import FeaturesSection from '@/components/home/features-section';
import FAQSection from '@/components/home/faq-section';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Hero />
      <ToolsGrid />
      <FeaturesSection />
      <FAQSection />
    </div>
  );
}