import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AthleteRowProps {
  rank: number;
  name: string;
  avatar: string;
  sport: string;
  rating: number;
}

export function AthleteRow({
  rank,
  name,
  avatar,
  sport,
  rating,
}: AthleteRowProps) {
  return (
    <div className="flex items-center gap-4 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent/50">
      {/* Rank */}
      <span className="w-6 text-center text-sm font-bold text-muted-foreground">
        {rank}
      </span>

      {/* Avatar */}
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </AvatarFallback>
      </Avatar>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">
          {name}
        </p>
        <p className="text-xs text-muted-foreground">{sport}</p>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1">
        <span className="text-sm font-bold text-yellow-500">★</span>
        <span className="text-sm font-semibold text-foreground">{rating}</span>
      </div>
    </div>
  );
}
