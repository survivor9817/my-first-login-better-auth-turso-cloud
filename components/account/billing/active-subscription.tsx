"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CreditCard,
  Sparkles,
  ArrowUpRight,
  AlertCircle,
  Loader2,
  Calendar,
  Hourglass,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck,
  Infinity as InfinityIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProfileStatusBadge, ProfileItemGroup } from "../profile/profile-item";

// ==========================================
// ۱. تایپ‌ها و ساختار دیتابیس
// ==========================================
export type FeatureType = "unlimited" | "limited" | "disabled";

export interface PlanFeature {
  title: string;
  type: FeatureType;
  detail?: string;
}

export interface Plan {
  id: string;
  name: string;
  tagline: string;
  price: number;
  currency: string;
  features: PlanFeature[];
}

export interface ActiveSubscriptionRecord {
  id: string;
  userId: string;
  planId: string;
  status: "active" | "expired" | "canceled";
  statusFa: string;
  billingCycle: "monthly" | "yearly" | "free";
  billingCycleFa: string;
  startsAt: string;
  expiresAt: string;
  startDateIso?: string;
  endDateIso?: string;
  plan: Plan;
}

// ==========================================
// ۲. جدول پلن‌های سامانه
// ==========================================
export const PLANS_DATABASE: Record<string, Plan> = {
  free: {
    id: "plan_free",
    name: "اشتراک پایه (رایگان)",
    tagline: "یادگیری کامل برای همه",
    price: 0,
    currency: "تومان",
    features: [
      {
        title: "حل گام‌به‌‌گام کتاب درسی کامل",
        type: "unlimited",
        detail: "نامحدود",
      },
      {
        title: "محتوای تصویری و ویدیویی متنوع",
        type: "unlimited",
        detail: "نامحدود",
      },
      {
        title: "بازی‌های تعاملی و آزمایشگاه مجازی",
        type: "limited",
        detail: "۳ بار اجرا در هر بخش",
      },
      {
        title: "ساخت و حل تمرین",
        type: "limited",
        detail: "۲ تمرین روزانه (فیلتر ساده)",
      },
      {
        title: "ساخت و چاپ آزمون",
        type: "limited",
        detail: "۱ آزمون در ماه",
      },
      {
        title: "هوشواره درس‌یاور",
        type: "disabled",
        detail: "عدم دسترسی",
      },
    ],
  },
  pro: {
    id: "plan_pro",
    name: "اشتراک پیشرفته",
    tagline: "دسترسی کامل به همراه دستیار هوش مصنوعی",
    price: 189000,
    currency: "تومان",
    features: [
      {
        title: "حل گام‌‌به‌گام کتاب درسی کامل",
        type: "unlimited",
        detail: "نامحدود",
      },
      {
        title: "محتوای تصویری و ویدیویی متنوع",
        type: "unlimited",
        detail: "نامحدود",
      },
      {
        title: "بازی‌های تعاملی و آزمایشگاه مجازی",
        type: "unlimited",
        detail: "دسترسی نامحدود",
      },
      {
        title: "ساخت و حل تمرین",
        type: "unlimited",
        detail: "نامحدود با فیلتر هوشمند",
      },
      {
        title: "ساخت و چاپ آزمون",
        type: "unlimited",
        detail: "نامحدود با بارم‌بندی",
      },
      {
        title: "هوشواره درس‌‌یاور",
        type: "unlimited",
        detail: "پاسخ‌گویی اختصاصی هوش مصنوعی",
      },
    ],
  },
};

// ==========================================
// ۳. دیتای ماک اشتراک جاری کاربر
// ==========================================
const now = new Date();
const pastDate = new Date(now.getTime() - 22 * 24 * 60 * 60 * 1000);
const futureDate = new Date(now.getTime() + 38 * 24 * 60 * 60 * 1000);

export const MOCK_USER_SUBSCRIPTION: ActiveSubscriptionRecord | null = {
  id: "sub_98451203",
  userId: "usr_4401",
  planId: "plan_pro",
  status: "active",
  statusFa: "فعال",
  billingCycle: "monthly",
  billingCycleFa: "ماهانه",
  startsAt: "۱۴۰۳/۰۶/۰۱",
  expiresAt: "۱۴۰۳/۰۸/۰۱",
  startDateIso: pastDate.toISOString(),
  endDateIso: futureDate.toISOString(),
  plan: PLANS_DATABASE.pro,
};

const fetchUserSubscription = async (): Promise<ActiveSubscriptionRecord | null> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_USER_SUBSCRIPTION;
};

// ==========================================
// ۴. کامپوننت وضعیت بدون اشتراک فعال (Empty State)
// ==========================================
interface NoActiveSubscriptionProps {
  onUpgrade?: () => void;
}

