"use client";

import { cn } from "@/lib/utils";

interface MatchResult {
  opponent: string;
  result: "win" | "loss";
  score: string;
  event: string;
  date: string;
  type: "singles" | "doubles";
}

interface SportStatData {
  winRate: number;
  wins: number;
  losses: number;
  totalMatches: number;
  avgScore: string;
  longestWinStreak: number;
  currentStreak: number;
  currentStreakType: "win" | "loss";
  recentMatches: MatchResult[];
  specialStat?: { label: string; value: string };
}

const SPORT_DATA: Record<string, SportStatData> = {
  all: {
    winRate: 68,
    wins: 87,
    losses: 41,
    totalMatches: 128,
    avgScore: "11-7",
    longestWinStreak: 9,
    currentStreak: 4,
    currentStreakType: "win",
    recentMatches: [
      { opponent: "Trần Văn B", result: "win", score: "11-6, 11-4", event: "HCM Open", date: "01/03", type: "singles" },
      { opponent: "Lê Minh C + Ngô D", result: "win", score: "11-8, 9-11, 11-7", event: "5Sport Cup", date: "26/02", type: "doubles" },
      { opponent: "Phạm Hữu E", result: "win", score: "11-3, 11-5", event: "HCM Open", date: "24/02", type: "singles" },
      { opponent: "Hoàng Anh F", result: "loss", score: "8-11, 11-9, 7-11", event: "5Sport Cup", date: "20/02", type: "singles" },
      { opponent: "Vũ Đức G + Hà H", result: "win", score: "11-7, 11-9", event: "Team League", date: "18/02", type: "doubles" },
    ],
  },
  pickleball: {
    winRate: 74,
    wins: 62,
    losses: 22,
    totalMatches: 84,
    avgScore: "11-6",
    longestWinStreak: 9,
    currentStreak: 4,
    currentStreakType: "win",
    specialStat: { label: "Điểm dink xuất sắc", value: "Top 5% HCM" },
    recentMatches: [
      { opponent: "Trần Văn B", result: "win", score: "11-6, 11-4", event: "HCM Pickleball Open", date: "01/03", type: "singles" },
      { opponent: "Lê Minh C + Ngô D", result: "win", score: "11-8, 9-11, 11-7", event: "5Sport PB Cup", date: "26/02", type: "doubles" },
      { opponent: "Phạm Hữu E", result: "win", score: "11-3, 11-5", event: "HCM Open", date: "24/02", type: "singles" },
      { opponent: "Hoàng Anh F", result: "loss", score: "8-11, 11-9, 7-11", event: "5Sport Cup", date: "20/02", type: "singles" },
      { opponent: "Vũ Đức G + Hà H", result: "win", score: "11-7, 11-9", event: "Team League", date: "18/02", type: "doubles" },
    ],
  },
  "table-tennis": {
    winRate: 55,
    wins: 22,
    losses: 18,
    totalMatches: 40,
    avgScore: "3-1",
    longestWinStreak: 5,
    currentStreak: 1,
    currentStreakType: "win",
    specialStat: { label: "Topspin smash", value: "Thống kê 78% điểm" },
    recentMatches: [
      { opponent: "Đinh Quốc A", result: "win", score: "11-8, 9-11, 11-7, 11-4", event: "Cúp Mùa Xuân", date: "28/02", type: "singles" },
      { opponent: "Lý Minh B", result: "loss", score: "11-9, 6-11, 8-11, 9-11", event: "Cúp Mùa Xuân", date: "25/02", type: "singles" },
      { opponent: "Trần Hà C", result: "win", score: "11-4, 11-6, 11-3", event: "Vòng loại", date: "20/02", type: "singles" },
    ],
  },
  basketball: {
    winRate: 60,
    wins: 3,
    losses: 2,
    totalMatches: 5,
    avgScore: "72-65",
    longestWinStreak: 3,
    currentStreak: 2,
    currentStreakType: "loss",
    specialStat: { label: "PPG (điểm/trận)", value: "18.4" },
    recentMatches: [
      { opponent: "Team Alpha", result: "loss", score: "68-75", event: "League Season 2", date: "27/02", type: "doubles" },
      { opponent: "Team Beta", result: "loss", score: "70-78", event: "League Season 2", date: "22/02", type: "doubles" },
      { opponent: "Team Gamma", result: "win", score: "82-71", event: "League Season 2", date: "18/02", type: "doubles" },
    ],
  },
  badminton: {
    winRate: 50,
    wins: 2,
    losses: 2,
    totalMatches: 4,
    avgScore: "21-16",
    longestWinStreak: 2,
    currentStreak: 1,
    currentStreakType: "win",
    recentMatches: [
      { opponent: "Nguyễn Quốc A", result: "win", score: "21-15, 21-18", event: "Club League", date: "26/02", type: "singles" },
      { opponent: "Lê Thành B", result: "loss", score: "19-21, 21-18, 18-21", event: "Club League", date: "20/02", type: "singles" },
    ],
  },
};

