import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { PricingPlanItem, PlanFeature } from "./types";
import { formatPeriodText, NUMBER_INPUT_NO_SPIN_CLASS } from "./utils";

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
}

export function PlanDialog({ open, onOpenChange, onSubmitPlan, initialData }: PlanDialogProps) {
  const isEdit = Boolean(initialData);

  const [name, setName] = useState(initialData?.name || "");
  const [tagline, setTagline] = useState(initialData?.tagline || "");
  const [badgeText, setBadgeText] = useState(initialData?.badgeText || "");
  const [originalPriceStr, setOriginalPriceStr] = useState(
    initialData ? (initialData.originalPrice || initialData.price || 0).toString() : "",
  );
  const [discountPercentStr, setDiscountPercentStr] = useState(
    initialData?.discountPercent ? initialData.discountPercent.toString() : "",
  );
  const [periodMonthsStr, setPeriodMonthsStr] = useState(
    initialData ? initialData.periodMonths.toString() : "1",
  );

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
      currency: "تومان",
      periodMonths,
      periodText: formatPeriodText(periodMonths),
      badgeText: badgeText.trim() || undefined,
      features,
    };

    onSubmitPlan(planData);
    onOpenChange(false);
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      className="rounded-2xl sm:max-w-130"
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
              مشخصات، برچسب و شرایط زمانی پلن را تعیین کنید.
            </span>
          </div>
        </div>
      }
      description=""
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs" dir="rtl">
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
          <label className="font-semibold text-foreground">توضیح کوتاه (شعار)</label>
          <Input
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
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

        <div className="space-y-2 pt-1">
          <label className="font-semibold text-foreground block">امکانات و دسترسی‌ها</label>

          <div className="space-y-2 max-h-47.5 overflow-y-auto px-0.5">
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
