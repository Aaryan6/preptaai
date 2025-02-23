import { HeroSection } from "@/components/hero";
import { AppPreview } from "@/components/app-preview";

export default function Home() {
  return (
    <div className="min-h-screen bg-violet-50 dark:bg-violet-900">
      <HeroSection />
      <AppPreview />
    </div>
  );
}
