"use client";

import { use, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { usePublicEventControllerFindOne } from "@/lib/services/public/public";
import { useParticipantControllerFindAll } from "@/lib/services/participants/participants";
import { useStageControllerFindAllBySession, useStageControllerFindMatchesByStage } from "@/lib/services/stages/stages";
import { useMatchScoreControllerFindAll } from "@/lib/services/match-scores/match-scores";
import type { MatchScore } from "@/lib/schemas/matchScore";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { EventParticipant } from "@/lib/schemas/eventParticipant";
import type { Stage } from "@/lib/schemas/stage";
import type { SessionResponseDto } from "@/lib/schemas/sessionResponseDto";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Share2,
  CreditCard,
  FileText,
  CheckCircle2,
  BadgeCheck,
  Users,
  Trophy,
  Info,
  Layers,
  Swords,
} from "lucide-react";
import type { EventResponseDto } from "@/lib/schemas/eventResponseDto";
import type { Match } from "@/lib/schemas/match";

type EventMedia = { id: string; type: "LOGO" | "WALLPAPER" | "EMAIL_IMAGE"; url: string };
type EventWithMedia = EventResponseDto & { media?: EventMedia[] };

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusStyle(status: string) {
  switch (status) {
    case "LIVE":
      return "bg-emerald-500/10 text-emerald-700 border-emerald-200";
    case "PUBLISHED":
      return "bg-primary/10 text-primary border-primary/20";
    case "CLOSED":
      return "bg-slate-100 text-slate-600 border-slate-200";
    case "CANCELLED":
      return "bg-red-50 text-red-600 border-red-200";
    default:
      return "bg-slate-100 text-slate-500 border-slate-200";
  }
}

