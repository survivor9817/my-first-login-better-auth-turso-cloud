import { PricingPlanItem } from "./types";
import { PricingCardHeader } from "./pricing-card-header";
import { PricingCardDiscount } from "./pricing-card-discount";
import { PricingCardFeatures } from "./pricing-card-features";
import { PricingCardAction } from "./pricing-card-action";

interface PlanPricingCardProps {
  plan: PricingPlanItem;
  isCurrentPlan?: boolean;
  isAdmin?: boolean;
  onSelectPlan?: (planId: string) => void;
  onEditPlan?: (plan: PricingPlanItem) => void;
  onDeletePlan?: (plan: PricingPlanItem) => void;
}

export function PlanPricingCard({
  plan,
  isCurrentPlan = false,
  isAdmin = false,
  onSelectPlan,
  onEditPlan,
  onDeletePlan,
}: PlanPricingCardProps) {
  const hasBadge = Boolean(plan.badgeText && plan.badgeText.trim() !== "");

  return (
    <div
      className={`relative w-full rounded-2xl border border-border/80 bg-card shadow-sm overflow-hidden flex flex-col justify-between transition-all duration-200 ${
        hasBadge
          ? "border-primary ring-1 ring-primary/30 shadow-md"
          : "hover:border-border"
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
        hasBadge={hasBadge}
        isFree={plan.price === 0}
        isAdmin={isAdmin}
        onSelect={() => onSelectPlan?.(plan.id)}
        onEdit={() => onEditPlan?.(plan)}
        onDelete={() => onDeletePlan?.(plan)}
      />
    </div>
  );
}
