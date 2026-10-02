"use client";

import { LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";

interface RevokeSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void> | void;
  isLoading?: boolean;
  deviceName?: string;
}

export function RevokeSessionDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
  deviceName = "این دستگاه",
}: RevokeSessionDialogProps) {
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        <span className="flex items-center gap-2 text-destructive font-semibold">
          <LogOut className="h-5 w-5" />
          پایان دادن به نشست
        </span>
      }
      description={`آیا از بستن نشست فعال در ${deviceName} اطمینان دارید؟ برای استفاده مجدد در آن دستگاه باید دوباره وارد شوید.`}
    >
      <div className="flex flex-col gap-3 pt-2" dir="rtl">
        <div className="flex flex-row-reverse justify-start gap-2 pt-2 border-t mt-2">
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 sm:flex-initial min-w-28"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
                در حال بستن...
              </>
            ) : (
              "بله، خاتمه بده"
            )}
          </Button>
          <Button
            type="button"
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
