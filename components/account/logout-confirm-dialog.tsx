"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";

interface LogoutConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void> | void;
  isLoading?: boolean;
}

export function LogoutConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: LogoutConfirmDialogProps) {
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        <span className="flex items-center gap-2 text-destructive">
          <LogOut className="h-5 w-5" />
          خروج از حساب کاربری
        </span>
      }
      // description="آیا از خروج از حساب کاربری خود اطمینان دارید؟ برای ورود مجدد نیاز به دریافت کد تایید یا وارد کردن رمز عبور خواهید داشت."
    >
      <div className="flex flex-col gap-3 pt-2" dir="rtl">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
        >
          پاک کردن لوکال استورج
        </button>

        <div className="flex flex-row-reverse justify-start gap-2 pt-2">
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 sm:flex-initial"
          >
            {isLoading ? "در حال خروج..." : "بله، خارج شو"}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1 sm:flex-initial"
          >
            انصراف
          </Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
}
