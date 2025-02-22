import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function NavBar() {
  return (
    <nav className="flex items-center justify-between py-4 px-4 md:px-6">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45" />
          </div>
          <span className="font-semibold text-xl">PreptaAI</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
        {/* <Link href="/login">
          <Button variant="ghost">Log in</Button>
        </Link>
        <Link href="/signup">
          <Button className="bg-purple-600 hover:bg-purple-700">Sign up</Button>
        </Link> */}
      </div>
    </nav>
  );
}
