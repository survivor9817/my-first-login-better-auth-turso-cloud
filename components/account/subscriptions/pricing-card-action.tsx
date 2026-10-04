import { ArrowUpRight, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingCardActionProps {
  isCurrentPlan: boolean;
  hasBadge?: boolean;
  isFree: boolean;
  isAdmin?: boolean;
  onSelect: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PricingCardAction({
  isCurrentPlan,
  hasBadge,
  isFree,
  isAdmin = false,
  onSelect,
  onEdit,
  onDelete,
}: PricingCardActionProps) {
  return (
    <div className="p-4 border-t bg-muted/5 mt-auto flex items-center gap-2">
      {isCurrentPlan ? (
        <Button
          disabled
          variant="outline"
          className="flex-1 gap-1.5 shadow-none opacity-80 cursor-not-allowed"
          size="default"
        >
          پلن فعال فعلی شما
        </Button>
      ) : (
        <Button
          onClick={onSelect}
          variant={hasBadge ? "default" : "outline"}
          className="flex-1 gap-1.5 shadow-none"
          size="default"
        >
          {isFree ? "فعال‌سازی پلن پایه" : "انتخاب و ارتقا"}
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      )}

      {isAdmin && (
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onEdit}
            title="ویرایش اشتراک"
            className="h-9 w-9 text-muted-foreground hover:text-foreground shadow-none"
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onDelete}
            title="حذف اشتراک"
            className="h-9 w-9 text-muted-foreground hover:text-destructive hover:border-destructive/30 shadow-none"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
