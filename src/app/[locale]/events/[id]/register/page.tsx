"use client";

import { use, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Home,
  Plus,
  Trash2,
  User,
  CreditCard,
  Building2,
  Smartphone,
  CalendarDays,
  Clock,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Athlete {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  birthday: string;
  gender: string;
  idNumber: string;
}

const PAYMENT_METHODS = [
  { id: "bank", label: "Chuyển khoản ngân hàng", icon: Building2 },
  { id: "card", label: "Thẻ tín dụng / Ghi nợ", icon: CreditCard },
  { id: "momo", label: "Ví MoMo", icon: Smartphone },
];

const MOCK_PRICE = 350000;
const MOCK_DISCOUNT = 0;
const VAT_RATE = 0.1;

const TERMS_TEXT = `ĐIỀU KHOẢN VÀ ĐIỀU KIỆN THAM GIA

1. Điều kiện tham gia
Người đăng ký phải đủ 16 tuổi trở lên. Ban tổ chức có quyền từ chối đơn đăng ký không đáp ứng đủ điều kiện.

2. Phí đăng ký
Phí đăng ký không được hoàn trả sau khi đã xác nhận đăng ký thành công, trừ trường hợp sự kiện bị hủy bởi ban tổ chức.

3. Sức khỏe & An toàn
Người tham gia phải tự chịu trách nhiệm về tình trạng sức khỏe của mình. Ban tổ chức không chịu trách nhiệm đối với bất kỳ chấn thương nào xảy ra trong quá trình tham gia.

4. Hình ảnh & Truyền thông
Người tham gia đồng ý cho phép ban tổ chức sử dụng hình ảnh, video của họ cho mục đích truyền thông và quảng bá sự kiện.

5. Thay đổi & Hủy sự kiện
Ban tổ chức có quyền thay đổi lịch trình, địa điểm hoặc hủy sự kiện trong trường hợp bất khả kháng. Thông báo sẽ được gửi qua email đã đăng ký.`;

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  const steps = [
    { n: 1, label: "Thông tin" },
    { n: 2, label: "Thanh toán" },
    { n: 3, label: "Xác nhận" },
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

// ─── Athlete Form ─────────────────────────────────────────────────────────────

function AthleteForm({
  athlete,
  index,
  onChange,
  onRemove,
  canRemove,
}: {
  athlete: Athlete;
  index: number;
  onChange: (field: keyof Omit<Athlete, "id">, value: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <span className="font-bold text-secondary">
            Vận động viên {index + 1}
          </span>
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-slate-500">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Nguyễn Văn A"
            value={athlete.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-secondary placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-secondary placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-secondary placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-500">
            Giới tính <span className="text-red-500">*</span>
          </label>
          <select
            value={athlete.gender}
            onChange={(e) => onChange("gender", e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Chọn giới tính</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-slate-500">
            CCCD / Hộ chiếu <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="012345678901"
            value={athlete.idNumber}
            onChange={(e) => onChange("idNumber", e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-secondary placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
  const { id } = use(params);
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(MOCK_DISCOUNT);

  const [athletes, setAthletes] = useState<Athlete[]>([
    { id: 1, fullName: "", email: "", phone: "", birthday: "", gender: "", idNumber: "" },
  ]);

  const mockTransactionTime = new Date().toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });

  // Pricing
  const subtotal = MOCK_PRICE * athletes.length;
  const discountAmt = appliedDiscount;
  const vat = Math.round((subtotal - discountAmt) * VAT_RATE);
  const total = subtotal - discountAmt + vat;

  const formatVND = (n: number) =>
    n.toLocaleString("vi-VN") + " ₫";

  const addAthlete = () =>
    setAthletes((prev) => [
      ...prev,
      { id: Date.now(), fullName: "", email: "", phone: "", birthday: "", gender: "", idNumber: "" },
    ]);

  const removeAthlete = (id: number) =>
    setAthletes((prev) => prev.filter((a) => a.id !== id));

  const updateAthlete = (id: number, field: keyof Omit<Athlete, "id">, value: string) =>
    setAthletes((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );

  const applyDiscount = () => {
    if (discountCode.toUpperCase() === "SPORT10") {
      setAppliedDiscount(Math.round(subtotal * 0.1));
    }
  };

  const paymentLabel =
    PAYMENT_METHODS.find((m) => m.id === selectedPayment)?.label ?? "—";

  return (
    <div className="mx-auto max-w-container px-6 py-8 lg:px-20">
      {/* Back */}
      <Link
        href={`/events/${id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại sự kiện
      </Link>

      {/* Step indicator */}
      <div className="mt-8">
        <StepIndicator current={step} />
      </div>

      <div className="mx-auto mt-8 max-w-2xl">

        {/* ── Step 1: Thông tin ── */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-extrabold text-secondary">Nhập thông tin vận động viên</h2>
              <p className="mt-1 text-sm text-slate-500">Điền đầy đủ thông tin cho từng vận động viên tham gia.</p>
            </div>

            {athletes.map((athlete, i) => (
              <AthleteForm
                key={athlete.id}
                athlete={athlete}
                index={i}
                onChange={(field, value) => updateAthlete(athlete.id, field, value)}
                onRemove={() => removeAthlete(athlete.id)}
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

            {/* Terms */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-sm font-bold text-secondary">Điều khoản tham gia</h3>
              <div className="h-40 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-600 scrollbar-hide">
                {TERMS_TEXT}
              </div>
              <label className="mt-4 flex cursor-pointer items-start gap-3">
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
                      agreed ? "border-primary bg-primary" : "border-slate-300 bg-white"
                    )}
                  >
                    {agreed && <Check className="h-3 w-3 text-white" />}
                  </div>
                </div>
                <span className="text-sm text-slate-600">
                  Tôi đã đọc và đồng ý với{" "}
                  <span className="font-semibold text-primary">điều khoản tham gia</span>{" "}
                  của sự kiện này.
                </span>
              </label>
            </div>

            <Button
              className="w-full bg-primary py-6 text-base font-bold text-white hover:bg-primary/90 disabled:opacity-50"
              disabled={!agreed}
              onClick={() => setStep(2)}
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
              <h2 className="text-xl font-extrabold text-secondary">Thanh toán</h2>
              <p className="mt-1 text-sm text-slate-500">Chọn phương thức thanh toán và hoàn tất đăng ký.</p>
            </div>

            {/* Payment methods */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-secondary">Phương thức thanh toán</h3>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => {
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
                        <Icon className={cn("h-5 w-5", active ? "text-primary" : "text-slate-500")} />
                      </div>
                      <span className={cn("font-semibold", active ? "text-primary" : "text-secondary")}>
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
              <h3 className="mb-4 text-sm font-bold text-secondary">Tóm tắt đơn hàng</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Phí đăng ký ({athletes.length} VĐV)</span>
                  <span className="font-semibold text-secondary">{formatVND(subtotal)}</span>
                </div>
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
                disabled={!selectedPayment}
                onClick={() => setStep(3)}
              >
                Thanh toán {formatVND(subtotal)}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 3: Xác nhận ── */}
        {step === 3 && (
          <div className="space-y-5">
            {/* Success header */}
            <div className="flex flex-col items-center py-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-9 w-9 text-primary" />
              </div>
              <h2 className="mt-4 text-xl font-extrabold text-secondary">Đăng ký thành công!</h2>
              <p className="mt-1 text-sm text-slate-500">Thông tin đăng ký đã được ghi nhận.</p>
            </div>

            {/* Transaction info */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-secondary">Thông tin giao dịch</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <Clock className="h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-xs text-slate-400">Thời gian giao dịch</p>
                    <p className="text-sm font-semibold text-secondary">{mockTransactionTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <CreditCard className="h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-xs text-slate-400">Phương thức thanh toán</p>
                    <p className="text-sm font-semibold text-secondary">{paymentLabel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
                  <div className="flex flex-1 items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Trạng thái thanh toán</p>
                      <p className="text-sm font-semibold text-secondary">Giao dịch</p>
                    </div>
                    <Badge className="border-0 bg-primary/10 text-xs font-bold text-primary">
                      THÀNH CÔNG
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Order breakdown */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-secondary">Chi tiết đơn hàng</h3>

              {/* Discount code */}
              <div className="mb-4 flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Nhập mã giảm giá"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-4 text-sm text-secondary placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <Button
                  variant="outline"
                  className="shrink-0 border-primary text-primary hover:bg-primary/5"
                  onClick={applyDiscount}
                >
                  Áp dụng
                </Button>
              </div>
              {appliedDiscount > 0 && (
                <p className="mb-3 text-xs font-medium text-primary">
                  ✓ Mã giảm giá đã được áp dụng
                </p>
              )}

              <Separator className="my-3" />

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Giá đơn hàng</span>
                  <span className="font-medium text-secondary">{formatVND(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Giảm giá</span>
                  <span className="font-medium text-primary">
                    {appliedDiscount > 0 ? `− ${formatVND(appliedDiscount)}` : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">VAT (10%)</span>
                  <span className="font-medium text-secondary">{formatVND(vat)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-extrabold">
                  <span className="text-secondary">Tổng thanh toán</span>
                  <span className="text-primary">{formatVND(total)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Link href="/" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full border-slate-200 py-6 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Về trang chủ
                </Button>
              </Link>
              <Link href={`/events/${id}`} className="flex-1">
                <Button className="w-full bg-primary py-6 font-bold text-white hover:bg-primary/90">
                  Chi tiết sự kiện
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
