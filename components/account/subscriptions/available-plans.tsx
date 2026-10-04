"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Plus,
  Trash2,
  Pencil,
  AlertTriangle,
  Eye,
  EyeOff,
  GripVertical,
  Calendar as CalendarIcon,
  X,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { ProfileStatusBadge, ProfileItemGroup } from "../profile/profile-item";

// ==========================================
// ۱. تایپ‌ها و اینترفیس‌ها
// ==========================================
export type FeatureType = "unlimited" | "limited" | "disabled";

export interface PlanFeature {
  title: string;
  type: FeatureType;
  detail?: string;
}

export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface PricingPlanItem {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  currency: string;
  periodMonths: number;
  periodText: string;
  discountPercent?: number;
  discountStartDate?: string;
  discountEndDate?: string;
  badgeText?: string;
  isActive: boolean;
  sortOrder: number;
  features: PlanFeature[];
}

export interface CurrentUser {
  id: string;
  name: string;
  role: "admin" | "user";
}

export const MOCK_CURRENT_USER: CurrentUser = {
  id: "usr_admin_01",
  name: "مدیر سیستم",
  role: "admin",
};

// ==========================================
// ۲. توابع کمکی فرمت‌دهی
// ==========================================
function formatPeriodText(periodMonths: number): string {
  if (periodMonths <= 0) return "همیشگی";
  return `${periodMonths.toLocaleString("fa-IR")} ماهه`;
}

