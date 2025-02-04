import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="py-12 md:py-20 px-4 md:px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Ace your interviews and land your dream job
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Practice with AI-powered mock interviews and get personalized feedback
          on your resume. Built to help you succeed in your job search.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/interview">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Get Started
            </Button>
          </Link>
          <Button size="lg" variant="outline">
            Get a Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