function WinRateRing({ rate }: { rate: number }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const filled = (rate / 100) * circumference;

  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <svg className="-rotate-90" width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="8" />
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke="#0000FF"
          strokeWidth="8"
          strokeDasharray={`${filled} ${circumference}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-extrabold text-secondary">{rate}%</span>
        <span className="text-[10px] text-slate-400">thắng</span>
      </div>
    </div>
  );
}

export function SportStats({ sport }: { sport: string }) {
  const data = SPORT_DATA[sport] ?? SPORT_DATA.all;
  const sportLabel =
    sport === "all"
      ? "Tất cả môn"
      : sport === "pickleball"
        ? "Pickleball"
        : sport === "table-tennis"
          ? "Bóng bàn"
          : sport === "basketball"
            ? "Bóng rổ"
            : "Cầu lông";

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 px-6 py-4">
        <h2 className="text-base font-bold text-secondary">
          Thống kê chi tiết
          <span className="ml-2 rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-semibold text-primary">
            {sportLabel}
          </span>
        </h2>
        <p className="text-xs text-slate-400">Tổng quan hiệu suất thi đấu của bạn</p>
      </div>

      <div className="grid grid-cols-1 gap-0 divide-y divide-slate-50 md:grid-cols-2 md:divide-x md:divide-y-0">
        {/* Left: Key Stats */}
        <div className="p-6">
          <div className="flex items-center gap-6">
            {/* Win Rate Ring */}
            <WinRateRing rate={data.winRate} />

            {/* Stats */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 flex-1">
              <div>
                <p className="text-2xl font-extrabold text-emerald-600">{data.wins}</p>
                <p className="text-xs text-slate-400">Thắng</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-red-500">{data.losses}</p>
                <p className="text-xs text-slate-400">Thua</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-secondary">{data.totalMatches}</p>
                <p className="text-xs text-slate-400">Tổng trận</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-600">{data.avgScore}</p>
                <p className="text-xs text-slate-400">TB tỉ số</p>
              </div>
            </div>
          </div>

          {/* Streak + extra */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-sm font-bold text-secondary">{data.longestWinStreak} trận</p>
              <p className="text-xs text-slate-400">Chuỗi thắng dài nhất</p>
            </div>
            <div
              className={cn(
                "rounded-xl px-4 py-3",
                data.currentStreakType === "win" ? "bg-emerald-50" : "bg-red-50"
              )}
            >
              <p
                className={cn(
                  "text-sm font-bold",
                  data.currentStreakType === "win" ? "text-emerald-600" : "text-red-500"
                )}
              >
                {data.currentStreakType === "win" ? "+" : "-"}{data.currentStreak} trận
              </p>
              <p className="text-xs text-slate-400">
                Chuỗi hiện tại ({data.currentStreakType === "win" ? "thắng" : "thua"})
              </p>
            </div>
          </div>

          {/* Special stat */}
          {data.specialStat && (
            <div className="mt-3 flex items-center justify-between rounded-xl bg-primary/5 px-4 py-3">
              <p className="text-xs text-slate-500">{data.specialStat.label}</p>
              <p className="text-sm font-bold text-primary">{data.specialStat.value}</p>
            </div>
          )}
        </div>

        {/* Right: Recent Match History */}
        <div className="p-6">
          <h3 className="mb-4 text-sm font-bold text-secondary">Lịch sử gần đây</h3>
          <div className="space-y-2.5">
            {data.recentMatches.map((match, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2.5 transition-colors duration-200 hover:bg-slate-50"
              >
                {/* Result badge */}
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold",
                    match.result === "win"
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-red-100 text-red-500"
                  )}
                >
                  {match.result === "win" ? "T" : "L"}
                </span>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-secondary">
                    vs {match.opponent}
                  </p>
                  <p className="text-[11px] text-slate-400">{match.event}</p>
                </div>

                {/* Score + date */}
                <div className="shrink-0 text-right">
                  <p className="text-xs font-bold text-slate-600">{match.score}</p>
                  <p className="text-[11px] text-slate-400">{match.date}</p>
                </div>

                {/* Type */}
                <span
                  className={cn(
                    "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                    match.type === "singles"
                      ? "bg-blue-50 text-blue-500"
                      : "bg-purple-50 text-purple-500"
                  )}
                >
                  {match.type === "singles" ? "Đơn" : "Đôi"}
                </span>
              </div>
            ))}
          </div>

          {data.recentMatches.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <svg className="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="mt-2 text-sm text-slate-400">Chưa có trận đấu nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
