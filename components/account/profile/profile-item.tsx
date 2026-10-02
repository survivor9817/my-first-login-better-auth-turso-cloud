"use client";

import * as React from "react";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ProfileStatusBadge({
  children = "تایید شده",
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ProfileItemGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("divide-y divide-border", className)}>{children}</div>;
}

// نمایش اطلاعات غیرتعاملی (مانند نام، کد ملی و...)
export function ProfileItem({
  label,
  value,
  placeholder = "ثبت نشده",
  className,
}: {
  label: string;
  value?: string | null;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1 p-4 text-start", className)}>
      <span className="text-sm font-semibold text-foreground/90">{label}</span>
      <span className="text-xs sm:text-sm text-muted-foreground">{value || placeholder}</span>
    </div>
  );
}

// سطر اطلاعات همراه با دکمه ویرایش مجزا و outline
export function ProfileContactItem({
  label,
  value,
  isVerified = true,
  onEdit,
  className,
}: {
  label: string;
  value: string;
  isVerified?: boolean;
  onEdit: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-row-reverse items-center justify-between p-4", className)}>
      {/* سمت چپ: دکمه outline ویرایش + بج تایید */}
      <div className="flex items-center gap-2.5">
        {isVerified && <ProfileStatusBadge>تایید شده</ProfileStatusBadge>}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="h-8 gap-1.5 px-3 text-xs shadow-none hover:bg-muted"
        >
          <Pencil className="h-3.5 w-3.5" />
          ویرایش
        </Button>
      </div>

      {/* سمت راست: عنوان و مقدار */}
      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-foreground/90">{label}</span>
        <span className="text-xs sm:text-sm text-muted-foreground">{value}</span>
      </div>
    </div>
  );
}
