"use client";

import { ResponsiveDialog } from "@/components/ui/responsive-dialog"; // مسیر ایمپورت کامپوننت ریسپانسیو دیالوگ
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, XCircle, Sparkles, ShieldCheck } from "lucide-react";
import type { ActiveSubscriptionRecord } from "./active-subscription";

interface SubscriptionDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: ActiveSubscriptionRecord | null;
  onUpgrade?: () => void;
}

export function SubscriptionDetailsDialog({
  open,
  onOpenChange,
  subscription,
  onUpgrade,
}: SubscriptionDetailsDialogProps) {
  if (!subscription) return null;

  const isFree = subscription.plan.price === 0;

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      className="rounded-2xl"
      contentClassName="p-0"
      title={
        <div className="flex items-center gap-2 text-start font-bold text-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <span>جزئیات کامل اشتراک</span>
        </div>
      }
      description={
        <span className="block   text-xs text-muted-foreground">
          مشخصات کامل سطح دسترسی، امکانات و چرخه تمدید حساب شما
        </span>
      }
    >
      <div className="space-y-6 px-5 pt-2 pb-5" dir="rtl">
        {/* کادر مشخصات کلی دوره و هزینه */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-muted/30 border border-border/60 text-xs">
          <div className="space-y-1">
            <span className="text-muted-foreground">نام پلن:</span>
            <p className="font-semibold text-foreground">{subscription.plan.name}</p>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground">تعرفه دوره:</span>
            <p className="font-semibold text-primary">
              {isFree
                ? "رایگان"
                : `${subscription.plan.price.toLocaleString("fa-IR")} ${subscription.plan.currency}`}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground">تاریخ شروع:</span>
            <p className="font-medium text-foreground">{subscription.startsAt}</p>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground">تاریخ پایان دوره:</span>
            <p className="font-medium text-foreground">{subscription.expiresAt}</p>
          </div>
        </div>

        {/* لیست امکانات اشتراک بدون کادر */}
        <div className="space-y-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>امکانات اشتراک</span>
          </div>

          <div className="space-y-3 px-1">
            {subscription.plan.features.map((feature, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1">
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

        {/* دکمه‌های فوتر دیالوگ */}
        <div className="pt-3 border-t flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs shadow-none"
          >
            بستن
          </Button>
          <Button
            size="sm"
            onClick={() => {
              onOpenChange(false);
              onUpgrade?.();
            }}
            className="text-xs shadow-none"
          >
            ارتقا / تمدید
          </Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
}
