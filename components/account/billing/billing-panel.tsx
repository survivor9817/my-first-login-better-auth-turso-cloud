"use client";

import { ActiveSubscription } from "./active-subscription";

export function BillingPanel() {
  const handleUpgrade = () => {
    // منطق اسکرول به پلن‌ها، هدایت به صفحه خرید یا باز کردن مودال
  };

  const handleViewDetails = () => {
    // منطق نمایش جزییات بیشتر مصرف و دسترسی‌ها
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6" dir="rtl">
      {/* بلاک ۱: اشتراک فعال */}
      <ActiveSubscription onUpgrade={handleUpgrade} />

      {/* بلاک ۲: پلن‌های قابل انتخاب (Pricing Tiers) */}
      {/* <PricingPlans /> */}

      {/* بلاک ۳: سوابق پرداخت و فاکتورها (Invoices Table) */}
      {/* <InvoicesTable /> */}
    </div>
  );
}
