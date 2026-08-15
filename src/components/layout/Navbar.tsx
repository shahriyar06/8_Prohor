"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/8-prohor-logo.png";

const NAV_ITEMS = [
  { name: "Home", link: "/" },
  { name: "Price", link: "/price" },
  { name: "Docs", link: "/docs" },
];

function isActive(pathname: string, link: string): boolean {
  return link === "/" ? pathname === "/" : pathname.startsWith(link);
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Route বদলালে mobile menu automatic বন্ধ হয়ে যাবে
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b bg-background/80 backdrop-blur-md shadow-sm"
          : "bg-background"
      }`}
    >
      <div className="flex items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src={logo}
            alt="8 Prohor"
            width={36}
            height={36}
            priority
            className="h-9 w-auto object-contain"
          />
          <span className="text-lg font-semibold hidden sm:inline">
            8 Prohor
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.link);
            return (
              <Link
                key={item.link}
                href={item.link}
                className={`relative py-1 transition-colors ${
                  active
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.name}
                {active && (
                  <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Login button */}
        <div className="hidden md:block">
          <Button variant="default">
            {/* <Button asChild variant="default"> */}
            <Link href="/login">Login</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-foreground"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile / Tablet drawer */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1 border-t bg-background px-5 py-3 sm:px-8">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.link);
            return (
              <Link
                key={item.link}
                href={item.link}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
          <Button variant="default" className="mt-2 w-full">
            {/* <Button asChild variant="default" className="mt-2 w-full"> */}
            <Link href="/login">Login</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
