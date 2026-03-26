"use client";

import { use, useState, useRef, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Trash2,
  User,
  CreditCard,
  Building2,
  QrCode,
  Loader2,
  UserCheck,
  ChevronDown,
  Trophy,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { usePublicEventControllerFindOne } from "@/lib/services/public/public";
import { useEventOrderControllerCreate } from "@/lib/services/event-orders/event-orders";
import { Skeleton } from "@/components/ui/skeleton";
import { AXIOS_INSTANCE as axiosInstance } from "@/lib/api/axiosInstance";
import { useAuth } from "@/hooks/use-auth";
import { signIn } from "next-auth/react";
import { useAthleteControllerGetMyProfiles } from "@/lib/services/athletes/athletes";

// ─── Types ───────────────────────────────────────────────────────────────────

interface AthleteForm {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  birthday: string;
  gender: string;
  idNumber: string;
  ticketTierId: string;
  /** The backend athlete profile id that was selected, if any */
  selectedProfileId?: string;
}

interface TicketTier {
  id: string;
  name: string;
  price: number;
  isFree: boolean;
  totalQuantity: number;
  isVisible: boolean;
}

const PAYMENT_METHODS = [
  { id: "SEPAY_BANK_TRANSFER", label: "Chuyển khoản ngân hàng (SePay)", icon: Building2 },
  { id: "VNPAY_QR", label: "VNPay QR", icon: QrCode },
  { id: "DOMESTIC_CARD", label: "Thẻ nội địa (VNPay)", icon: CreditCard },
  { id: "INTERNATIONAL_CARD", label: "Thẻ quốc tế (VNPay)", icon: CreditCard },
  { id: "PAYX_QR", label: "PAYX QR", icon: QrCode },
  { id: "PAYX_DOMESTIC", label: "Thẻ nội địa (PAYX)", icon: CreditCard },
];

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  const steps = [
    { n: 1, label: "Thông tin" },
    { n: 2, label: "Thanh toán" },
  ];
  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((step, i) => (
        <div key={step.n} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300",
                current > step.n
                  ? "border-primary bg-primary text-white"
                  : current === step.n
                  ? "border-primary bg-primary text-white shadow-lg shadow-primary/30"
                  : "border-slate-200 bg-white text-slate-400"
              )}
            >
              {current > step.n ? <Check className="h-4 w-4" /> : step.n}
            </div>
            <span
              className={cn(
                "text-xs font-semibold",
                current >= step.n ? "text-primary" : "text-slate-400"
              )}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "mx-3 mb-5 h-0.5 w-16 transition-all duration-300",
                current > step.n ? "bg-primary" : "bg-slate-200"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Athlete Profile Selector ────────────────────────────────────────────────

function AthleteProfileSelector({
  profiles,
  selectedId,
  onSelect,
}: {
  profiles: any[];
  selectedId?: string;
  onSelect: (profile: any | null) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (profiles.length === 0) return null;

  const selected = profiles.find((p: any) => p.id === selectedId);

  return (
    <div className="mb-5">
      <label className="mb-2 block text-xs font-semibold text-slate-500">
        Chọn từ hồ sơ đã đăng ký
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm transition-all duration-200",
            selected
              ? "border-primary/30 bg-primary/5"
              : "border-dashed border-slate-300 bg-slate-50 hover:border-primary/30 hover:bg-primary/5"
          )}
        >
          {selected ? (
            <>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <UserCheck className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-secondary">{selected.name}</p>
                <p className="truncate text-xs text-slate-500">
                  {selected.phoneNumber || "Chưa có SĐT"} · {selected.gender === "male" ? "Nam" : selected.gender === "female" ? "Nữ" : selected.gender || "—"}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200">
                <User className="h-4 w-4 text-slate-400" />
              </div>
              <span className="text-slate-400">Chọn VĐV đã đăng ký trước đó...</span>
            </>
          )}
          <ChevronDown className={cn("ml-auto h-4 w-4 shrink-0 text-slate-400 transition-transform", isOpen && "rotate-180")} />
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
            {/* Option to clear / enter manually */}
            <button
              type="button"
              onClick={() => {
                onSelect(null);
                setIsOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-slate-50",
                !selectedId && "bg-primary/5"
              )}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100">
                <Plus className="h-4 w-4 text-slate-500" />
              </div>
              <span className="font-medium text-slate-600">Nhập thông tin mới</span>
            </button>

            {profiles.map((profile: any) => (
              <button
                key={profile.id}
                type="button"
                onClick={() => {
                  onSelect(profile);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 border-t border-slate-100 px-4 py-3 text-left text-sm transition-colors hover:bg-primary/5",
                  selectedId === profile.id && "bg-primary/5"
                )}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <UserCheck className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-secondary">{profile.name}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{profile.phoneNumber || "Chưa có SĐT"}</span>
                    {profile.currentRating > 0 && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-0.5">
                          <Star className="h-3 w-3 text-amber-400" />
                          {profile.currentRating}
                        </span>
                      </>
                    )}
                    {profile.totalMatches > 0 && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-0.5">
                          <Trophy className="h-3 w-3 text-primary" />
                          {profile.wins}W/{profile.losses}L
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {selectedId === profile.id && (
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Athlete Form ─────────────────────────────────────────────────────────────

function AthleteFormCard({
  athlete,
  index,
  tiers,
  profiles,
  onChange,
  onRemove,
  onSelectProfile,
  canRemove,
}: {
  athlete: AthleteForm;
  index: number;
  tiers: TicketTier[];
  profiles: any[];
  onChange: (field: keyof Omit<AthleteForm, "id" | "selectedProfileId">, value: string) => void;
  onRemove: () => void;
  onSelectProfile: (profile: any | null) => void;
  canRemove: boolean;
}) {
  const inputClass =
    "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-secondary placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <span className="font-bold text-secondary">
            Vận động viên {index + 1}
          </span>
          {athlete.selectedProfileId && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-600">
              <UserCheck className="h-3 w-3" />
              Đã liên kết
            </span>
          )}
        </div>
        {canRemove && (
          <button
            onClick={onRemove}
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Athlete profile selector */}
      <AthleteProfileSelector
        profiles={profiles}
        selectedId={athlete.selectedProfileId}
        onSelect={onSelectProfile}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Ticket Tier */}
        {tiers.length > 0 && (
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-slate-500">
              Loại vé <span className="text-red-500">*</span>
            </label>
            <select
              value={athlete.ticketTierId}
              onChange={(e) => onChange("ticketTierId", e.target.value)}
              className={inputClass}
            >
              <option value="">Chọn loại vé</option>
              {tiers
                .filter((t) => t.isVisible)
                .map((tier) => (
                  <option key={tier.id} value={tier.id}>
                    {tier.name}
                    {tier.isFree
                      ? " (Miễn phí)"
                      : ` — ${Number(tier.price).toLocaleString("vi-VN")} ₫`}
                  </option>
                ))}
            </select>
          </div>
        )}

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-slate-500">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Nguyễn Văn A"
            value={athlete.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-500">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="example@email.com"
            value={athlete.email}
            onChange={(e) => onChange("email", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-500">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            placeholder="0901 234 567"
            value={athlete.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-500">
            Ngày sinh <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={athlete.birthday}
            onChange={(e) => onChange("birthday", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-500">
            Giới tính <span className="text-red-500">*</span>
          </label>
          <select
            value={athlete.gender}
            onChange={(e) => onChange("gender", e.target.value)}
            className={inputClass}
          >
            <option value="">Chọn giới tính</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-slate-500">
            CCCD / Hộ chiếu
          </label>
          <input
            type="text"
            placeholder="012345678901"
            value={athlete.idNumber}
            onChange={(e) => onChange("idNumber", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RegisterPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = use(params);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const { user, isLoading: authLoading } = useAuth();

  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactAutoFilled, setContactAutoFilled] = useState(false);

  const [athletes, setAthletes] = useState<AthleteForm[]>([
    {
      id: 1,
      fullName: "",
      email: "",
      phone: "",
      birthday: "",
      gender: "",
      idNumber: "",
      ticketTierId: "",
    },
  ]);

  // Fetch event data
  const { data: eventData, isLoading } = usePublicEventControllerFindOne(id);
  const event = (eventData as any)?.data ?? eventData;

  // Fetch user's athlete profiles
  const { data: profilesData } = useAthleteControllerGetMyProfiles({
    query: { enabled: !!user },
  });
  const myProfiles: any[] = (profilesData as any)?.data ?? (profilesData as any) ?? [];

  // Auto-fill contact info from user profile (once)
  useEffect(() => {
    if (user && !contactAutoFilled) {
      if (user.displayName && !contactName) setContactName(user.displayName);
      if (user.email && !contactEmail) setContactEmail(user.email);
      // Try to get phone from first athlete profile
      if (!contactPhone && myProfiles.length > 0) {
        const firstPhone = myProfiles.find((p: any) => p.phoneNumber)?.phoneNumber;
        if (firstPhone) setContactPhone(firstPhone);
      }
      setContactAutoFilled(true);
    }
  }, [user, myProfiles, contactAutoFilled, contactName, contactEmail, contactPhone]);

  // Extract ticket tiers from event sessions
  const ticketTiers: TicketTier[] =
    event?.sessions?.flatMap(
      (s: any) =>
        s.ticketTiers?.map((t: any) => ({
          id: t.id,
          name: `${s.name} — ${t.name}`,
          price: Number(t.price || 0),
          isFree: t.isFree,
          totalQuantity: t.totalQuantity,
          isVisible: t.isVisible !== false,
        })) ?? []
    ) ?? [];

  // Calculate total
  const getAthletePrice = (a: AthleteForm) => {
    const tier = ticketTiers.find((t) => t.id === a.ticketTierId);
    return tier?.isFree ? 0 : Number(tier?.price || 0);
  };

  const subtotal = athletes.reduce((sum, a) => sum + getAthletePrice(a), 0);
  const formatVND = (n: number) => n.toLocaleString("vi-VN") + " ₫";

  const addAthlete = () =>
    setAthletes((prev) => [
      ...prev,
      {
        id: Date.now(),
        fullName: "",
        email: "",
        phone: "",
        birthday: "",
        gender: "",
        idNumber: "",
        ticketTierId: "",
      },
    ]);

  const removeAthlete = (athleteId: number) =>
    setAthletes((prev) => prev.filter((a) => a.id !== athleteId));

  const updateAthlete = (
    athleteId: number,
    field: keyof Omit<AthleteForm, "id" | "selectedProfileId">,
    value: string
  ) =>
    setAthletes((prev) =>
      prev.map((a) => (a.id === athleteId ? { ...a, [field]: value } : a))
    );

  const selectAthleteProfile = (athleteId: number, profile: any | null) => {
    setAthletes((prev) =>
      prev.map((a) => {
        if (a.id !== athleteId) return a;
        if (!profile) {
          // Clear selection — reset form
          return {
            ...a,
            selectedProfileId: undefined,
            fullName: "",
            email: "",
            phone: "",
            birthday: "",
            gender: "",
            idNumber: "",
          };
        }
        // Auto-fill from profile
        const dob = profile.dateOfBirth
          ? profile.dateOfBirth.slice(0, 10) // "YYYY-MM-DD"
          : "";
        return {
          ...a,
          selectedProfileId: profile.id,
          fullName: profile.name || "",
          email: profile.user?.email || user?.email || "",
          phone: profile.phoneNumber || "",
          birthday: dob,
          gender: profile.gender || "",
        };
      })
    );
  };

  // Validation
  const validateStep1 = () => {
    if (!contactName || !contactEmail || !contactPhone) {
      toast.error("Vui lòng nhập thông tin liên hệ");
      return false;
    }
    for (const a of athletes) {
      if (!a.fullName || !a.email || !a.phone || !a.birthday || !a.gender) {
        toast.error(`Vui lòng nhập đầy đủ thông tin cho VĐV ${a.fullName || ""}`);
        return false;
      }
      if (ticketTiers.length > 0 && !a.ticketTierId) {
        toast.error(`Vui lòng chọn loại vé cho VĐV ${a.fullName}`);
        return false;
      }
    }
    return true;
  };

  // Submit order & init payment
  const handlePayment = async () => {
    if (!selectedPayment) {
      toast.error("Vui lòng chọn phương thức thanh toán");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Create order
      const orderRes = await axiosInstance.post(`/events/${id}/orders`, {
        contactName,
        contactEmail,
        contactPhone,
        athletes: athletes.map((a) => ({
          fullName: a.fullName,
          email: a.email,
          phone: a.phone,
          dateOfBirth: a.birthday,
          gender: a.gender,
          idNumber: a.idNumber || undefined,
          ticketTierId: a.ticketTierId || ticketTiers[0]?.id,
        })),
      });

      const { orderCode, finalAmount } = (orderRes as any)?.data ?? orderRes as any;

      // Free order — skip payment
      if (finalAmount === 0) {
        toast.success("Đăng ký thành công!");
        router.push(`/events/${id}`);
        return;
      }

      // 2. Init payment
      const paymentRes = await axiosInstance.post(
        `/events/${id}/orders/${orderCode}/payment/init`,
        {
          paymentMethod: selectedPayment,
          returnUrl: `${window.location.origin}/${locale}/events/orders/payment/return?orderCode=${orderCode}`,
        }
      );

      // Interceptor unwraps { status, code, data } → data
      const paymentData = paymentRes.data as Record<string, unknown>;

      // 3. Redirect based on payment response
      if (paymentData.paymentUrl) {
        // VNPay / redirect-based gateway
        window.location.href = paymentData.paymentUrl as string;
      } else if (paymentData.qrCodeData && paymentData.accountInfo) {
        // PAYX merchant_hosted — redirect to QR checkout page
        const info = paymentData.accountInfo as Record<string, string>;
        const params = new URLSearchParams({
          orderCode: (paymentData.orderCode ?? orderCode) as string,
          amount: String(paymentData.amount ?? 0),
          accNo: info.accountNumber ?? "",
          accName: info.accountName ?? "",
          bank: info.bankShortName ?? "",
          bankFull: info.bankFullName ?? "",
          desc: info.transferDescription ?? "",
          expire: String(paymentData.expireDate ?? ""),
        });
        router.push(`/events/orders/payment/checkout?${params.toString()}`);
      } else if (paymentData.formFields && paymentData.checkoutUrl) {
        // SePay-style hidden form POST
        const form = formRef.current;
        if (form) {
          form.action = paymentData.checkoutUrl as string;
          form.method = "POST";
          form.innerHTML = "";
          for (const [key, value] of Object.entries(
            paymentData.formFields as Record<string, string>,
          )) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = String(value);
            form.appendChild(input);
          }
          form.submit();
        }
      } else if (paymentData.orderCode || paymentData.displayMode) {
        // Fallback — redirect to payment return page
        const code = (paymentData.orderCode ?? orderCode) as string;
        router.push(
          `/events/orders/payment/return?orderCode=${code}`,
        );
      } else {
        toast.error("Không thể khởi tạo thanh toán");
      }
    } catch (err: any) {
      toast.error(err?.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Require login before registration
  if (!authLoading && !user) {
    return (
      <div className="mx-auto max-w-container px-6 py-16 lg:px-20">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <User className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mt-4 text-xl font-extrabold text-secondary">
            Đăng nhập để tiếp tục
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Bạn cần đăng nhập để đăng ký tham gia sự kiện
          </p>
          <Button
            className="mt-6 bg-primary text-white hover:bg-primary/90"
            onClick={() => signIn("google")}
          >
            Đăng nhập với Google
          </Button>
          <div className="mt-3">
            <Link href={`/events/${id}`}>
              <Button variant="outline">Quay lại sự kiện</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-container px-6 py-8 lg:px-20">
        <Skeleton className="h-8 w-48" />
        <div className="mx-auto mt-8 max-w-2xl space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Filter payment methods based on event config
  const availablePaymentMethods = event?.paymentMethods?.length
    ? PAYMENT_METHODS.filter((m) => event.paymentMethods.includes(m.id))
    : PAYMENT_METHODS;

  return (
    <div className="mx-auto max-w-container px-6 py-8 lg:px-20">
      {/* Hidden form for SePay redirect */}
      <form ref={formRef} className="hidden" />

      {/* Back */}
      <Link
        href={`/events/${id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại sự kiện
      </Link>

      <h1 className="mt-4 text-2xl font-extrabold text-secondary">
        Đăng ký: {event?.name || ""}
      </h1>

      {/* Step indicator */}
      <div className="mt-6">
        <StepIndicator current={step} />
      </div>

      <div className="mx-auto mt-8 max-w-2xl">
        {/* ── Step 1: Thông tin ── */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-extrabold text-secondary">
                Thông tin đăng ký
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Điền thông tin liên hệ và vận động viên.
              </p>
            </div>

            {/* Contact info */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-secondary">
                  Thông tin liên hệ
                </h3>
                {contactAutoFilled && (contactName || contactEmail) && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-600">
                    <UserCheck className="h-3 w-3" />
                    Tự động điền từ tài khoản
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Họ và tên người đăng ký"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-secondary placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-secondary placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="0901 234 567"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-secondary placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Athlete forms */}
            {athletes.map((athlete, i) => (
              <AthleteFormCard
                key={athlete.id}
                athlete={athlete}
                index={i}
                tiers={ticketTiers}
                profiles={myProfiles}
                onChange={(field, value) => updateAthlete(athlete.id, field, value)}
                onRemove={() => removeAthlete(athlete.id)}
                onSelectProfile={(profile) => selectAthleteProfile(athlete.id, profile)}
                canRemove={athletes.length > 1}
              />
            ))}

            <button
              onClick={addAthlete}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/30 py-4 text-sm font-semibold text-primary transition-all duration-200 hover:border-primary hover:bg-primary/5"
            >
              <Plus className="h-4 w-4" />
              Thêm vận động viên
            </button>

            {/* Order preview */}
            {athletes.some((a) => a.ticketTierId) && (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    {athletes.length} VĐV · Tạm tính
                  </span>
                  <span className="text-lg font-extrabold text-primary">
                    {formatVND(subtotal)}
                  </span>
                </div>
              </div>
            )}

            {/* Terms */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <label className="flex cursor-pointer items-start gap-3">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded border-2 transition-all duration-200",
                      agreed
                        ? "border-primary bg-primary"
                        : "border-slate-300 bg-white"
                    )}
                  >
                    {agreed && <Check className="h-3 w-3 text-white" />}
                  </div>
                </div>
                <span className="text-sm text-slate-600">
                  Tôi đã đọc và đồng ý với{" "}
                  <span className="font-semibold text-primary">
                    điều khoản tham gia
                  </span>{" "}
                  của sự kiện này.
                </span>
              </label>
            </div>

            <Button
              className="w-full bg-primary py-6 text-base font-bold text-white hover:bg-primary/90 disabled:opacity-50"
              disabled={!agreed}
              onClick={() => {
                if (validateStep1()) setStep(2);
              }}
            >
              Tiếp tục
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}

        {/* ── Step 2: Thanh toán ── */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-extrabold text-secondary">
                Thanh toán
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Chọn phương thức thanh toán và hoàn tất đăng ký.
              </p>
            </div>

            {/* Payment methods */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-secondary">
                Phương thức thanh toán
              </h3>
              <div className="space-y-3">
                {availablePaymentMethods.map((method) => {
                  const Icon = method.icon;
                  const active = selectedPayment === method.id;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={cn(
                        "flex w-full cursor-pointer items-center gap-4 rounded-xl border-2 px-4 py-4 text-left transition-all duration-200",
                        active
                          ? "border-primary bg-primary/5"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                          active ? "bg-primary/10" : "bg-slate-100"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5",
                            active ? "text-primary" : "text-slate-500"
                          )}
                        />
                      </div>
                      <span
                        className={cn(
                          "font-semibold",
                          active ? "text-primary" : "text-secondary"
                        )}
                      >
                        {method.label}
                      </span>
                      <div className="ml-auto">
                        <div
                          className={cn(
                            "flex h-5 w-5 items-center justify-center rounded-full border-2",
                            active ? "border-primary bg-primary" : "border-slate-300"
                          )}
                        >
                          {active && <Check className="h-3 w-3 text-white" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Order summary */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-secondary">
                Tóm tắt đơn hàng
              </h3>
              <div className="space-y-2.5 text-sm">
                {athletes.map((a, i) => {
                  const tier = ticketTiers.find(
                    (t) => t.id === a.ticketTierId
                  );
                  return (
                    <div key={a.id} className="flex justify-between">
                      <span className="text-slate-500">
                        {a.fullName || `VĐV ${i + 1}`}
                        {tier ? ` — ${tier.name}` : ""}
                      </span>
                      <span className="font-semibold text-secondary">
                        {formatVND(getAthletePrice(a))}
                      </span>
                    </div>
                  );
                })}
                <Separator />
                <div className="flex justify-between text-lg font-extrabold">
                  <span className="text-secondary">Tổng cộng</span>
                  <span className="text-primary">{formatVND(subtotal)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-slate-200 py-6 font-semibold text-slate-600 hover:bg-slate-50"
                onClick={() => setStep(1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
              </Button>
              <Button
                className="flex-[2] bg-primary py-6 text-base font-bold text-white hover:bg-primary/90 disabled:opacity-50"
                disabled={!selectedPayment || isSubmitting}
                onClick={handlePayment}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    Thanh toán {formatVND(subtotal)}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