type Tab = "overview" | "bracket" | "participants" | "matches";

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const t = useTranslations("events");
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const { data, isLoading } = usePublicEventControllerFindOne(id);
  const { data: participantsData } = useParticipantControllerFindAll(id);

  const event = data as EventWithMedia | undefined;

  const logoUrl = useMemo(() => {
    const logos = event?.media?.filter((m) => m.type === "LOGO") ?? [];
    return logos[logos.length - 1]?.url;
  }, [event]);

  const wallpaperUrl = useMemo(() => {
    const wallpapers = event?.media?.filter((m) => m.type === "WALLPAPER") ?? [];
    return wallpapers[wallpapers.length - 1]?.url;
  }, [event]);
  const participants = (participantsData as EventParticipant[] | undefined) ?? [];

  const sessionGroups = useMemo(() => {
    const groups = new Map<string, { session: SessionResponseDto; participants: EventParticipant[] }>();
    const noSession: EventParticipant[] = [];

    for (const p of participants) {
      if (p.sessionId && p.session) {
        if (!groups.has(p.sessionId)) {
          groups.set(p.sessionId, { session: p.session as unknown as SessionResponseDto, participants: [] });
        }
        groups.get(p.sessionId)!.participants.push(p);
      } else {
        noSession.push(p);
      }
    }

    return { groups: Array.from(groups.entries()), noSession };
  }, [participants]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-container px-6 py-10 lg:px-20">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-6 aspect-[3/1] w-full rounded-2xl" />
        <div className="mt-8 space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="mx-auto flex max-w-container flex-col items-center px-6 py-20 text-center lg:px-20">
        <h2 className="text-xl font-bold text-secondary">Event not found</h2>
        <Link href="/events">
          <Button className="mt-4 bg-primary text-white hover:bg-primary/90">
            {t("backToEvents")}
          </Button>
        </Link>
      </div>
    );
  }

  const statusKey = `status${event.status.charAt(0)}${event.status.slice(1).toLowerCase()}` as
    | "statusDraft"
    | "statusPublished"
    | "statusLive"
    | "statusClosed"
    | "statusCancelled";

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "overview", label: "Tổng quan", icon: <Info className="h-4 w-4" /> },
    { key: "bracket", label: "Bảng đấu", icon: <Trophy className="h-4 w-4" /> },
    { key: "matches", label: "Trận đấu", icon: <Swords className="h-4 w-4" /> },
    { key: "participants", label: `Người tham gia${participants.length > 0 ? ` (${participants.length})` : ""}`, icon: <Users className="h-4 w-4" /> },
  ];

  return (
    <div className="mx-auto max-w-container px-6 py-8 lg:px-20">
      {/* Back */}
      <Link
        href="/events"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("backToEvents")}
      </Link>

      {/* === Banner === */}
      <div className="relative mt-6 overflow-hidden rounded-2xl">
        <div className="relative aspect-[3/1] w-full bg-gradient-to-br from-secondary via-secondary/90 to-primary/80">
          {wallpaperUrl ? (
            <Image
              src={wallpaperUrl}
              alt={event.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl font-black uppercase tracking-tighter text-white/10 md:text-8xl">
                {event.sportType}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        <div className="relative -mt-20 px-6 pb-6 md:-mt-24 md:px-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-end">
            {/* Logo */}
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-white shadow-lg md:h-32 md:w-32">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={event.name}
                  width={120}
                  height={120}
                  className="rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80">
                  <span className="text-2xl font-black text-white md:text-3xl">
                    {event.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Title + meta */}
            <div className="min-w-0 flex-1 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-0 bg-secondary/80 text-xs font-semibold text-white backdrop-blur-sm">
                  {event.sportType}
                </Badge>
                {event.status !== "PUBLISHED" && (
                  <Badge
                    variant="outline"
                    className={`text-xs font-semibold ${getStatusStyle(event.status)}`}
                  >
                    {t(statusKey)}
                  </Badge>
                )}
              </div>
              <h1 className="mt-2 flex items-center gap-2 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                {event.name}
                {event.status === "PUBLISHED" && (
                  <BadgeCheck className="h-6 w-6 shrink-0 text-[#1877F2]" strokeWidth={2.5} />
                )}
              </h1>
              {event.brand && (
                <p className="mt-1 text-sm font-medium text-white/70">{event.brand}</p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex shrink-0 gap-3">
              <Button
                variant="outline"
                size="sm"
                className="border-white bg-white/20 text-secondary/80 backdrop-blur-sm hover:bg-white/40 hover:text-secondary"
              >
                <Share2 className="mr-2 h-4 w-4" />
                {t("share")}
              </Button>
              <Link href={`/events/${id}/register`}>
                <Button
                  size="sm"
                  className="bg-primary font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary/90"
                >
                  {t("register")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* === Tabs === */}
      <div className="mt-6 border-b border-slate-200">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex cursor-pointer items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors duration-200 ${activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-secondary"
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* === Tab Content === */}
      <div className="mt-6">

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Event Info */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-secondary">{t("eventInfo")}</h2>
                <Separator className="my-4" />
                <div className="space-y-4">
                  <InfoRow icon={MapPin} label={t("address")} value={`${event.address}${event.wardName ? `, ${event.wardName}` : ""}${event.provinceName ? `, ${event.provinceName}` : ""}`} />
                  <InfoRow icon={Phone} label={t("hotline")} value={event.hotline} />
                  <InfoRow icon={Calendar} label={t("eventStart")} value={formatDateTime(event.eventStartTime)} />
                  <InfoRow icon={Calendar} label={t("eventEnd")} value={formatDateTime(event.eventEndTime)} />
                </div>
              </div>

              {/* Schedule */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-secondary">{t("schedule")}</h2>
                <Separator className="my-4" />
                <div className="space-y-3">
                  <ScheduleItem icon={Clock} label={t("checkin")} start={formatDateTime(event.checkinOpenTime)} end={formatDateTime(event.checkinCloseTime)} />
                  <ScheduleItem icon={FileText} label={t("editInfo")} start={formatDateTime(event.editInfoOpenTime)} end={formatDateTime(event.editInfoCloseTime)} />
                  {event.transferOpenTime && event.transferCloseTime && (
                    <ScheduleItem icon={Share2} label={t("transfer")} start={formatDateTime(event.transferOpenTime)} end={formatDateTime(event.transferCloseTime)} />
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {event.paymentMethods.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-secondary">
                    <CreditCard className="h-4 w-4 text-primary" />
                    {t("paymentMethods")}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {event.paymentMethods.map((method) => (
                      <Badge key={method} variant="outline" className="border-slate-200 text-xs font-medium text-slate-600">
                        {method.replace(/_/g, " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {(event.termsFileUrl || event.conditionsFileUrl) && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-secondary">
                    <FileText className="h-4 w-4 text-primary" />
                    {t("terms")} & {t("conditions")}
                  </h3>
                  <div className="mt-4 space-y-2">
                    {event.termsFileUrl && (
                      <a href={event.termsFileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-slate-100">
                        <CheckCircle2 className="h-4 w-4" />
                        {t("terms")}
                      </a>
                    )}
                    {event.conditionsFileUrl && (
                      <a href={event.conditionsFileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-slate-100">
                        <CheckCircle2 className="h-4 w-4" />
                        {t("conditions")}
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <Link href={`/events/${id}/register`} className="block">
                  <Button className="w-full bg-primary py-6 text-base font-bold text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30">
                    {t("register")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Bracket Tab */}
        {activeTab === "bracket" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-secondary">Bảng đấu</h2>
              <Badge variant="outline" className="border-primary/20 text-xs font-semibold text-primary">
                {event.sportType}
              </Badge>
            </div>

            {/* Group stage table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">#</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Đội / VĐV</th>
                    <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-500">Trận</th>
                    <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-500">Thắng</th>
                    <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-500">Thua</th>
                    <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-500">Điểm</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                          <Trophy className="h-7 w-7 text-slate-400" />
                        </div>
                        <p className="font-semibold text-secondary">Bảng đấu chưa được cập nhật</p>
                        <p className="text-xs text-slate-400">Thông tin sẽ được cập nhật khi giải đấu bắt đầu</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Matches Tab */}
        {activeTab === "matches" && (
          <div className="space-y-4">
            {sessionGroups.groups.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col items-center gap-3 py-16 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                    <Swords className="h-7 w-7 text-slate-400" />
                  </div>
                  <p className="font-semibold text-secondary">Chưa có trận đấu</p>
                  <p className="text-xs text-slate-400">Thông tin sẽ được cập nhật khi giải đấu bắt đầu</p>
                </div>
              </div>
            ) : (
              sessionGroups.groups.map(([sessionId, { session }]) => (
                <MatchesSessionGroup
                  key={sessionId}
                  eventId={id}
                  sessionId={sessionId}
                  session={session}
                />
              ))
            )}
          </div>
        )}

        {/* Participants Tab */}
        {activeTab === "participants" && (
          <div className="space-y-4">
            {/* Count banner */}
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-black text-secondary">{participants.length}</p>
                <p className="text-sm text-slate-500">Người đã đăng ký tham gia</p>
              </div>
            </div>

            {participants.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col items-center gap-3 py-16 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                    <Users className="h-7 w-7 text-slate-400" />
                  </div>
                  <p className="font-semibold text-secondary">Chưa có người tham gia</p>
                  <p className="text-xs text-slate-400">Hãy là người đầu tiên đăng ký!</p>
                  <Link href={`/events/${id}/register`}>
                    <Button className="mt-2 bg-primary font-bold text-white hover:bg-primary/90">
                      {t("register")}
                    </Button>
                  </Link>
                </div>
              </div>
            ) : sessionGroups.groups.length > 0 ? (
              <>
                {sessionGroups.groups.map(([sessionId, { session, participants: sessionParticipants }]) => (
                  <SessionGroup
                    key={sessionId}
                    eventId={id}
                    sessionId={sessionId}
                    session={session}
                    participants={sessionParticipants}
                  />
                ))}
                {sessionGroups.noSession.length > 0 && (
                  <ParticipantsTable participants={sessionGroups.noSession} label="Không có hạng mục" />
                )}
              </>
            ) : (
              <ParticipantsTable participants={participants} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MatchesSessionGroup({
  eventId,
  sessionId,
  session,
}: {
  eventId: string;
  sessionId: string;
  session: SessionResponseDto;
}) {
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const { data: stagesData, isLoading } = useStageControllerFindAllBySession(eventId, sessionId);
  const stages = (stagesData as Stage[] | undefined) ?? [];

  function handleToggleMatch(matchId: string) {
    setActiveMatchId((prev) => (prev === matchId ? null : matchId));
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          <h3 className="font-bold text-secondary">{session.name}</h3>
          <Badge variant="outline" className="border-slate-200 text-xs text-slate-500">
            {session.competitionFormat === "DOUBLES" ? "Đôi" : "Đơn"}
          </Badge>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3 p-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : stages.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <Trophy className="h-6 w-6 text-slate-300" />
          <p className="text-sm text-slate-400">Chưa có vòng đấu</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {stages
            .slice()
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((stage) => (
              <StageMatchesSection
                key={stage.id}
                eventId={eventId}
                stage={stage}
                activeMatchId={activeMatchId}
                onToggleMatch={handleToggleMatch}
              />
            ))}
        </div>
      )}
    </div>
  );
}

function StageMatchesSection({
  eventId,
  stage,
  activeMatchId,
  onToggleMatch,
}: {
  eventId: string;
  stage: Stage;
  activeMatchId: string | null;
  onToggleMatch: (matchId: string) => void;
}) {
  const { data: matchesData, isLoading } = useStageControllerFindMatchesByStage(eventId, stage.id);
  const matches = (matchesData as Match[] | undefined) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between bg-primary/5 px-6 py-3">
        <div className="flex items-center gap-2">
          <Trophy className="h-3.5 w-3.5 text-primary" />
          <span className="text-sm font-semibold text-secondary">{stage.name}</span>
          <span className="text-xs text-slate-400">({stageTypeLabel(stage.stageType)})</span>
        </div>
        <Badge variant="outline" className={`text-xs font-semibold ${stageStatusStyle(stage.status)}`}>
          {stageStatusLabel(stage.status)}
        </Badge>
      </div>

      {isLoading ? (
        <div className="space-y-2 p-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : matches.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">Chưa có trận đấu trong vòng này</p>
      ) : (
        <div className="divide-y divide-slate-50">
          {matches
            .slice()
            .sort((a, b) => (a.matchNumber ?? 0) - (b.matchNumber ?? 0))
            .map((match) => (
              <MatchRow
                key={match.id}
                match={match}
                isActive={activeMatchId === match.id}
                onToggle={() => onToggleMatch(match.id)}
              />
            ))}
        </div>
      )}
    </div>
  );
}

function matchStatusStyle(status: string) {
  switch (status) {
    case "COMPLETED": return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "CANCELLED": return "border-slate-200 bg-slate-100 text-slate-500";
    case "SCHEDULED": return "border-primary/20 bg-primary/5 text-primary";
    case "IN_PROGRESS": return "border-red-200 bg-red-50 text-red-600";
    default: return "border-slate-200 bg-slate-50 text-slate-400";
  }
}

function matchStatusLabel(status: string) {
  switch (status) {
    case "SCHEDULED": return "Lịch đấu";
    case "IN_PROGRESS": return "Đang diễn ra";
    case "COMPLETED": return "Kết thúc";
    case "CANCELLED": return "Huỷ";
    default: return status;
  }
}

function MatchRow({
  match,
  isActive,
  onToggle,
}: {
  match: Match;
  isActive: boolean;
  onToggle: () => void;
}) {
  const team1Name =
    (match.team1Name ??
      [match.team1Player1?.name, match.team1Player2?.name].filter(Boolean).join(" / ")) ||
    "-";
  const team2Name =
    (match.team2Name ??
      [match.team2Player1?.name, match.team2Player2?.name].filter(Boolean).join(" / ")) ||
    "-";

  const canViewScore = match.status === "COMPLETED" || match.status === "IN_PROGRESS";

  const { data: scoresData, isLoading: scoresLoading } = useMatchScoreControllerFindAll(
    match.id,
    { query: { enabled: isActive } },
  );
  const scores = ((scoresData as MatchScore[] | undefined) ?? [])
    .slice()
    .sort((a, b) => a.setNumber - b.setNumber);

  return (
    <div className={`transition-colors ${isActive ? "bg-slate-50" : "hover:bg-slate-50"}`}>
      {/* Main row */}
      <div className="flex items-center gap-3 px-6 py-3 text-sm">
        <div className="w-24 shrink-0">
          <p className="text-xs font-semibold text-secondary">{match.name}</p>
          {match.courtNumber != null && (
            <p className="text-xs text-slate-400">Sân {match.courtNumber}</p>
          )}
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5">
            {match.winnerTeam === 1 && (
              <Badge className="shrink-0 border-0 bg-emerald-500 text-xs font-semibold text-white">
                Thắng
              </Badge>
            )}
            <span className="min-w-0 truncate text-right font-semibold text-secondary">
              {team1Name}
            </span>
          </div>

          <div className="flex w-28 shrink-0 flex-col items-center gap-1">
            <span className="text-xs font-medium text-slate-400">VS</span>
            <Badge variant="outline" className={`text-xs font-semibold ${matchStatusStyle(match.status)}`}>
              {matchStatusLabel(match.status)}
            </Badge>
          </div>

          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            <span className="min-w-0 truncate font-semibold text-secondary">
              {team2Name}
            </span>
            {match.winnerTeam === 2 && (
              <Badge className="shrink-0 border-0 bg-emerald-500 text-xs font-semibold text-white">
                Thắng
              </Badge>
            )}
          </div>
        </div>

        <div className="flex w-28 shrink-0 flex-col items-end gap-1">
          {match.status === "SCHEDULED" && (
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="h-3 w-3 shrink-0" />
              {new Date(match.scheduledTime).toLocaleString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
          {canViewScore && (
            <button
              onClick={onToggle}
              className="cursor-pointer text-xs font-semibold text-primary transition-colors hover:text-primary/70"
            >
              {isActive ? "Ẩn kết quả" : "Xem kết quả"}
            </button>
          )}
        </div>
      </div>

      {/* Score panel */}
      {isActive && (
        <div className="border-t border-slate-100 px-6 py-4">
          {scoresLoading ? (
            <div className="flex justify-center gap-3">
              <Skeleton className="h-16 w-20" />
              <Skeleton className="h-16 w-20" />
              <Skeleton className="h-16 w-20" />
            </div>
          ) : scores.length === 0 ? (
            <p className="text-center text-xs text-slate-400">Chưa có kết quả</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-3">
              {scores.map((s) => (
                <div
                  key={s.setNumber}
                  className="flex min-w-[72px] flex-col items-center rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm"
                >
                  <span className="text-xs font-medium text-slate-400">Hiệp {s.setNumber}</span>
                  <span className="mt-1 text-lg font-black text-secondary">
                    {s.team1Points}
                    <span className="mx-1 text-sm font-normal text-slate-400">-</span>
                    {s.team2Points}
                  </span>
                  {s.winnerTeam != null && (
                    <span className="mt-0.5 text-xs font-semibold text-primary">
                      {s.winnerTeam === 1 ? "▲" : "▼"}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function stageTypeLabel(type: string) {
  switch (type) {
    case "ROUND_ROBIN_PLAYOFF": return "Vòng bảng";
    case "SINGLE_ELIMINATION": return "Loại trực tiếp";
    case "DOUBLE_ELIMINATION": return "Loại kép";
    case "FLEX": return "Linh hoạt";
    default: return type;
  }
}

function stageStatusStyle(status: string) {
  switch (status) {
    case "IN_PROGRESS": return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "COMPLETED": return "border-slate-200 bg-slate-100 text-slate-500";
    case "READY": return "border-primary/20 bg-primary/5 text-primary";
    default: return "border-slate-200 bg-slate-50 text-slate-400";
  }
}

function stageStatusLabel(status: string) {
  switch (status) {
    case "DRAFT": return "Nháp";
    case "READY": return "Sẵn sàng";
    case "IN_PROGRESS": return "Đang diễn ra";
    case "COMPLETED": return "Hoàn thành";
    default: return status;
  }
}

function SessionGroup({
  eventId,
  sessionId,
  session,
  participants,
}: {
  eventId: string;
  sessionId: string;
  session: SessionResponseDto;
  participants: EventParticipant[];
}) {
  const { data: stagesData } = useStageControllerFindAllBySession(eventId, sessionId);
  const stages = (stagesData as Stage[] | undefined) ?? [];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Session header */}
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <h3 className="font-bold text-secondary">{session.name}</h3>
              <Badge variant="outline" className="border-slate-200 text-xs text-slate-500">
                {session.competitionFormat === "DOUBLES" ? "Đôi" : "Đơn"}
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-slate-400">{participants.length} vận động viên</p>
          </div>

          {stages.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {stages
                .slice()
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((stage) => (
                  <div
                    key={stage.id}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5"
                  >
                    <Trophy className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-medium text-secondary">{stage.name}</span>
                    <span className="text-xs text-slate-400">({stageTypeLabel(stage.stageType)})</span>
                    <Badge variant="outline" className={`text-xs font-semibold ${stageStatusStyle(stage.status)}`}>
                      {stageStatusLabel(stage.status)}
                    </Badge>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      <ParticipantsTable participants={participants} />
    </div>
  );
}

function ParticipantsTable({
  participants,
  label,
}: {
  participants: EventParticipant[];
  label?: string;
}) {
  return (
    <div>
      {label && (
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-3">
          <p className="text-xs font-semibold text-slate-500">{label}</p>
        </div>
      )}
      {participants.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">Chưa có người tham gia</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">#</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Vận động viên</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Ngày đăng ký</th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-500">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p, i) => (
                <tr key={p.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-400">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {(p.athlete?.name ?? p.user?.email ?? "?").charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-secondary">
                        {p.athlete?.name ?? p.user?.email ?? "—"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(p.registrationDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge
                      variant="outline"
                      className={`text-xs font-semibold ${
                        p.status === "CHECKED_IN"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : p.status === "REGISTERED"
                            ? "border-primary/20 bg-primary/5 text-primary"
                            : "border-slate-200 bg-slate-50 text-slate-500"
                      }`}
                    >
                      {p.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <p className="text-sm font-medium text-secondary">{value}</p>
      </div>
    </div>
  );
}

function ScheduleItem({
  icon: Icon,
  label,
  start,
  end,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  start: string;
  end: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
      <Icon className="h-4 w-4 shrink-0 text-primary" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-secondary">{label}</p>
        <p className="text-xs text-slate-500">
          {start} — {end}
        </p>
      </div>
    </div>
  );
}
