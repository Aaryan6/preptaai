import { Button } from "@/components/ui/button";
import Link from "next/link";

interface FooterProps {
  logo: React.ReactNode;
  brandName: string;
  socialLinks: Array<{
    icon: React.ReactNode;
    href: string;
    label: string;
  }>;
  mainLinks: Array<{
    href: string;
    label: string;
  }>;
  legalLinks: Array<{
    href: string;
    label: string;
  }>;
  copyright: {
    text: string;
    license?: string;
  };
}

export function Footer({
  logo,
  brandName,
  socialLinks,
  mainLinks,
  legalLinks,
  copyright,
}: FooterProps) {
  return (
    <footer className="py-10 lg:py-12 max-w-7xl mx-auto">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45" />
              </div>
              <span className="font-semibold text-xl">PreptaAI</span>
            </Link>
            <p className="mt-2 text-muted-foreground text-sm">
              Elevate your interview skills with AI-powered tools
            </p>
          </div>

          {mainLinks.length > 0 && (
            <div>
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {mainLinks.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="border-t mt-8 pt-6 text-center md:text-left">
          <div className="text-sm text-muted-foreground">
            <div>{copyright.text}</div>
            {copyright.license && (
              <div className="mt-1">{copyright.license}</div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
