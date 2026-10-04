"use client";

import { AvailablePlans } from "./available-plans";

export function SubscriptionsPanel() {
  return (
    <div className="mx-auto w-full space-y-6" dir="rtl">
      <AvailablePlans />
      {/* <PricingPlans /> */}
    </div>
  );
}
