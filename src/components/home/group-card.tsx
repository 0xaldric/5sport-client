import { useTranslations } from "next-intl";
import { Users } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface GroupCardProps {
  name: string;
  image: string;
  members: number;
}

export function GroupCard({ name, image, members }: GroupCardProps) {
  const t = useTranslations("groups");

  return (
    <div className="min-w-[260px] flex-shrink-0 overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-foreground">{name}</h3>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          <span>
            {members} {t("members")}
          </span>
        </div>
        <Button
          size="sm"
          className="mt-3 w-full bg-green-500 text-xs font-semibold text-white hover:bg-green-600"
        >
          {t("join")}
        </Button>
      </div>
    </div>
  );
}
