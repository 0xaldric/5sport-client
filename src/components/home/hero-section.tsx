"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent" />

      <div className="relative mx-auto flex max-w-container flex-col gap-6 px-6 py-16 lg:flex-row lg:items-center lg:px-20 lg:py-24">
        {/* Main Hero Content */}
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
          <p className="max-w-lg text-base text-white/80 md:text-lg">
            {t("subtitle")}
          </p>
          <Button
            size="lg"
            className="bg-green-500 text-base font-semibold text-white hover:bg-green-600"
          >
            {t("cta")}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Promo Card */}
        <div className="w-full max-w-sm lg:w-[340px]">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md">
            <div className="mb-4 aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500">
              <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                <span className="text-3xl font-extrabold text-white drop-shadow-lg">
                  PICKLEBALL
                </span>
                <span className="mt-1 text-sm font-bold uppercase text-white/90">
                  {t("promoSubtitle")}
                </span>
                <span className="mt-3 rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-orange-600">
                  Book Now!
                </span>
              </div>
            </div>
            <p className="text-center text-sm font-medium text-white/70">
              {t("promoSubtitle")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
