"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const menuItems = [
  {
    title: "Mock Interview",
    href: "/interview",
  },
  {
    title: "Resume Analyzer",
    href: "/resume",
  },
  {
    title: "LinkedIn Bio",
    href: "/linkedin-bio",
  },
];

export function NavBar() {
  const pathname = usePathname();
  const { user } = useUser();
  const isHome = pathname === "/";

  const shouldBeHidden =
    pathname.startsWith("/interview") && !pathname.includes("/result");

  if (shouldBeHidden) {
    return null;
  }

  return (
    <nav
      className={cn(
        "flex items-center justify-between px-4 md:px-6 h-16 border-b border-border z-50",
        isHome &&
          "max-w-7xl mx-auto w-full absolute bg-teal-500 text-white rounded-xl top-6 left-1/2 -translate-x-1/2"
      )}
    >
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2">
          <div
            className={cn(
              "w-8 h-8 rounded-lg bg-primary flex items-center justify-center",
              isHome && "bg-white"
            )}
          >
            <div
              className={cn(
                "w-4 h-4 border-2 border-white rounded-sm rotate-45",
                isHome && "border-teal-500"
              )}
            />
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
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === item.href
                ? "text-primary"
                : isHome
                ? "text-white hover:text-teal-100"
                : "text-foreground"
            )}
          >
            {item.title}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <SignedIn>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-2">
              {/* <DropdownMenuItem className="flex items-center gap-2 justify-between cursor-pointer">
                Theme <ThemeToggle />
              </DropdownMenuItem> */}
              <Link href="/dashboard">
                <DropdownMenuItem className="flex items-center gap-2 py-3 justify-between cursor-pointer">
                  Dashboard
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem className="flex items-center gap-2 py-3 justify-between cursor-pointer">
                <SignOutButton />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </nav>
  );
}
