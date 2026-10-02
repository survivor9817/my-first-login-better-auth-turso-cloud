"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  CreditCard,
  HelpCircle,
  Sparkles,
  Headphones,
  X,
} from "lucide-react";
// import { initialProfileData } from "./profile/profile-mock";
import { cn } from "@/lib/utils";
import { UserCard } from "./user-card";

const mainNavItems = [
  { title: "پیشخوان", href: "/account", icon: LayoutDashboard },
  { title: "اطلاعات فردی", href: "/account/profile", icon: User },
  { title: "امنیت حساب", href: "/account/security", icon: ShieldCheck },
  { title: "اشتراک کاربری", href: "/account/billing", icon: CreditCard },
];

const secondaryNavItems = [
  { title: "پرسش و پاسخ‌ها", href: "#", icon: HelpCircle },
  { title: "دستیار هوشمند (AI)", href: "#", icon: Sparkles },
  { title: "پشتیبانی اختصاصی", href: "#", icon: Headphones },
];

interface AccountSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AccountSidebar({ isOpen = false, onClose }: AccountSidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full pt-4">
      <div>
        {/* هدر سایدبار */}
        {/* <div className="flex items-center justify-between border-b border-border w-full h-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border shrink-0">
              <User className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="text-start">
              <p className="font-semibold text-sm text-foreground">{initialProfileData.username}</p>
              <p className="text-xs text-muted-foreground font-mono" dir="ltr">
                {initialProfileData.phoneNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-muted-foreground">
            <button
              className="hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-muted"
              title="تنظیمات"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              className="hover:text-destructive transition-colors p-1.5 rounded-md hover:bg-destructive/10"
              title="خروج"
            >
              <LogOut className="w-4 h-4" />
            </button>

            <button
              className="md:hidden hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-muted mr-1"
              onClick={onClose}
              title="بستن منو"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div> */}
        <button
          className="md:hidden absolute left-6 top-6 z-10 hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-muted mr-1"
          onClick={onClose}
          title="بستن منو"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <UserCard />

        {/* لینک‌های اصلی */}
        <div className="mt-6">
          <p className="text-xs font-semibold text-muted-foreground mb-3 px-2">دسترسی سریع</p>
          <nav className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all",
                    isActive
                      ? "bg-primary/10 text-primary font-medium border-s-4 border-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* امکانات تکمیلی */}
        <div className="mt-8">
          <p className="text-xs font-semibold text-muted-foreground mb-3 px-2">امکانات تکمیلی</p>
          <nav className="space-y-1">
            {secondaryNavItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* سایدبار دسکتاپ: بردر در سمت چپ سایدبار قرار می‌گیرد (مرز بین سایدبار و محتوا) */}
      <aside className="hidden md:flex w-64 bg-card border-l border-border px-4 flex-col justify-between shrink-0">
        {sidebarContent}
      </aside>

      {/* منوی کشویی موبایل */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-start">
          {/* پس‌زمینه */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          {/* پنل کشویی که از لبه راست ظاهر می‌شود */}
          <div className="relative w-72 max-w-[85%] bg-card h-full px-4 shadow-2xl border-l border-border z-10 animate-in slide-in-from-right duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
