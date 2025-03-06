import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SignupSection() {
  return (
    <section className="py-16 px-4 md:py-24 relative">
      <div className="mx-auto w-full relative z-20 sm:max-w-[40rem] md:max-w-[48rem] lg:max-w-[64rem] xl:max-w-[80rem] bg-gradient-to-br from-slate-800 dark:from-neutral-900 to-gray-900 sm:rounded-2xl">
        <div className="relative -mx-6 sm:mx-0 sm:rounded-2xl overflow-hidden px-6 md:px-8">
          <div
            className="absolute inset-0 w-full h-full opacity-10 [mask-image:radial-gradient(#fff,transparent,75%)]"
            style={{
              backgroundImage: "url(/noise.webp)",
              backgroundSize: "30%",
            }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 select-none overflow-hidden rounded-2xl"
            style={{
              mask: "radial-gradient(33.875rem 33.875rem at calc(100% - 8.9375rem) 0, white 3%, transparent 70%)",
            }}
          />
          <div className="relative px-6 pb-14 pt-20 sm:px-10 sm:pb-20 lg:px-[4.5rem]">
            <h2 className="text-center text-balance mx-auto text-3xl md:text-5xl font-semibold tracking-[-0.015em] text-white">
              Ready to transform your career?
            </h2>
            <p className="mt-4 w-full text-center mx-auto text-base/6 text-neutral-200">
              <span className="inline-block align-top text-balance">
                Interview success starts right here, begin your journey now.
              </span>
            </p>
            <div className="relative z-10 mx-auto flex justify-center mt-6">
              <Button
                asChild
                className="bg-white text-slate-900 hover:bg-slate-100 text-base md:text-lg px-6 py-4 h-auto rounded-full font-medium"
              >
                <Link href="/interview">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
