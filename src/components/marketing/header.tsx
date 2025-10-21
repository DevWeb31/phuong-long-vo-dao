"use client";

import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function Header() {
  const t = useTranslations("common");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: t("navigation.home"), href: "/" },
    { name: t("navigation.clubs"), href: "/clubs" },
    { name: t("navigation.courses"), href: "/courses" },
    { name: t("navigation.events"), href: "/events" },
    { name: t("navigation.news"), href: "/news" },
    { name: t("navigation.contact"), href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <nav className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group transition-all duration-300">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl martial-gradient text-xl font-bold text-white shadow-md group-hover:shadow-lg group-hover:shadow-primary/25 transition-all duration-500 group-hover:scale-105">
            <span className="drop-shadow-lg">PL</span>
          </div>
          <span className="hidden text-lg font-bold sm:inline-block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent group-hover:from-accent group-hover:via-primary group-hover:to-secondary transition-all duration-500">
            Phuong Long Vo Dao
          </span>
        </Link>

        {/* Navigation desktop */}
        <div className="hidden md:flex md:items-center md:gap-8">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-primary hover:scale-105 relative group py-2.5"
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/dashboard" className="hidden sm:block">
            <Button variant="outline" size="sm" className="dragon-hover font-medium">
              {t("navigation.dashboard")}
            </Button>
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md hover:bg-accent/10 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Navigation mobile */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background/95 backdrop-blur md:hidden animate-slide-in-top shadow-lg">
          <div className="container space-y-1 py-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-5 py-3.5 text-base font-medium text-muted-foreground hover:bg-accent/10 hover:text-primary transition-all duration-300 hover:translate-x-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-3 mt-2 border-t border-border/50">
              <Link
                href="/dashboard"
                className="block rounded-lg px-5 py-3.5 text-base font-medium text-primary hover:bg-primary/10 transition-all duration-300 hover:translate-x-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("navigation.dashboard")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

