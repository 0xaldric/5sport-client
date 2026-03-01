"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { GroupCard } from "./group-card";
import { ArrowRight } from "lucide-react";

const mockGroups = [
  {
    id: 1,
    name: "Caminando Atocha",
    image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=300&h=200&fit=crop",
    members: 245,
  },
  {
    id: 2,
    name: "Caminando Atocha",
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=300&h=200&fit=crop",
    members: 180,
  },
  {
    id: 3,
    name: "Caminando Atocha",
    image: "https://images.unsplash.com/photo-1461896836934-bd45ba02db7c?w=300&h=200&fit=crop",
    members: 312,
  },
  {
    id: 4,
    name: "Caminando Atocha",
    image: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=300&h=200&fit=crop",
    members: 156,
  },
  {
    id: 5,
    name: "Caminando Atocha",
    image: "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=300&h=200&fit=crop",
    members: 420,
  },
];

export function GroupsSection() {
  const t = useTranslations("groups");

  return (
    <section className="mx-auto max-w-container px-6 py-12 lg:px-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t("title")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button variant="ghost" size="sm" className="text-primary">
          {t("viewAll")}
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {/* Horizontal Scroll */}
      <div className="mt-6 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {mockGroups.map((group) => (
          <GroupCard
            key={group.id}
            name={group.name}
            image={group.image}
            members={group.members}
          />
        ))}
      </div>
    </section>
  );
}
