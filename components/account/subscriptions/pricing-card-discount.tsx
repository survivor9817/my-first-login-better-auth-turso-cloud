export function PricingCardDiscount({ discountPercent }: { discountPercent?: number }) {
  if (!discountPercent || discountPercent <= 0) return null;

  return (
    <div className="px-4 py-2 bg-emerald-500/10 border-b border-border/30 flex items-center justify-between text-xs text-emerald-700">
      <span>تخفیف اشتراک دوره‌ای:</span>
      <span className="font-bold">{discountPercent.toLocaleString("fa-IR")}٪ صرفه‌جویی</span>
    </div>
  );
}
