"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle2, XCircle, Clock } from "lucide-react";

type SepayStatus = "success" | "completed" | "canceled" | "cancelled" | "failed" | "pending";

function StatusIcon({ status }: { status: string }) {
  const s = status.toLowerCase() as SepayStatus;
  if (s === "success" || s === "completed") {
    return <CheckCircle2 className="h-16 w-16 text-green-500" />;
  }
  if (s === "canceled" || s === "cancelled" || s === "failed") {
    return <XCircle className="h-16 w-16 text-red-500" />;
  }
  return <Clock className="h-16 w-16 text-yellow-500" />;
}

function statusColor(status: string): string {
  const s = status.toLowerCase() as SepayStatus;
  if (s === "success" || s === "completed") return "text-green-600";
  if (s === "canceled" || s === "cancelled" || s === "failed") return "text-red-600";
  return "text-yellow-600";
}

export default function SepayReturnPage() {
  const searchParams = useSearchParams();
  const t = useTranslations("groupTickets");

  const orderCode = searchParams.get("orderCode") ?? "—";
  const status = searchParams.get("status") ?? "";

  function statusLabel(s: string): string {
    const key = s.toLowerCase() as SepayStatus;
    if (key === "success" || key === "completed") return t("sepayStatusSuccess");
    if (key === "canceled" || key === "cancelled") return t("sepayStatusCanceled");
    if (key === "failed") return t("sepayStatusFailed");
    if (key === "pending") return t("sepayStatusPending");
    return s || t("sepayStatusUnknown");
  }

  return (
    <div className="mx-auto max-w-container px-6 py-12 lg:px-20">
      <Link
        href="/group-tickets"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("backToList")}
      </Link>

      <div className="flex justify-center">
        <Card className="w-full max-w-md border-slate-200">
          <CardHeader className="items-center pb-2 text-center">
            <StatusIcon status={status} />
            <CardTitle className="mt-4 text-2xl font-extrabold">
              {t("sepayReturnTitle")}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("sepayOrderCode")}
                </span>
                <span className="font-mono text-sm font-semibold text-foreground">
                  {orderCode}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("sepayStatus")}
                </span>
                <span className={`text-sm font-semibold ${statusColor(status)}`}>
                  {statusLabel(status)}
                </span>
              </div>

              <Separator />

              <div className="pt-2">
                <Link href="/group-tickets">
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {t("backToList")}
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
