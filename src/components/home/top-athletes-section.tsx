"use client";

import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AthleteRow } from "./athlete-row";

const mockAthletes = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    avatar: "",
    sport: "Pickleball",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Trần Thị B",
    avatar: "",
    sport: "Bóng bàn",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Lê Văn C",
    avatar: "",
    sport: "Pickleball",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Phạm Thị D",
    avatar: "",
    sport: "Bóng rổ",
    rating: 4.6,
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    avatar: "",
    sport: "Pickleball",
    rating: 4.5,
  },
];

export function TopAthletesSection() {
  const t = useTranslations("athletes");
  const tTournaments = useTranslations("tournaments");

  const tabs = [
    { value: "all", label: tTournaments("all") },
    { value: "pickleball", label: tTournaments("pickleball") },
    { value: "table-tennis", label: tTournaments("tableTennis") },
    { value: "basketball", label: tTournaments("basketball") },
  ];

  return (
    <section className="mx-auto max-w-container px-6 py-12 lg:px-20">
      {/* Header */}
      <h2 className="text-2xl font-bold text-foreground">{t("title")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>

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

      {/* Athletes List */}
      <div className="mt-6 space-y-1 rounded-xl border bg-white p-2">
        {mockAthletes.map((athlete, index) => (
          <AthleteRow
            key={athlete.id}
            rank={index + 1}
            name={athlete.name}
            avatar={athlete.avatar}
            sport={athlete.sport}
            rating={athlete.rating}
          />
        ))}
      </div>
    </section>
  );
}
