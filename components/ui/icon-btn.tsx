import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type IconBtnProps = ComponentProps<typeof Button> & {
  icon: ReactNode;
  loading?: boolean;
  loadingLabel?: string;
};

const IconBtn = ({
  icon,
  loading = false,
  loadingLabel = "در حال بارگذاری",
  disabled,
  className,
  ...props
}: IconBtnProps) => {
  return (
    <Button
      {...props}
      variant={"unstyled"}
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(
        "rounded-full touch-manipulation p-0 bg-transparent transition-transform duration-100 ease-in-out select-none tap-highlight-transparent outline-none hover:scale-[1.07] active:scale-[0.95] focus:outline-none",
        className,
      )}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" />
          <span className="sr-only">{loadingLabel}</span>
        </>
      ) : (
        icon
      )}
    </Button>
  );
};

export default IconBtn;
