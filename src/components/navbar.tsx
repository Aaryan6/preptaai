"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Interview",
    href: "/interview",
  },
  {
    title: "Resume",
    href: "/resume",
  },
  {
    title: "LinkedIn Bio",
    href: "/linkedin-bio",
  },
];

export function NavBar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  return (
    <nav
      className={cn(
        "flex items-center justify-between px-4 md:px-6 h-16 border-b border-border",
        isHome && "dark:bg-violet-900 dark:border-violet-800"
      )}
    >
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45" />
          </div>
          <span className="font-semibold text-xl">PreptaAI</span>
        </Link>
      </div>
      <div className="flex items-center max-w-[380px] justify-between w-full">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-violet-100 hover:bg-violet-950 px-4 py-2 rounded-full",
              pathname === item.href ? "text-violet-50" : "text-foreground"
            )}
          >
            {item.title}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <Link href="/dashboard">
            <Button variant="default">Dashboard</Button>
          </Link>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
