import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="py-4 md:py-20 px-4 md:px-6 relative">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Master your interview skills and get hired now
        </h1>
        <p className="text-base md:text-xl text-muted-foreground dark:text-foreground/70 mb-8 max-w-2xl mx-auto">
          Practice with AI-powered mock interviews and get personalized feedback
          on your resume. Built to help you succeed in your job search.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/interview">
            <Button className="font-semibold" variant="big">
              Get Started - it&apos;s free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
