"use client";

import { Calendar, MapPin, Trophy, Target, ChevronRight, Star, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";

interface UpcomingEvent {
  id: number;
  name: string;
  sport: string;
  date: string;
  location: string;
  status: "registered" | "confirmed";
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  date: string;
  type: "rank" | "win" | "milestone";
  highlight?: boolean;
}

interface Milestone {
  label: string;
  current: number;
  target: number;
  unit: string;
  description: string;
}

const UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    id: 1,
    name: "HCM Pickleball Open 2026",
    sport: "Pickleball",
    date: "15/03/2026",
    location: "Thủ Đức, TP.HCM",
    status: "confirmed",
  },
  {
    id: 2,
    name: "Giải Bóng Bàn Cúp Mùa Xuân",
    sport: "Bóng bàn",
    date: "22/03/2026",
    location: "Quận 1, TP.HCM",
    status: "registered",
  },
  {
    id: 3,
    name: "5Sport Championship Q2",
    sport: "Pickleball",
    date: "05/04/2026",
    location: "Bình Thạnh, TP.HCM",
    status: "registered",
  },
];

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 1,
    title: "Top 10 Pickleball HCM",
    description: "Đạt hạng #8 trong bảng xếp hạng Pickleball TP.HCM tháng 2/2026",
    date: "02/2026",
    type: "rank",
    highlight: true,
  },
  {
    id: 2,
    title: "Vô địch đôi nam",
    description: "Vô địch nội dung đôi nam tại 5Sport Winter Cup 2025",
    date: "12/2025",
    type: "win",
  },
  {
    id: 3,
    title: "30 sự kiện tham gia",
    description: "Hoàn thành cột mốc 30 giải đấu",
    date: "01/2026",
    type: "milestone",
  },
];

const NEXT_MILESTONE: Milestone = {
  label: "50 sự kiện",
  current: 34,
  target: 50,
  unit: "sự kiện",
  description: "Còn 16 giải nữa để đạt huy hiệu 'Chiến binh 50 trận'",
};

function getAchievementIcon(type: Achievement["type"]) {
  switch (type) {
    case "rank":
      return <Star className="h-4 w-4 fill-amber-400 text-amber-400" />;
    case "win":
      return <Trophy className="h-4 w-4 text-primary" />;
    case "milestone":
      return <Zap className="h-4 w-4 text-accent" />;
  }
}

function getAchievementBg(type: Achievement["type"]) {
  switch (type) {
    case "rank":
      return "bg-amber-50";
    case "win":
      return "bg-primary/5";
    case "milestone":
      return "bg-accent/10";
  }
}

export function ProfileDashboard() {
  const progress = Math.round((NEXT_MILESTONE.current / NEXT_MILESTONE.target) * 100);

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Left: My Upcoming Events */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-secondary">Sự kiện sắp tới</h2>
            <p className="text-xs text-slate-400">Các giải đấu bạn đã đăng ký</p>
          </div>
          <Link
            href="/events"
            className="flex cursor-pointer items-center gap-1 text-xs font-medium text-primary transition-colors duration-200 hover:text-primary/80"
          >
            Xem tất cả
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-50 px-5">
          {UPCOMING_EVENTS.map((event) => (
            <div key={event.id} className="group flex items-center gap-3 py-4">
              {/* Sport badge */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/5">
                <Calendar className="h-5 w-5 text-primary" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-secondary group-hover:text-primary transition-colors duration-200">
                  {event.name}
                </p>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {event.location}
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <Badge className="text-xs border-0 bg-primary/10 px-2 py-0.5 font-medium text-primary">
                  {event.sport}
                </Badge>
                <span
                  className={`text-xs font-medium ${
                    event.status === "confirmed"
                      ? "text-emerald-600"
                      : "text-amber-500"
                  }`}
                >
                  {event.status === "confirmed" ? "Xác nhận" : "Đã đăng ký"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty footer CTA */}
        <div className="border-t border-slate-100 px-5 py-3">
          <Link
            href="/events"
            className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-200 py-2.5 text-xs font-medium text-slate-400 transition-all duration-200 hover:border-primary/30 hover:text-primary"
          >
            <Calendar className="h-3.5 w-3.5" />
            Tìm sự kiện mới
          </Link>
        </div>
      </div>

      {/* Right: Recent Achievements + Next Milestone */}
      <div className="flex flex-col gap-5">
        {/* Top Achievement */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-base font-bold text-secondary">Thành tích nổi bật</h2>
            <p className="text-xs text-slate-400">Những cột mốc bạn đã đạt được</p>
          </div>

          <div className="space-y-1 px-5 py-3">
            {ACHIEVEMENTS.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex items-start gap-3 rounded-xl p-3 transition-colors duration-200 ${
                  achievement.highlight
                    ? "bg-amber-50/60 ring-1 ring-amber-100"
                    : "hover:bg-slate-50"
                }`}
              >
                <div
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${getAchievementBg(achievement.type)}`}
                >
                  {getAchievementIcon(achievement.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-secondary">{achievement.title}</p>
                    {achievement.highlight && (
                      <Badge className="border-0 bg-amber-100 px-1.5 py-0 text-[10px] font-bold text-amber-700">
                        Mới nhất
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400">{achievement.description}</p>
                </div>
                <span className="shrink-0 text-xs text-slate-300">{achievement.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Milestone */}
        <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 via-white to-accent/5 p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-secondary">Mục tiêu tiếp theo</h3>
              <p className="text-xs text-slate-400">{NEXT_MILESTONE.label}</p>
            </div>
            <div className="ml-auto text-right">
              <span className="text-lg font-extrabold text-primary">{NEXT_MILESTONE.current}</span>
              <span className="text-sm text-slate-400">/{NEXT_MILESTONE.target}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-blue-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-slate-500">{NEXT_MILESTONE.description}</p>
              <span className="text-xs font-bold text-primary">{progress}%</span>
            </div>
          </div>

          {/* Bonus hint */}
          <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-accent/20 px-3 py-2">
            <Zap className="h-3.5 w-3.5 text-secondary" />
            <p className="text-xs font-medium text-secondary">
              Đạt mục tiêu sẽ mở khóa huy hiệu đặc biệt
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
