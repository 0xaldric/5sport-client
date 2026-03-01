"use client";

import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AthleteRow } from "./athlete-row";

const mockAthletes = [
  { id: 1, name: "Nguyễn Văn A", avatar: "", sport: "Pickleball", rating: 4.9 },
  { id: 2, name: "Trần Thị B", avatar: "", sport: "Bóng bàn", rating: 4.8 },
  { id: 3, name: "Lê Văn C", avatar: "", sport: "Pickleball", rating: 4.7 },
  { id: 4, name: "Phạm Thị D", avatar: "", sport: "Bóng rổ", rating: 4.6 },
  { id: 5, name: "Hoàng Văn E", avatar: "", sport: "Pickleball", rating: 4.5 },
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
    <section className="mx-auto max-w-container px-6 py-16 lg:px-20">
      <h2 className="text-2xl font-extrabold tracking-tight text-secondary">
        {t("title")}
      </h2>
      <p className="mt-2 text-sm text-slate-500">{t("subtitle")}</p>

      <Tabs defaultValue="all" className="mt-6">
        <TabsList className="h-auto gap-2 bg-transparent p-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="cursor-pointer rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-500 transition-all duration-200 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:shadow-primary/20"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="divide-y divide-slate-100">
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
      </div>
    </section>
  );
}