function formatPersianDate(dateStringOrDate?: string | Date): string {
  if (!dateStringOrDate) return "";
  const d = typeof dateStringOrDate === "string" ? new Date(dateStringOrDate) : dateStringOrDate;
  if (isNaN(d.getTime())) return "";

  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

const NUMBER_INPUT_NO_SPIN_CLASS =
  "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

// ==========================================
// ۳. دیتای اولیه پلن‌ها (در حافظه)
// ==========================================
const INITIAL_PLANS: PricingPlanItem[] = [
  {
    id: "plan_free",
    name: "اشتراک پایه",
    tagline: "یادگیری استاندارد برای شروع مطالعه",
    price: 0,
    currency: "تومان",
    periodMonths: 0,
    periodText: formatPeriodText(0),
    isActive: true,
    sortOrder: 1,
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
    periodMonths: 1,
    periodText: formatPeriodText(1),
    isActive: true,
    sortOrder: 2,
    features: [
      { title: "حل گام‌‌به‌گام کتاب درسی کامل", type: "unlimited", detail: "نامحدود" },
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
    discountStartDate: new Date().toISOString(),
    discountEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    currency: "تومان",
    periodMonths: 3,
    periodText: formatPeriodText(3),
    badgeText: "پرطرفدار",
    isActive: true,
    sortOrder: 3,
    features: [
      { title: "حل گام‌به‌‌گام کتاب درسی کامل", type: "unlimited", detail: "نامحدود" },
      { title: "محتوای تصویری و ویدیویی", type: "unlimited", detail: "نامحدود" },
      { title: "آزمایشگاه مجازی و بازی‌ها", type: "unlimited", detail: "نامحدود" },
      { title: "ساخت و حل تمرین", type: "unlimited", detail: "نامحدود" },
      { title: "ساخت و چاپ آزمون", type: "unlimited", detail: "نامحدود با بارم‌بندی" },
      { title: "هوشواره درس‌یاور", type: "unlimited", detail: "اولویت در پاسخ‌دهی" },
    ],
  },
];

// ==========================================
// ۴. زیرکامپوننت‌های رندر کارت
// ==========================================

function PricingCardHeader({ plan }: { plan: PricingPlanItem }) {
  const isFree = plan.price === 0;

  return (
    <>
      {!plan.isActive ? (
        <div className="absolute top-0 left-0 bg-muted-foreground/80 text-background text-[11px] font-semibold px-3 py-1 rounded-br-xl flex items-center gap-1 z-10 shadow-xs">
          <Clock className="h-3 w-3" />
          <span>توقف فروش</span>
        </div>
      ) : (
        plan.badgeText &&
        plan.badgeText.trim() !== "" && (
          <div className="absolute top-0 left-0 bg-primary text-primary-foreground text-[11px] font-semibold px-3 py-1 rounded-br-xl flex items-center gap-1 z-10 shadow-xs">
            <Sparkles className="h-3 w-3" />
            <span>{plan.badgeText}</span>
          </div>
        )
      )}

      <div className="flex items-start justify-between gap-3 p-4 border-b border-border/40">
        <div className="flex flex-col items-start gap-1 min-w-0">
          <span className="text-base font-bold text-foreground truncate w-full">{plan.name}</span>
          <span className="text-xs text-muted-foreground line-clamp-2">{plan.tagline}</span>
        </div>

        <div className="text-start shrink-0 pt-0.5">
          {plan.originalPrice && plan.originalPrice > plan.price && (
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

function PricingCardDiscount({
  discountPercent,
  discountEndDate,
}: {
  discountPercent?: number;
  discountEndDate?: string;
}) {
  if (!discountPercent || discountPercent <= 0) return null;

  return (
    <div className="px-4 py-2 bg-emerald-500/10 border-b border-border/30 flex items-center justify-between text-xs text-emerald-700">
      <div className="flex items-center gap-1.5 flex-wrap">
        <span>تخفیف اشتراک دوره‌ای:</span>
        {discountEndDate && (
          <span className="text-[10px] text-emerald-600/90 font-medium">
            (مهلت: تا {formatPersianDate(discountEndDate)})
          </span>
        )}
      </div>
      <span className="font-bold shrink-0">
        {discountPercent.toLocaleString("fa-IR")}٪ صرفه‌جویی
      </span>
    </div>
  );
}

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

interface PricingCardActionProps {
  isCurrentPlan: boolean;
  hasBadge?: boolean;
  isFree: boolean;
  isActive: boolean;
  isAdmin?: boolean;
  dragHandleProps?: Record<string, any>;
  onSelect?: () => void;
  onToggleActive?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

function PricingCardAction({
  isCurrentPlan,
  hasBadge,
  isFree,
  isActive,
  isAdmin = false,
  dragHandleProps,
  onSelect,
  onToggleActive,
  onEdit,
  onDelete,
}: PricingCardActionProps) {
  return (
    <div className="p-4 border-t bg-muted/5 mt-auto flex items-center gap-2">
      {/* دکمه‌های ادمین در سمت چپ */}
      {isAdmin && (
        <div className="flex items-center gap-1.5 shrink-0" dir="ltr">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onToggleActive}
            title={isActive ? "توقف فروش پلن" : "شروع مجدد فروش"}
            className={`h-9 w-9 shadow-none transition-colors ${
              isActive
                ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10 border-emerald-500/30"
                : "text-amber-600 hover:text-amber-700 hover:bg-amber-500/10 border-amber-500/30"
            }`}
          >
            {isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onDelete}
            title="حذف اشتراک"
            className="h-9 w-9 text-muted-foreground hover:text-destructive hover:border-destructive/30 shadow-none"
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onEdit}
            title="ویرایش اشتراک"
            className="h-9 w-9 text-muted-foreground hover:text-foreground shadow-none"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* دکمه اصلی سفارش */}
      {isCurrentPlan ? (
        <Button
          disabled
          variant="outline"
          className="flex-1 gap-1.5 shadow-none opacity-80 cursor-not-allowed"
          size="default"
        >
          پلن فعال فعلی شما
        </Button>
      ) : !isActive ? (
        <Button
          disabled
          variant="outline"
          className="flex-1 gap-1.5 shadow-none opacity-60 cursor-not-allowed text-xs"
          size="default"
        >
          توقف موقت فروش
        </Button>
      ) : (
        <Button
          onClick={onSelect}
          variant={hasBadge ? "default" : "outline"}
          className="flex-1 gap-1.5 shadow-none"
          size="default"
        >
          {isFree ? "فعال‌سازی پلن پایه" : "انتخاب و ارتقا"}
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      )}

      {/* هندل کشیدن و جابه‌جایی اختصاصی در سمت راست دکمه اکشن */}
      {isAdmin && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          {...dragHandleProps}
          title="جابه‌جایی ترتیب پلن"
          className="h-9 w-9 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing shrink-0 shadow-none hover:bg-muted"
        >
          <GripVertical className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

// کامپوننت استاتیک کارت برای حالت پیش از هیدریشن (SSR)
function StaticPlanPricingCard({
  plan,
  isCurrentPlan = false,
  isAdmin = false,
}: {
  plan: PricingPlanItem;
  isCurrentPlan?: boolean;
  isAdmin?: boolean;
}) {
  const hasBadge = Boolean(plan.badgeText && plan.badgeText.trim() !== "");

  return (
    <div
      className={`relative w-full rounded-2xl border bg-card shadow-sm overflow-hidden flex flex-col justify-between transition-all duration-200 ${
        !plan.isActive
          ? "opacity-75 border-dashed border-border/80 bg-muted/10"
          : hasBadge
            ? "border-primary ring-1 ring-primary/30 shadow-md"
            : "border-border/80 hover:border-border"
      }`}
      dir="rtl"
    >
      <div>
        <PricingCardHeader plan={plan} />
        <PricingCardDiscount
          discountPercent={plan.discountPercent}
          discountEndDate={plan.discountEndDate}
        />
        <PricingCardFeatures features={plan.features} />
      </div>

      <PricingCardAction
        isCurrentPlan={isCurrentPlan}
        hasBadge={hasBadge}
        isFree={plan.price === 0}
        isActive={plan.isActive}
        isAdmin={isAdmin}
      />
    </div>
  );
}

// کامپوننت سورتبل کارت با اتصال به dnd-kit
export function SortablePlanPricingCard({
  plan,
  isCurrentPlan = false,
  isAdmin = false,
  onSelectPlan,
  onToggleActivePlan,
  onEditPlan,
  onDeletePlan,
}: {
  plan: PricingPlanItem;
  isCurrentPlan?: boolean;
  isAdmin?: boolean;
  onSelectPlan?: (planId: string) => void;
  onToggleActivePlan?: (planId: string) => void;
  onEditPlan?: (plan: PricingPlanItem) => void;
  onDeletePlan?: (plan: PricingPlanItem) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: plan.id,
    disabled: !isAdmin,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  const hasBadge = Boolean(plan.badgeText && plan.badgeText.trim() !== "");

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative w-full rounded-2xl border bg-card shadow-sm overflow-hidden flex flex-col justify-between transition-shadow duration-200 ${
        isDragging ? "ring-2 ring-primary shadow-xl opacity-90 scale-[1.02]" : ""
      } ${
        !plan.isActive
          ? "opacity-75 border-dashed border-border/80 bg-muted/10"
          : hasBadge
            ? "border-primary ring-1 ring-primary/30 shadow-md"
            : "border-border/80 hover:border-border"
      }`}
      dir="rtl"
    >
      <div>
        <PricingCardHeader plan={plan} />
        <PricingCardDiscount
          discountPercent={plan.discountPercent}
          discountEndDate={plan.discountEndDate}
        />
        <PricingCardFeatures features={plan.features} />
      </div>

      <PricingCardAction
        isCurrentPlan={isCurrentPlan}
        hasBadge={hasBadge}
        isFree={plan.price === 0}
        isActive={plan.isActive}
        isAdmin={isAdmin}
        dragHandleProps={{ ...attributes, ...listeners }}
        onSelect={() => onSelectPlan?.(plan.id)}
        onToggleActive={() => onToggleActivePlan?.(plan.id)}
        onEdit={() => onEditPlan?.(plan)}
        onDelete={() => onDeletePlan?.(plan)}
      />
    </div>
  );
}

// ==========================================
// ۵. مودال ساخت / ویرایش اشتراک
// ==========================================
interface FeatureInputItem {
  id: string;
  title: string;
  detail: string;
}

interface PlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitPlan: (plan: PricingPlanItem) => void;
  initialData?: PricingPlanItem | null;
  totalPlansCount: number;
}

function PlanDialog({
  open,
  onOpenChange,
  onSubmitPlan,
  initialData,
  totalPlansCount,
}: PlanDialogProps) {
  const isEdit = Boolean(initialData);

  const [name, setName] = useState(initialData?.name || "");
  const [tagline, setTagline] = useState(initialData?.tagline || "");
  const [badgeText, setBadgeText] = useState(initialData?.badgeText || "");
  const [isActive, setIsActive] = useState<boolean>(initialData ? initialData.isActive : true);
  const [originalPriceStr, setOriginalPriceStr] = useState(
    initialData ? (initialData.originalPrice || initialData.price || 0).toString() : "",
  );
  const [discountPercentStr, setDiscountPercentStr] = useState(
    initialData?.discountPercent ? initialData.discountPercent.toString() : "",
  );
  const [periodMonthsStr, setPeriodMonthsStr] = useState(
    initialData ? initialData.periodMonths.toString() : "1",
  );

  // استیت بازه زمانی فعال بودن تخفیف
  const [discountDateRange, setDiscountDateRange] = useState<DateRange | undefined>(() => {
    if (initialData?.discountStartDate || initialData?.discountEndDate) {
      return {
        from: initialData.discountStartDate ? new Date(initialData.discountStartDate) : undefined,
        to: initialData.discountEndDate ? new Date(initialData.discountEndDate) : undefined,
      };
    }
    return undefined;
  });

  const [featuresList, setFeaturesList] = useState<FeatureInputItem[]>(() => {
    if (initialData && initialData.features.length > 0) {
      return [
        ...initialData.features.map((f, idx) => ({
          id: idx.toString(),
          title: f.title,
          detail: f.detail || "",
        })),
        { id: Date.now().toString(), title: "", detail: "" },
      ];
    }
    return [{ id: "1", title: "", detail: "" }];
  });

  const handleUpdateFeatureRow = (index: number, field: "title" | "detail", value: string) => {
    setFeaturesList((prev) => {
      const next = prev.map((item, i) => (i === index ? { ...item, [field]: value } : item));

      const isLastRow = index === next.length - 1;
      const currentItem = next[index];
      const hasValue = currentItem.title.trim() !== "" || currentItem.detail.trim() !== "";

      if (isLastRow && hasValue) {
        next.push({ id: Date.now().toString(), title: "", detail: "" });
      }

      return next;
    });
  };

  const handleRemoveFeatureRow = (id: string) => {
    setFeaturesList((prev) => {
      const filtered = prev.filter((item) => item.id !== id);
      if (
        filtered.length === 0 ||
        filtered[filtered.length - 1].title.trim() !== "" ||
        filtered[filtered.length - 1].detail.trim() !== ""
      ) {
        filtered.push({ id: Date.now().toString(), title: "", detail: "" });
      }
      return filtered;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const originalPrice = Number(originalPriceStr) || 0;
    const discountPercent = Number(discountPercentStr) || 0;
    const periodMonths = Math.max(Number(periodMonthsStr) || 1, 1);

    const finalPrice =
      discountPercent > 0 ? Math.round(originalPrice * (1 - discountPercent / 100)) : originalPrice;

    const features: PlanFeature[] = featuresList
      .filter((f) => f.title.trim() !== "")
      .map((f) => ({
        title: f.title.trim(),
        type: "unlimited" as const,
        detail: f.detail.trim() || undefined,
      }));

    if (features.length === 0) {
      features.push({ title: "دسترسی به تمامی امکانات پایه", type: "unlimited" });
    }

    const planData: PricingPlanItem = {
      id: initialData?.id || `plan_${Date.now()}`,
      name,
      tagline: tagline || "پلن اشتراک اختصاصی",
      price: finalPrice,
      originalPrice: discountPercent > 0 ? originalPrice : undefined,
      discountPercent: discountPercent > 0 ? discountPercent : undefined,
      discountStartDate:
        discountPercent > 0 && discountDateRange?.from
          ? discountDateRange.from.toISOString()
          : undefined,
      discountEndDate:
        discountPercent > 0 && discountDateRange?.to
          ? discountDateRange.to.toISOString()
          : undefined,
      currency: "تومان",
      periodMonths,
      periodText: formatPeriodText(periodMonths),
      badgeText: badgeText.trim() || undefined,
      isActive,
      sortOrder: initialData ? initialData.sortOrder : totalPlansCount + 1,
      features,
    };

    onSubmitPlan(planData);
    onOpenChange(false);
  };

  const hasDiscount = Number(discountPercentStr) > 0;

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      className="rounded-2xl sm:max-w-[520px]"
      title={
        <div className="flex items-start gap-3 text-start" dir="rtl">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary mt-0.5">
            {isEdit ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-base font-bold text-foreground">
              {isEdit ? "ویرایش پلن اشتراک" : "ساخت اشتراک جدید"}
            </span>
            <span className="text-xs font-normal text-muted-foreground">
              مشخصات، بازه زمانی تخفیف و شرایط پلن را تعیین کنید.
            </span>
          </div>
        </div>
      }
      description=""
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs" dir="rtl">
        {/* وضعیت انتشار و فروش */}
        <div className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                isActive ? "bg-emerald-500/15 text-emerald-600" : "bg-muted text-muted-foreground"
              }`}
            >
              {isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">وضعیت انتشار و فروش</span>
              <span className="text-[11px] text-muted-foreground">
                {isActive
                  ? "پلن در لیست عمومی نمایش داده می‌شود و قابل خرید است."
                  : "پلن به عنوان پیش‌نویس ذخیره می‌شود و به کاربران عادی نمایش داده نخواهد شد."}
              </span>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={isActive}
            onClick={() => setIsActive((prev) => !prev)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              isActive ? "bg-emerald-600" : "bg-muted-foreground/30"
            }`}
            dir="ltr"
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                isActive ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">عنوان پلن</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="text-xs h-9"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">متن برچسب گوشه (اختیاری)</label>
            <Input
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              className="text-xs h-9"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-foreground">توضیح کوتاه (شعار)</label>
          <Input
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="text-xs h-9"
          />
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">قیمت اصلی (تومان)</label>
            <Input
              type="number"
              value={originalPriceStr}
              onChange={(e) => setOriginalPriceStr(e.target.value)}
              required
              className={`text-xs h-9 ${NUMBER_INPUT_NO_SPIN_CLASS}`}
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">تخفیف (درصد)</label>
            <Input
              type="number"
              min="0"
              max="100"
              value={discountPercentStr}
              onChange={(e) => setDiscountPercentStr(e.target.value)}
              className={`text-xs h-9 ${NUMBER_INPUT_NO_SPIN_CLASS}`}
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">مدت (به ماه)</label>
            <Input
              type="number"
              min="1"
              value={periodMonthsStr}
              onChange={(e) => setPeriodMonthsStr(e.target.value)}
              required
              className={`text-xs h-9 ${NUMBER_INPUT_NO_SPIN_CLASS}`}
            />
          </div>
        </div>

        {/* انتخابگر بازه زمانی مهلت تخفیف (رفع خطای button داخل button) */}
        {hasDiscount && (
          <div className="space-y-1.5 p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-foreground flex items-center gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5 text-primary" />
                <span>بازه زمانی مهلت تخفیف</span>
              </label>
              {discountDateRange && (
                <button
                  type="button"
                  onClick={() => setDiscountDateRange(undefined)}
                  className="text-[11px] text-muted-foreground hover:text-destructive flex items-center gap-0.5 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                  <span>بدون محدودیت زمانی</span>
                </button>
              )}
            </div>

            <Popover>
              <PopoverTrigger
                type="button"
                className="w-full flex items-center justify-start text-right font-normal text-xs h-9 px-3 rounded-md border border-input bg-background hover:bg-muted/50 transition-colors shadow-none gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                {discountDateRange?.from ? (
                  discountDateRange.to ? (
                    <span className="font-medium text-foreground">
                      {formatPersianDate(discountDateRange.from)} تا{" "}
                      {formatPersianDate(discountDateRange.to)}
                    </span>
                  ) : (
                    <span className="font-medium text-foreground">
                      از {formatPersianDate(discountDateRange.from)} (در حال انتخاب پایان...)
                    </span>
                  )
                ) : (
                  <span className="text-muted-foreground">
                    تعیین تاریخ شروع و پایان تخفیف (اختیاری)
                  </span>
                )}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start" dir="rtl">
                <Calendar
                  mode="range"
                  defaultMonth={discountDateRange?.from}
                  selected={discountDateRange as any}
                  onSelect={(range: any) => setDiscountDateRange(range)}
                  numberOfMonths={1}
                  dir="rtl"
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* امکانات و دسترسی‌ها */}
        <div className="space-y-2 pt-1">
          <label className="font-semibold text-foreground block">امکانات و دسترسی‌ها</label>

          <div className="space-y-2 max-h-[190px] overflow-y-auto px-0.5">
            {featuresList.map((featureItem, index) => {
              const isFilled = featureItem.title.trim() !== "" || featureItem.detail.trim() !== "";
              const isTitleEmpty = !featureItem.title.trim();

              return (
                <div key={featureItem.id} className="flex items-center gap-2">
                  <Input
                    value={featureItem.title}
                    onChange={(e) => handleUpdateFeatureRow(index, "title", e.target.value)}
                    placeholder={`عنوان ویژگی ${index + 1}`}
                    className="text-xs h-8 flex-1"
                  />
                  <Input
                    value={featureItem.detail}
                    onChange={(e) => handleUpdateFeatureRow(index, "detail", e.target.value)}
                    disabled={isTitleEmpty}
                    placeholder="سطح دسترسی"
                    className="text-xs h-8 w-36 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {isFilled && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFeatureRow(featureItem.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2 border-t border-border/40">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs shadow-none"
          >
            انصراف
          </Button>
          <Button type="submit" size="sm" className="text-xs shadow-none gap-1">
            {isEdit ? "ذخیره تغییرات" : "افزودن پلن"}
          </Button>
        </div>
      </form>
    </ResponsiveDialog>
  );
}

// ==========================================
// ۶. مودال تأیید حذف پلن
// ==========================================
interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planName?: string;
  onConfirm: () => void;
}

function DeleteConfirmDialog({
  open,
  onOpenChange,
  planName,
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      className="rounded-2xl sm:max-w-[400px]"
      title={
        <div className="flex items-start gap-3 text-start" dir="rtl">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive mt-0.5">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-base font-bold text-foreground">تأیید حذف اشتراک</span>
            <span className="text-xs font-normal text-muted-foreground">
              این عملیات قابل بازگشت نخواهد بود.
            </span>
          </div>
        </div>
      }
      description=""
    >
      <div className="space-y-4 pt-2 text-xs" dir="rtl">
        <p className="text-muted-foreground leading-relaxed">
          آیا از حذف اشتراک <strong className="text-foreground font-semibold">«{planName}»</strong>{" "}
          اطمینان دارید؟ با حذف این مورد، کاربران دیگر قادر به انتخاب آن نخواهند بود.
        </p>

        <div className="pt-2 flex items-center justify-end gap-2 border-t border-border/40">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs shadow-none"
          >
            انصراف
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="text-xs shadow-none gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>حذف اشتراک</span>
          </Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
}

// ==========================================
// ۷. کامپوننت اصلی بخش اشتراک‌های موجود
// ==========================================
interface AvailablePlansProps {
  currentUser?: CurrentUser;
  currentPlanId?: string;
  onPlanSelect?: (planId: string) => void;
}

export function AvailablePlans({
  currentUser = MOCK_CURRENT_USER,
  currentPlanId = "plan_pro_monthly",
  onPlanSelect,
}: AvailablePlansProps) {
  const [plans, setPlans] = useState<PricingPlanItem[]>(INITIAL_PLANS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PricingPlanItem | null>(null);

  const [planToDelete, setPlanToDelete] = useState<PricingPlanItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdmin = currentUser.role === "admin";

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const displayPlans = useMemo(() => {
    if (!isAdmin) {
      return plans.filter((plan) => plan.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
    }

    return [...plans].sort((a, b) => {
      if (a.isActive !== b.isActive) {
        return a.isActive ? -1 : 1;
      }
      return a.sortOrder - b.sortOrder;
    });
  }, [plans, isAdmin]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setPlans((prev) => {
      const oldIndex = prev.findIndex((item) => item.id === active.id);
      const newIndex = prev.findIndex((item) => item.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return prev;

      const newArray = arrayMove(prev, oldIndex, newIndex);
      return newArray.map((item, idx) => ({
        ...item,
        sortOrder: idx + 1,
      }));
    });
  };

  const handleSelect = (planId: string) => {
    if (onPlanSelect) {
      onPlanSelect(planId);
    } else {
      console.log(`هدایت به درگاه پرداخت برای پلن: ${planId}`);
    }
  };

  const handleOpenCreate = () => {
    setEditingPlan(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (plan: PricingPlanItem) => {
    setEditingPlan(plan);
    setIsDialogOpen(true);
  };

  const handleOpenDelete = (plan: PricingPlanItem) => {
    setPlanToDelete(plan);
    setIsDeleteOpen(true);
  };

  const handleToggleActive = (planId: string) => {
    setPlans((prev) => prev.map((p) => (p.id === planId ? { ...p, isActive: !p.isActive } : p)));
  };

  const handleConfirmDelete = () => {
    if (!planToDelete) return;
    setPlans((prev) => prev.filter((p) => p.id !== planToDelete.id));
    setPlanToDelete(null);
  };

  const handleSavePlan = (planData: PricingPlanItem) => {
    if (editingPlan) {
      setPlans((prev) => prev.map((item) => (item.id === planData.id ? planData : item)));
    } else {
      setPlans((prev) => [...prev, planData]);
    }
  };

  return (
    <>
      <Card
        className="w-full rounded-2xl border-border/80 shadow-sm overflow-hidden py-0! gap-0"
        dir="rtl"
      >
        <CardHeader className="flex flex-row items-center justify-between py-3.5! px-4 border-b bg-muted/20 space-y-0">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-bold text-foreground">اشتراک‌های موجود</CardTitle>
            <ProfileStatusBadge>
              {displayPlans.length.toLocaleString("fa-IR")} عدد
            </ProfileStatusBadge>
          </div>

          {isAdmin && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleOpenCreate}
              className="h-8 gap-1.5 px-3 text-xs shadow-none hover:bg-muted"
            >
              <Plus className="h-3.5 w-3.5 text-primary" />
              <span>اشتراک جدید</span>
            </Button>
          )}
        </CardHeader>

        <CardContent className="p-4 sm:p-5">
          <ProfileItemGroup>
            {mounted ? (
              <DndContext
                id="available-plans-dnd-context"
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={displayPlans.map((p) => p.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 items-stretch">
                    {displayPlans.map((plan) => (
                      <SortablePlanPricingCard
                        key={plan.id}
                        plan={plan}
                        isCurrentPlan={plan.id === currentPlanId}
                        isAdmin={isAdmin}
                        onSelectPlan={handleSelect}
                        onToggleActivePlan={handleToggleActive}
                        onEditPlan={handleOpenEdit}
                        onDeletePlan={handleOpenDelete}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 items-stretch">
                {displayPlans.map((plan) => (
                  <StaticPlanPricingCard
                    key={plan.id}
                    plan={plan}
                    isCurrentPlan={plan.id === currentPlanId}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
            )}
          </ProfileItemGroup>
        </CardContent>
      </Card>

      {/* مودال ساخت یا ویرایش پلن */}
      {isDialogOpen && (
        <PlanDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmitPlan={handleSavePlan}
          initialData={editingPlan}
          totalPlansCount={plans.length}
        />
      )}

      {/* مودال تأیید حذف پلن */}
      <DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        planName={planToDelete?.name}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
