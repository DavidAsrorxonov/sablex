import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

import {
  ChevronDownIcon,
  GlobeIcon,
  MenuIcon,
} from "@/components/homepage-icons";

const navItems = ["Home", "For You", "Local", "Blindspot"];

export function SiteHeader() {
  return (
    <header>
      <div className="bg-[#202020] text-white">
        <div className="mx-auto flex min-h-9 w-full max-w-365 items-center justify-between gap-4 px-4 text-[11px] sm:px-6 lg:px-12">
          <div className="flex min-w-0 items-center gap-4 text-white/90">
            <span className="hidden sm:inline">Browser Extension</span>
            <span className="hidden h-4 w-px bg-white/20 sm:inline-block" />
            <span className="whitespace-nowrap">
              Theme: <strong className="font-semibold text-white">Light</strong>
            </span>
            <span className="hidden sm:inline">Dark</span>
            <span className="hidden sm:inline">Auto</span>
          </div>

          <div className="flex min-w-0 items-center gap-4 text-white/90">
            <span className="hidden md:inline">Monday, June 1, 2026</span>
            <span className="hidden sm:inline">Set Location</span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              <GlobeIcon className="size-3.5" />
              <span className="hidden sm:inline">International Edition</span>
              <span className="inline sm:hidden">Intl</span>
              <ChevronDownIcon className="size-3.5" />
            </span>
          </div>
        </div>
      </div>

      <div className="border-b border-[#D5D7DB] bg-[#F7F7F4]">
        <div className="mx-auto flex min-h-18 w-full max-w-365 items-center gap-4 px-4 sm:px-6 lg:px-12">
          <button
            type="button"
            aria-label="Open menu"
            className="flex size-9 shrink-0 items-center justify-center rounded-md text-[#111114] transition hover:bg-black/5"
          >
            <MenuIcon />
          </button>

          <a
            href="#"
            className="mr-2 shrink-0 leading-none"
            aria-label="sablex News home"
          >
            <span className="block text-[30px] font-bold tracking-normal sm:text-[34px]">
              sablex
            </span>
            <span className="-mt-1 block text-center text-[11px] font-semibold text-[#676C74]">
              News
            </span>
          </a>

          <nav
            aria-label="Primary navigation"
            className="hidden h-18 flex-1 items-stretch overflow-x-auto md:flex"
          >
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                aria-current={item === "Home" ? "page" : undefined}
                className="relative flex min-w-fit items-center px-5 text-[14px] font-semibold text-[#111114]"
              >
                <span className="relative">
                  {item}
                  {item === "For You" && (
                    <span className="absolute -right-2 -top-1 size-1.5 rounded-full bg-[#B42318]" />
                  )}
                </span>
                {item === "Home" && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#111114]" />
                )}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <Show when="signed-out">
              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-[#171717] px-4 text-[12px] font-bold text-white shadow-sablex-sm transition hover:bg-black sm:h-12 sm:px-8 sm:text-[14px]"
                >
                  Sign up
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-[#AEB3BA] bg-white/50 px-4 text-[12px] font-bold text-[#111114] shadow-sablex-sm transition hover:bg-white sm:h-12 sm:px-9 sm:text-[14px]"
                >
                  Sign in
                </button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </div>

        <nav
          aria-label="Mobile navigation"
          className="flex gap-1 overflow-x-auto border-t border-[#E1E2E4] px-4 md:hidden"
        >
          {navItems.map((item) => (
            <a
              key={item}
              href="#"
              aria-current={item === "Home" ? "page" : undefined}
              className="relative flex h-11 min-w-fit items-center px-3 text-[13px] font-semibold"
            >
              {item}
              {item === "Home" && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#111114]" />
              )}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
