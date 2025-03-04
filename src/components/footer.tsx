import { Cpu } from "lucide-react";
import { Footer } from "@/components/ui/footer";

export default function FooterSection() {
  return (
    <div className="w-full border-t bg-background/80 backdrop-blur-sm">
      <Footer
        logo={<Cpu className="h-10 w-10 text-primary" />}
        brandName="PreptaAI"
        socialLinks={[]}
        mainLinks={[
          { href: "/interview", label: "Mock Interviews" },
          { href: "/resume", label: "Resume Analyzer" },
          { href: "/linkedin-bio", label: "LinkedIn Helper" },
          { href: "/dashboard", label: "Dashboard" },
        ]}
        legalLinks={[]}
        copyright={{
          text: `© ${new Date().getFullYear()} PreptaAI`,
          license: "Helping you ace your next interview",
        }}
      />
    </div>
  );
}
