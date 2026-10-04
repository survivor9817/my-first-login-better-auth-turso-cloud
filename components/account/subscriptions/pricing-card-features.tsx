import { ShieldCheck, CheckCircle2, Clock, XCircle } from "lucide-react";
import { PlanFeature } from "./types";

export function PricingCardFeatures({ features }: { features: PlanFeature[] }) {
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
              {feature.type === "limited" && (
                <Clock className="h-4 w-4 text-amber-500 shrink-0" />
              )}
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
