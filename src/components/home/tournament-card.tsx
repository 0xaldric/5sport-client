import { useTranslations } from "next-intl";
import { Calendar, MapPin, Users } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface TournamentCardProps {
  title: string;
  image: string;
  date: string;
  location: string;
  participants: number;
  sport: string;
}

export function TournamentCard({
  title,
  image,
  date,
  location,
  participants,
  sport,
}: TournamentCardProps) {
  const t = useTranslations("tournaments");

  return (
    <div className="group overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge className="absolute left-3 top-3 bg-primary text-xs font-semibold text-white">
          {sport}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
          {title}
        </h3>
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span className="line-clamp-1">{location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>
              {participants} {t("participants")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
