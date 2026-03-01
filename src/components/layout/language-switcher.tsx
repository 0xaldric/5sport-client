"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const localeLabels: Record<string, { flag: string; label: string }> = {
  vi: { flag: "🇻🇳", label: "VN" },
  en: { flag: "🇬🇧", label: "EN" },
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleSwitch = (newLocale: "vi" | "en") => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-slate-600 hover:bg-slate-100 hover:text-secondary"
        >
          <span className="text-base">{localeLabels[locale].flag}</span>
          <span className="text-sm font-medium">
            {localeLabels[locale].label}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(localeLabels).map(([key, { flag, label }]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => handleSwitch(key as "vi" | "en")}
            className={locale === key ? "bg-accent" : ""}
          >
            <span className="mr-2 text-base">{flag}</span>
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
