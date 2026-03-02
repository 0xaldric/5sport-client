"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCard {
  label: string;
  value: string | number;
  sub: string;
  trend: "up" | "down" | "neutral";
  trendValue: string;
  accent: string;
  bg: string;
  icon: React.ReactNode;
}

const STAT_DATA: Record<string, StatCard[]> = {
  all: [
    {
      label: "Điểm đôi",
      value: "1.840",
      sub: "Rating đôi",
      trend: "up",
      trendValue: "+42 tuần này",
      accent: "text-primary",
      bg: "bg-primary/5",
      icon: (
        <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: "Điểm đơn",
      value: "2.105",
      sub: "Rating đơn",
      trend: "up",
      trendValue: "+88 tuần này",
      accent: "text-blue-600",
      bg: "bg-blue-50",
      icon: (
        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      label: "Hạng",
      value: "#47",
      sub: "Toàn quốc",
      trend: "up",
      trendValue: "↑12 so với tháng trước",
      accent: "text-amber-600",
      bg: "bg-amber-50",
      icon: (
        <svg className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
    },
    {
      label: "Sự kiện",
      value: 34,
      sub: "Đã tham gia",
      trend: "up",
      trendValue: "+3 tháng này",
      accent: "text-emerald-600",
      bg: "bg-emerald-50",
      icon: (
        <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ],
  pickleball: [
    {
      label: "Điểm đôi",
      value: "1.920",
      sub: "Pickleball đôi",
      trend: "up",
      trendValue: "+60 tuần này",
      accent: "text-primary",
      bg: "bg-primary/5",
      icon: (
        <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: "Điểm đơn",
      value: "2.210",
      sub: "Pickleball đơn",
      trend: "up",
      trendValue: "+95 tuần này",
      accent: "text-blue-600",
      bg: "bg-blue-50",
      icon: (
        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      label: "Hạng",
      value: "#12",
      sub: "HCM - Pickleball",
      trend: "up",
      trendValue: "↑5 so với tháng trước",
      accent: "text-amber-600",
      bg: "bg-amber-50",
      icon: (
        <svg className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
    },
    {
      label: "Sự kiện",
      value: 21,
      sub: "Pickleball",
      trend: "up",
      trendValue: "+2 tháng này",
      accent: "text-emerald-600",
      bg: "bg-emerald-50",
      icon: (
        <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ],
};

function TrendIcon({ trend }: { trend: "up" | "down" | "neutral" }) {
  if (trend === "up") return <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />;
  if (trend === "down") return <TrendingDown className="h-3.5 w-3.5 text-red-500" />;
  return <Minus className="h-3.5 w-3.5 text-slate-400" />;
}

export function ProfileStatsCards({ sport }: { sport: string }) {
  const cards = STAT_DATA[sport] ?? STAT_DATA.all;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-100"
        >
          <div className="flex items-start justify-between">
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", card.bg)}>
              {card.icon}
            </div>
            <div className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", card.trend === "up" ? "bg-emerald-50 text-emerald-600" : card.trend === "down" ? "bg-red-50 text-red-500" : "bg-slate-100 text-slate-500")}>
              <TrendIcon trend={card.trend} />
            </div>
          </div>

          <div className="mt-4">
            <p className="text-2xl font-extrabold tracking-tight text-secondary lg:text-3xl">
              {card.value}
            </p>
            <p className="mt-0.5 text-sm font-semibold text-slate-600">{card.label}</p>
            <p className="text-xs text-slate-400">{card.sub}</p>
          </div>

          <div className="mt-3 border-t border-slate-100 pt-3">
            <p className="text-xs text-slate-400">{card.trendValue}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
