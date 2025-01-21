"use client";

import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useNavigation } from "@/lib/context/navigation";

export default function Header() {
  const { setIsMobileNavOpen } = useNavigation();

  return (
    <header className="border-b border-teal-200/50 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileNavOpen(true)}
            className="md:hidden text-teal-500 hover:text-teal-700 hover:bg-teal-100/50"
          >
            <HamburgerMenuIcon className="h-5 w-5" />
          </Button>
          <div className="font-semibold bg-gradient-to-r from-teal-800 to-teal-600 bg-clip-text text-transparent">
            Ask Me Stuff!
          </div>
        </div>
        <div className="flex items-center">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox:
                  "h-8 w-8 ring-2 ring-teal-200/50 ring-offset-2 rounded-full transition-shadow hover:ring-teal-300/50",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}