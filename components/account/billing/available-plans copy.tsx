"use client";

import { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Crown,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProfileStatusBadge, ProfileItemGroup } from "../profile/profile-item";

// ==========================================
// ۱. تایپ‌ها
// ==========================================
export type FeatureType = "unlimited" | "limited" | "disabled";

export interface PlanFeature {
  title: string;
  type: FeatureType;
  detail?: string;
}

export interface PricingPlanItem {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  currency: string;
  periodText: string;
  discountPercent?: number;
  isPopular?: boolean;
  iconType: "free" | "standard" | "pro";
  features: PlanFeature[];
}

// ==========================================
// ۲. دیتای ماک
// ==========================================
export const MOCK_AVAILABLE_PLANS: PricingPlanItem[] = [
  {
    id: "plan_free",
    name: "اشتراک پایه",
    tagline: "یادگیری استاندارد برای شروع مطالعه",
    price: 0,
    currency: "تومان",
    periodText: "همیشگی",
    iconType: "free",
    features: [
      { title: "حل گام‌به‌گام کتاب درسی کامل", type: "unlimited", detail: "نامحدود" },
      { title: "محتوای تصویری و ویدیویی", type: "unlimited", detail: "نامحدود" },
      { title: "آزمایشگاه مجازی و بازی‌ها", type: "limited", detail: "۳ بار اجرا" },
      { title: "ساخت و حل تمرین", type: "limited", detail: "۲ تمرین روزانه" },
      { title: "ساخت و چاپ آزمون", type: "limited", detail: "۱ آزمون در ماه" },
      { title: "هوشواره درس‌یاور", type: "disabled", detail: "ندارد" },
    ],
  },
  {
    id: "plan_pro_monthly",
    name: "پیشرفته ماهانه",
    tagline: "دسترسی نامحدود برای یک ماه تحصیلی",
    price: 189000,
    currency: "تومان",
    periodText: "ماهانه",
    iconType: "standard",
    features: [
      { title: "حل گام‌به‌گام کتاب درسی کامل", type: "unlimited", detail: "نامحدود" },
      { title: "محتوای تصویری و ویدیویی", type: "unlimited", detail: "نامحدود" },
      { title: "آزمایشگاه مجازی و بازی‌ها", type: "unlimited", detail: "نامحدود" },
      { title: "ساخت و حل تمرین", type: "unlimited", detail: "نامحدود" },
      { title: "ساخت و چاپ آزمون", type: "unlimited", detail: "نامحدود" },
      { title: "هوشواره درس‌یاور", type: "unlimited", detail: "پاسخ‌گویی هوشمند" },
    ],
  },
  {
    id: "plan_pro_quarterly",
    name: "پیشرفته سه‌ماهه (ویژه ترم)",
    tagline: "انتخاب هوشمندانه با دسترسی کامل فصل",
    price: 450000,
    originalPrice: 567000,
    discountPercent: 20,
    currency: "تومان",
    periodText: "سه‌ماهه",
    isPopular: true,
    iconType: "pro",
    features: [
      { title: "حل گام‌به‌گام کتاب درسی کامل", type: "unlimited", detail: "نامحدود" },
      { title: "محتوای تصویری و ویدیویی", type: "unlimited", detail: "نامحدود" },
      { title: "آزمایشگاه مجازی و بازی‌ها", type: "unlimited", detail: "نامحدود" },
      { title: "ساخت و حل تمرین", type: "unlimited", detail: "نامحدود" },
      { title: "ساخت و چاپ آزمون", type: "unlimited", detail: "نامحدود با بارم‌‌بندی" },
      { title: "هوشواره درس‌‌یاور", type: "unlimited", detail: "اولویت در پاسخ‌دهی" },
    ],
  },
  {
    id: "plan_pro_yearly",
    name: "اشتراک طلایی سالانه",
    tagline: "همراهی در تمام طول سال تحصیلی با بیشترین تخفیف",
    price: 1390000,
    originalPrice: 2268000,
    discountPercent: 38,
    currency: "تومان",
    periodText: "سالانه",
    iconType: "pro",
    features: [
      { title: "حل گام‌به‌گام کتاب درسی کامل", type: "unlimited", detail: "نامحدود" },
      { title: "محتوای تصویری و ویدیویی", type: "unlimited", detail: "نامحدود" },
      { title: "آزمایشگاه مجازی و بازی‌ها", type: "unlimited", detail: "نامحدود" },
      { title: "ساخت و حل تمرین", type: "unlimited", detail: "نامحدود" },
      { title: "ساخت و چاپ آزمون", type: "unlimited", detail: "نامحدود" },
      { title: "هوشواره درس‌‌یاور", type: "unlimited", detail: "دسترسی VIP" },
    ],
  },
];

