"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./language-switcher";
import { MobileNav } from "./mobile-nav";

export function Header() {
  const t = useTranslations("nav");

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/tournaments", label: t("tournaments") },
    { href: "/clubs", label: t("clubs") },
    { href: "/groups", label: t("groups") },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-primary shadow-lg">
      <div className="mx-auto flex h-[72px] max-w-container items-center justify-between px-6 lg:px-20">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-extrabold tracking-tight text-white">
            5<span className="text-white">SPORT</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/15 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 hover:text-white"
          >
            {t("login")}
          </Button>
          <Button
            size="sm"
            className="bg-green-500 font-semibold text-white hover:bg-green-600"
          >
            {t("register")}
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
