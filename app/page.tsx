import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-teal-50/50 flex items-center justify-center">
      <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-r from-teal-100 to-teal-200 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px) linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:6rem_4rem]" />

      <section className="w-full px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8 flex flex-col items-center space-y-10 text-center">
      {/* Hero content */}
      <header className="space-y-6">
        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl bg-gradient-to-r from-teal-900 via-teal-800 to-teal-900 bg-clip-text text-transparent">
        Ask Me Stuff!
        </h1>
        <p className="max-w-[600px] text-lg text-teal-600 md:text-xl/relaxed xl:text-2xl/relaxed">
        An AI chat companion that can actually get things done!
        <br />
        <span className="text-teal-400 text-sm">
          Powered by IBM&apos;s WxTools & your favourite LLM&apos;s.
        </span>
        </p>
      </header>

      {/* CTA Button */}
      <SignedIn>
        <Link href="/dashboard">
        <button className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white bg-gradient-to-r from-teal-900 to-teal-800 rounded-full hover:from-teal-800 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
          Get Started
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-900/20 to-teal-800/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
        </Link>
      </SignedIn>

      <SignedOut>
        <SignInButton
        mode="modal"
        fallbackRedirectUrl={"/dashboard"}
        forceRedirectUrl={"/dashboard"}
        >
        <button className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white bg-gradient-to-r from-teal-900 to-teal-800 rounded-full hover:from-teal-800 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
          Sign Up
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-900/20 to-teal-800/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
        </SignInButton>
      </SignedOut>

      {/* Features grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 pt-8 max-w-3xl mx-auto">
        {[
        { title: "Fast", description: "Real-time streamed responses" },
        {
          title: "Modern",
          description: "Next.js 15, Tailwind CSS, Convex, Clerk",
        },
        { title: "Smart", description: "Powered by Your Favourite LLM's" },
        ].map(({ title, description }) => (
        <div key={title} className="text-center">
          <div className="text-2xl font-semibold text-teal-900">
          {title}
          </div>
          <div className="text-sm text-teal-600 mt-1">{description}</div>
        </div>
        ))}
      </div>
      </section>
    </main>
  );
}