// ==========================================
// ۳. زیرکامپوننت‌های منطقی کارت
// ==========================================

function PlanIcon({ type }: { type: PricingPlanItem["iconType"] }) {
  if (type === "free") {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground mt-0.5">
        <BookOpen className="h-5 w-5" />
      </div>
    );
  }

  if (type === "pro") {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm mt-0.5">
        <Crown className="h-5 w-5" />
      </div>
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary mt-0.5">
      <Zap className="h-5 w-5" />
    </div>
  );
}

// ۳.۱ هدر کارت (شامل تگ محبوب، نام، توضیحات و قیمت)
function PricingCardHeader({ plan }: { plan: PricingPlanItem }) {
  const isFree = plan.price === 0;

  return (
    <>
      {plan.isPopular && (
        <div className="absolute top-0 left-0 bg-primary text-primary-foreground text-[11px] font-semibold px-3 py-1 rounded-br-xl flex items-center gap-1 z-10">
          <Sparkles className="h-3 w-3" />
          <span>پیشنهاد منتخب</span>
        </div>
      )}

      <div className="flex items-start justify-between gap-3 p-4 border-b border-border/40">
        <div className="flex items-start gap-3 min-w-0">
          <PlanIcon type={plan.iconType} />
          <div className="flex flex-col items-start gap-1 min-w-0">
            <span className="text-base font-bold text-foreground truncate w-full">{plan.name}</span>
            <span className="text-xs text-muted-foreground line-clamp-2">{plan.tagline}</span>
          </div>
        </div>

        <div className="text-start shrink-0 pt-0.5">
          {plan.originalPrice && (
            <span className="text-xs text-muted-foreground line-through block mb-0.5">
              {plan.originalPrice.toLocaleString("fa-IR")}
            </span>
          )}
          <span className="text-base font-bold text-primary whitespace-nowrap block">
            {isFree ? "رایگان" : `${plan.price.toLocaleString("fa-IR")} ${plan.currency}`}
          </span>
          <span className="text-[11px] text-muted-foreground block">دوره: {plan.periodText}</span>
        </div>
      </div>
    </>
  );
}

// ۳.۲ بنر تخفیف دوره‌ای
function PricingCardDiscount({ discountPercent }: { discountPercent?: number }) {
  if (!discountPercent) return null;

  return (
    <div className="px-4 py-2 bg-emerald-500/10 border-b border-border/30 flex items-center justify-between text-xs text-emerald-700">
      <span>تخفیف اشتراک دوره‌ای:</span>
      <span className="font-bold">{discountPercent.toLocaleString("fa-IR")}٪ صرفه‌جویی</span>
    </div>
  );
}

