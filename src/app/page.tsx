import { HeroSection } from "@/components/hero";
import { AppPreview } from "@/components/app-preview";
import FeaturesSection from "@/components/features";
import FAQSection from "@/components/faq";
import FooterSection from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-teal-50 pt-24">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      {/* <HeroSection /> */}
      <AppPreview />
      <FeaturesSection />
      <FAQSection />
      <FooterSection />
    </div>
  );
}
