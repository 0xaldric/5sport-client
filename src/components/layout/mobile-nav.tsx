"use client";

import { useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export function MobileNav() {
  const t = useTranslations("nav");

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/tournaments", label: t("tournaments") },
    { href: "/clubs", label: t("clubs") },
    { href: "/groups", label: t("groups") },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px]">
        <SheetHeader>
          <SheetTitle className="text-left text-xl font-extrabold text-primary">
            5SPORT
          </SheetTitle>
        </SheetHeader>
        <Separator className="my-4" />
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Separator className="my-4" />
        <div className="flex flex-col gap-2 px-4">
          <Button variant="outline" className="w-full">
            {t("login")}
          </Button>
          <Button className="w-full bg-green-500 text-white hover:bg-green-600">
            {t("register")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
