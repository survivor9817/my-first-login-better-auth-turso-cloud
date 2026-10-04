import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planName?: string;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  planName,
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      className="rounded-2xl sm:max-w-[400px]"
      title={
        <div className="flex items-start gap-3 text-start" dir="rtl">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive mt-0.5">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-base font-bold text-foreground">تأیید حذف اشتراک</span>
            <span className="text-xs font-normal text-muted-foreground">
              این عملیات قابل بازگشت نخواهد بود.
            </span>
          </div>
        </div>
      }
      description=""
    >
      <div className="space-y-4 pt-2 text-xs" dir="rtl">
        <p className="text-muted-foreground leading-relaxed">
          آیا از حذف اشتراک{" "}
          <strong className="text-foreground font-semibold">«{planName}»</strong> اطمینان
          دارید؟ با حذف این مورد، کاربران دیگر قادر به انتخاب آن نخواهند بود.
        </p>

        <div className="pt-2 flex items-center justify-end gap-2 border-t border-border/40">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs shadow-none"
          >
            انصراف
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="text-xs shadow-none gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>حذف اشتراک</span>
          </Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
}
