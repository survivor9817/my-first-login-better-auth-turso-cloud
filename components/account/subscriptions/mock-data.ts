import { PricingPlanItem } from "./types";
import { formatPeriodText } from "./utils";

export const INITIAL_PLANS: PricingPlanItem[] = [
  {
    id: "plan_free",
    name: "اشتراک پایه",
    tagline: "یادگیری استاندارد برای شروع مطالعه",
    price: 0,
    currency: "تومان",
    periodMonths: 0,
    periodText: formatPeriodText(0),
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
    features: [
      { title: "حل گام‌به‌گام کتاب درسی کامل", type: "unlimited", detail: "نامحدود" },
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
    currency: "تومان",
    periodMonths: 3,
    periodText: formatPeriodText(3),
    badgeText: "پرطرفدار",
    features: [
      { title: "حل گام‌به‌گام کتاب درسی کامل", type: "unlimited", detail: "نامحدود" },
      { title: "محتوای تصویری و ویدیویی", type: "unlimited", detail: "نامحدود" },
      { title: "آزمایشگاه مجازی و بازی‌ها", type: "unlimited", detail: "نامحدود" },
      { title: "ساخت و حل تمرین", type: "unlimited", detail: "نامحدود" },
      { title: "ساخت و چاپ آزمون", type: "unlimited", detail: "نامحدود با بارم‌بندی" },
      { title: "هوشواره درس‌یاور", type: "unlimited", detail: "اولویت در پاسخ‌دهی" },
    ],
  },
];
