import { NavBar } from "@/components/navbar";
import { HeroSection } from "@/components/hero";
import { AppPreview } from "@/components/app-preview";

export default function Home() {
  return (
    <div className="min-h-screen bg-purple-50">
      <NavBar />
      <HeroSection />
      <AppPreview />
    </div>
  );
}