// ۳.۳ فهرست امکانات و سهمیه‌ها
function PricingCardFeatures({ features }: { features: PlanFeature[] }) {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-foreground">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <span>امکانات و دسترسی‌ها:</span>
      </div>

      <div className="space-y-2.5 px-0.5">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs py-0.5">
            <div className="flex items-center gap-2.5 min-w-0">
              {feature.type === "unlimited" && (
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              )}
              {feature.type === "limited" && <Clock className="h-4 w-4 text-amber-500 shrink-0" />}
              {feature.type === "disabled" && (
                <XCircle className="h-4 w-4 text-muted-foreground/60 shrink-0" />
              )}
              <span
                className={`font-medium truncate ${
                  feature.type === "disabled"
                    ? "line-through text-muted-foreground/60"
                    : "text-foreground"
                }`}
              >
                {feature.title}
              </span>
            </div>

            {feature.detail && (
              <span
                className={`text-xs shrink-0 mr-2 ${
                  feature.type === "unlimited"
                    ? "text-emerald-600 font-medium"
                    : feature.type === "limited"
                      ? "text-amber-600 font-medium"
                      : "text-muted-foreground/60"
                }`}
              >
                {feature.detail}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ۳.۴ اکشن و دکمه انتخاب پلن
interface PricingCardActionProps {
  isCurrentPlan: boolean;
  isPopular?: boolean;
  isFree: boolean;
  onSelect: () => void;
}

function PricingCardAction({ isCurrentPlan, isPopular, isFree, onSelect }: PricingCardActionProps) {
  return (
    <div className="p-4 border-t bg-muted/5 mt-auto">
      {isCurrentPlan ? (
        <Button
          disabled
          variant="outline"
          className="w-full gap-1.5 shadow-none opacity-80 cursor-not-allowed"
          size="default"
        >
          پلن فعال فعلی شما
        </Button>
      ) : (
        <Button
          onClick={onSelect}
          variant={isPopular ? "default" : "outline"}
          className="w-full gap-1.5 shadow-none"
          size="default"
        >
          {isFree ? "فعال‌سازی پلن پایه" : "انتخاب و ارتقا"}
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

// ==========================================
// ۴. کامپوننت کارت قیمت‌‌گذاری
// ==========================================
interface PlanPricingCardProps {
  plan: PricingPlanItem;
  isCurrentPlan?: boolean;
  onSelectPlan?: (planId: string) => void;
}

export function PlanPricingCard({
  plan,
  isCurrentPlan = false,
  onSelectPlan,
}: PlanPricingCardProps) {
  return (
    <div
      className={`relative w-full rounded-2xl border border-border/80 bg-card shadow-sm overflow-hidden flex flex-col justify-between transition-all duration-200 ${
        plan.isPopular ? "border-primary ring-1 ring-primary/30 shadow-md" : "hover:border-border"
      }`}
      dir="rtl"
    >
      <div>
        <PricingCardHeader plan={plan} />
        <PricingCardDiscount discountPercent={plan.discountPercent} />
        <PricingCardFeatures features={plan.features} />
      </div>

      <PricingCardAction
        isCurrentPlan={isCurrentPlan}
        isPopular={plan.isPopular}
        isFree={plan.price === 0}
        onSelect={() => onSelectPlan?.(plan.id)}
      />
    </div>
  );
}

// ==========================================
// ۵. کامپوننت بخش اشتراک‌های موجود
// ==========================================
interface AvailablePlansProps {
  currentPlanId?: string;
  onPlanSelect?: (planId: string) => void;
}

export function AvailablePlans({
  currentPlanId = "plan_pro_monthly",
  onPlanSelect,
}: AvailablePlansProps) {
  const [plans] = useState<PricingPlanItem[]>(MOCK_AVAILABLE_PLANS);

  const handleSelect = (planId: string) => {
    if (onPlanSelect) {
      onPlanSelect(planId);
    } else {
      console.log(`هدایت به درگاه پرداخت برای پلن: ${planId}`);
    }
  };

  return (
    <Card
      className="w-full rounded-2xl border-border/80 shadow-sm overflow-hidden py-0! gap-0"
      dir="rtl"
    >
      {/* هدر سراسری بخش، منطبق با کارت اشتراک فعلی */}
      <CardHeader className="flex flex-row items-center justify-between py-3.5! px-4 border-b bg-muted/20 space-y-0">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          <CardTitle className="text-base font-bold text-foreground">اشتراک‌های موجود</CardTitle>
        </div>
        <ProfileStatusBadge>۴ پلن فعال</ProfileStatusBadge>
      </CardHeader>

      <CardContent className="p-4 sm:p-5">
        <ProfileItemGroup>
          {/* گرید رسپانسیو کارت‌ها: ۱ ستونه در موبایل، ۲ ستونه در تبلت و لپ‌تاپ‌های متعارف، ۴ ستونه در صفحات عریض */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch">
            {plans.map((plan) => (
              <PlanPricingCard
                key={plan.id}
                plan={plan}
                isCurrentPlan={plan.id === currentPlanId}
                onSelectPlan={handleSelect}
              />
            ))}
          </div>
        </ProfileItemGroup>
      </CardContent>
    </Card>
  );
}
