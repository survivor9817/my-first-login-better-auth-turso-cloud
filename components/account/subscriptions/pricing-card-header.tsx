import { PricingPlanItem } from "./types";

export function PricingCardHeader({ plan }: { plan: PricingPlanItem }) {
  const isFree = plan.price === 0;

  return (
    <>
      {plan.badgeText && plan.badgeText.trim() !== "" && (
        <div className="absolute top-0 left-0 bg-primary text-primary-foreground text-[11px] font-semibold px-3 py-1 rounded-br-xl flex items-center gap-1 z-10 shadow-xs">
          <span>{plan.badgeText}</span>
        </div>
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
