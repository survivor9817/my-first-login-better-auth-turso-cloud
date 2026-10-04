export type FeatureType = "unlimited" | "limited" | "disabled";

export interface PlanFeature {
  title: string;
  type: FeatureType;
  detail?: string;
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
  badgeText?: string;
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
