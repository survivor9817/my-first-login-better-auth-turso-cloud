// components/account/account-header.tsx
"use client";

import { Search, Bell, ShoppingCart, SunMedium, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Logo from "../landing/logo";

interface AccountHeaderProps {
  onMenuToggle?: () => void;
}

export function AccountHeader({ onMenuToggle }: AccountHeaderProps) {
  return (
    <header className="w-full bg-card border-b border-border p-4 flex items-center justify-between gap-4 h-20">
      {/* منوی همبرگری و سرچ‌‌بار */}
      <div className="flex items-center gap-2 flex-1 max-w-md">
        <Logo />

        {/* <div className="relative w-full">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="جستجو در دوره‌ها، تنظیمات، تیکت‌ها..."
            className="pr-9 pl-3 bg-background/50 border-border text-sm"
          />
        </div> */}
      </div>

      {/* ابزارک‌ها و وضعیت */}
      <div className="flex items-center gap-3 md:gap-4 text-muted-foreground">
        <button className="hover:text-foreground p-1 transition-colors" title="حالت تاریک/روشن">
          <SunMedium className="w-5 h-5" />
        </button>
        <button className="hover:text-foreground p-1 transition-colors" title="سبد خرید">
          <ShoppingCart className="w-5 h-5" />
        </button>
        <button className="hover:text-foreground p-1 transition-colors relative" title="اعلان‌ها">
          <Bell className="w-5 h-5" />
          <span className="w-2 h-2 rounded-full bg-primary absolute top-1 -right-0.5" />
        </button>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden shrink-0"
          onClick={onMenuToggle}
          title="منوی دسترسی"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
