"use client";

import { ActiveSubscription } from "./active-subscription";
import { AvailablePlans } from "./available-plans";

export function BillingPanel() {
  const handleUpgrade = () => {
    // منطق اسکرول به پلن‌ها، هدایت به صفحه خرید یا باز کردن مودال
  };

  const handleViewDetails = () => {
    // منطق نمایش جزییات بیشتر مصرف و دسترسی‌ها
  };

  return (
    <div className="mx-auto w-full space-y-6" dir="rtl">
      {/* بلاک ۱: اشتراک فعال */}
      <ActiveSubscription onUpgrade={handleUpgrade} />

      {/* بلاک ۲: پلن‌های قابل انتخاب (Pricing Tiers) */}
      {/* <AvailablePlans /> */}
      {/* <PricingPlans /> */}

      {/* بلاک ۳: سوابق پرداخت و فاکتورها (Invoices Table) */}
      {/* <InvoicesTable /> */}
    </div>
  );
}
