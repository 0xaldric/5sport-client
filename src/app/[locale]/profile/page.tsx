"use client";

import { useState } from "react";
import { ProfileHero } from "@/components/profile/profile-hero";
import { ProfileStatsCards } from "@/components/profile/profile-stats-cards";
import { ProfileDashboard } from "@/components/profile/profile-dashboard";
import { SportStats } from "@/components/profile/sport-stats";

const SPORTS = [
  { value: "all", label: "Tất cả" },
  { value: "pickleball", label: "Pickleball" },
  { value: "table-tennis", label: "Bóng bàn" },
  { value: "basketball", label: "Bóng rổ" },
  { value: "badminton", label: "Cầu lông" },
];

export default function ProfilePage() {
  const [selectedSport, setSelectedSport] = useState("all");

  return (
    <div className="min-h-screen bg-slate-50">
      <ProfileHero />

      {/* Sport Filter */}
      <div className="sticky top-16 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-container px-6 lg:px-20">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
            {SPORTS.map((sport) => (
              <button
                key={sport.value}
                onClick={() => setSelectedSport(sport.value)}
                className={`cursor-pointer shrink-0 rounded-full border px-5 py-2 text-sm font-medium transition-all duration-200 ${
                  selectedSport === sport.value
                    ? "border-primary bg-primary text-white shadow-sm shadow-primary/20"
                    : "border-slate-200 bg-white text-slate-500 hover:border-primary/30 hover:text-primary"
                }`}
              >
                {sport.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-container px-6 py-8 lg:px-20">
        {/* 4 Stat Cards */}
        <ProfileStatsCards sport={selectedSport} />

        {/* Dashboard Split */}
        <ProfileDashboard />

        {/* Sport-specific Stats */}
        <SportStats sport={selectedSport} />
      </div>
    </div>
  );
}
