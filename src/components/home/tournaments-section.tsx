"use client";

import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TournamentCard } from "./tournament-card";
import { ArrowRight } from "lucide-react";

const mockTournaments = [
  {
    id: 1,
    title: "Giải Quận Pickleball Liên Câu Châu Á Mở Rộng 2024",
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=250&fit=crop",
    date: "15/03/2024 - 20/03/2024",
    location: "Quận 7, TP.HCM, Pickleball Center",
    participants: 128,
    sport: "Pickleball",
  },
  {
    id: 2,
    title: "Giải Quận Pickleball Liên Câu Châu Á - OYSHO PADEL CUP",
    image: "https://images.unsplash.com/photo-1461896836934-bd45ba02db7c?w=400&h=250&fit=crop",
    date: "22/03/2024 - 25/03/2024",
    location: "Quận 1, TP.HCM, Padel Center",
    participants: 64,
    sport: "Pickleball",
  },
  {
    id: 3,
    title: "Giải Quận Pickleball Liên Câu Châu Á - The Club Championship",
    image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=400&h=250&fit=crop",
    date: "01/04/2024 - 05/04/2024",
    location: "Quận 2, TP.HCM, The Club",
    participants: 96,
    sport: "Pickleball",
  },
  {
    id: 4,
    title: "Giải Quận Pickleball Liên Câu Châu Á Mở Rộng 2024 Series 2",
    image: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=400&h=250&fit=crop",
    date: "10/04/2024 - 15/04/2024",
    location: "Quận 3, TP.HCM, Sport Arena",
    participants: 80,
    sport: "Bóng bàn",
  },
];

export function TournamentsSection() {
  const t = useTranslations("tournaments");

  const tabs = [
    { value: "all", label: t("all") },
    { value: "pickleball", label: t("pickleball") },
    { value: "table-tennis", label: t("tableTennis") },
    { value: "basketball", label: t("basketball") },
  ];

  return (
    <section className="mx-auto max-w-container px-6 py-12 lg:px-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">{t("title")}</h2>
        <Button variant="ghost" size="sm" className="text-primary">
          {t("viewAll")}
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="mt-6">
        <TabsList className="h-auto gap-1 bg-transparent p-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-full border px-4 py-2 text-sm data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mockTournaments.map((tournament) => (
          <TournamentCard key={tournament.id} {...tournament} />
        ))}
      </div>
    </section>
  );
}