export function NoActiveSubscription({ onUpgrade }: NoActiveSubscriptionProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <AlertCircle className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">هیچ اشتراکی برای شما فعال نیست.</p>
        <p className="text-xs text-muted-foreground">
          برای دسترسی نامحدود به خدمات درس‌یاور، اشتراک تهیه کنید.
        </p>
      </div>
      <Button onClick={onUpgrade} className="w-full gap-1.5 shadow-none" size="default">
        خرید اشتراک جدید
        <ArrowUpRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

// ==========================================
// ۵. کامپوننت اصلی
// ==========================================
interface ActiveSubscriptionProps {
  onUpgrade?: () => void;
}

export function ActiveSubscription({ onUpgrade }: ActiveSubscriptionProps) {
  const [subscription, setSubscription] = useState<ActiveSubscriptionRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setIsLoading(true);
        const data = await fetchUserSubscription();
        if (isMounted) setSubscription(data);
      } catch (err) {
        console.error("خطا در واکشی اطلاعات اشتراک:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const timeProgress = useMemo(() => {
    if (!subscription || subscription.billingCycle === "free" || !subscription.endDateIso) {
      return { isUnlimited: true, daysRemaining: null, percentageUsed: 0 };
    }

    const start = new Date(subscription.startDateIso || Date.now()).getTime();
    const end = new Date(subscription.endDateIso).getTime();
    const current = Date.now();

    const totalDuration = Math.max(end - start, 1);
    const elapsed = Math.max(current - start, 0);
    const remainingMs = Math.max(end - current, 0);

    const daysRemaining = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
    const percentageUsed = Math.min(Math.round((elapsed / totalDuration) * 100), 100);

    return {
      isUnlimited: false,
      daysRemaining,
      percentageUsed,
    };
  }, [subscription]);

  const isPro = subscription?.plan.price && subscription.plan.price > 0;

  return (
    <Card
      className="w-full rounded-2xl border-border/80 shadow-sm overflow-hidden py-0! gap-0"
      dir="rtl"
    >
      <CardHeader className="flex flex-row items-center justify-between py-3.5! px-4 border-b bg-muted/20 space-y-0">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-primary" />
          <CardTitle className="text-base font-bold text-foreground">اشتراک فعلی</CardTitle>
        </div>
        {!isLoading && (
          <ProfileStatusBadge>
            {subscription ? subscription.statusFa : "غیرفعال"}
          </ProfileStatusBadge>
        )}
      </CardHeader>

      <CardContent className="p-0! pt-0!">
        {isLoading ? (
          <div className="flex items-center justify-center p-8 gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>در حال بارگذاری اطلاعات اشتراک...</span>
          </div>
        ) : subscription ? (
          <>
            <ProfileItemGroup>
              {/* هدر پلن */}
              <div className="flex items-start justify-between gap-4 p-4 border-b border-border/40">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary mt-0.5">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-base font-bold text-foreground">
                      {subscription.plan.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {subscription.plan.tagline}
                    </span>
                  </div>
                </div>

                <div className="text-start shrink-0">
                  <span className="text-sm font-semibold text-primary whitespace-nowrap block">
                    {subscription.plan.price === 0
                      ? "رایگان"
                      : `${subscription.plan.price.toLocaleString("fa-IR")} ${subscription.plan.currency}`}
                  </span>
                </div>
              </div>

              {/* بلاک وضعیت دوره: تفکیک هوشمند پلن مدت‌دار از پلن نامحدود */}
              {timeProgress.isUnlimited ? (
                <div className="flex items-center justify-between p-3.5 px-4 bg-muted/10 border-b border-border/40 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <InfinityIcon className="h-4 w-4 text-emerald-500" />
                    <span>اعتبار زمانی حساب:</span>
                  </div>
                  <span className="font-medium text-emerald-600">دائمی و بدون محدودیت زمانی</span>
                </div>
              ) : (
                <div className="p-4 bg-muted/15 border-b border-border/40 space-y-2.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Hourglass className="h-4 w-4 text-primary/80" />
                      <span>
                        میزان مصرف: {timeProgress.percentageUsed.toLocaleString("fa-IR")}%
                      </span>
                    </div>
                    <span className="font-semibold text-foreground">
                      معتبر تا {timeProgress.daysRemaining?.toLocaleString("fa-IR")} روز دیگر
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <Progress value={timeProgress.percentageUsed} className="h-2 w-full" />
                    <div className="flex justify-between text-[11px] text-muted-foreground pt-1.5">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>شروع: {subscription.startsAt}</span>
                      </div>
                      <span>انقضا: {subscription.expiresAt}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* فهرست امکانات اشتراک داخل بدنه کارت */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>امکانات اشتراک</span>
                </div>

                <div className="space-y-2.5 px-0.5">
                  {subscription.plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-0.5">
                      <div className="flex items-center gap-2.5">
                        {feature.type === "unlimited" && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        )}
                        {feature.type === "limited" && (
                          <Clock className="h-4 w-4 text-amber-500 shrink-0" />
                        )}
                        {feature.type === "disabled" && (
                          <XCircle className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                        )}
                        <span
                          className={`font-medium ${
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
                          className={`text-xs ${
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
            </ProfileItemGroup>

            {/* اکشن کارت */}
            <div className="p-4 border-t bg-muted/5">
              <Button onClick={onUpgrade} className="w-full gap-1.5 shadow-none" size="default">
                {isPro ? "تمدید یا ارتقای پلن" : "ارتقا به پلن ویژه"}
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <NoActiveSubscription onUpgrade={onUpgrade} />
        )}
      </CardContent>
    </Card>
  );
}
