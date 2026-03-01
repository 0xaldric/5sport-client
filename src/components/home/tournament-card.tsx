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
    <div className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <Badge className="absolute left-3 top-3 border-0 bg-primary/90 text-xs font-semibold text-white backdrop-blur-sm">
          {sport}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="line-clamp-2 text-sm font-bold text-secondary">
          {title}
        </h3>
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span className="line-clamp-1">{location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Users className="h-3.5 w-3.5 text-primary" />
            <span>
              {participants} {t("participants")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
