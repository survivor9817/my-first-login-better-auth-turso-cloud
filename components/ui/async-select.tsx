// components/ui/async-select.tsx
import { ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ErrorFallback from "@/components/error-fallback";
import { cn } from "@/lib/utils";

export type AsyncSelectOption = {
  value: string;
  label: string;
};

type AsyncSelectProps<TOption extends AsyncSelectOption> = {
  name?: string;
  value: string;
  options: TOption[] | undefined | null;
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
  //   onValueChange: (value: string) => void;
  onValueChange: (value: string | null) => void;
  triggerRef?: React.Ref<HTMLButtonElement>;
  loadingMessage?: string;
  emptyMessage?: string;
  errorMessage?: string;
  placeholder?: string;
  className?: string;
  contentClassName?: string;
  disabled?: boolean;
  renderOption?: (option: TOption) => ReactNode;
};

export function AsyncSelect<TOption extends AsyncSelectOption>({
  name,
  value,
  options,
  isLoading,
  error,
  onRetry,
  onValueChange,
  triggerRef,
  loadingMessage = "در حال بارگذاری...",
  emptyMessage = "گزینه‌ای موجود نیست",
  errorMessage = "خطا در بارگذاری گزینه‌ها",
  placeholder = "",
  className,
  contentClassName,
  disabled,
  renderOption,
}: AsyncSelectProps<TOption>) {
  return (
    <Select
      name={name}
      value={value}
      items={options ?? []}
      onValueChange={(value) => onValueChange(value)}
      disabled={disabled}
    >
      <SelectTrigger
        ref={triggerRef}
        className={cn(
          "w-full h-13 min-h-13 bg-white rounded-lg border-2 border-[rgb(200,200,200)] text-right",
          "justify-between font-bold text-[16px] cursor-pointer data-[disabled]:bg-[#f5f5f5] data-[disabled]:cursor-wait",
          "data-[force-focus=true]:border-ring data-[force-focus=true]:ring-3 data-[force-focus=true]:ring-ring/30",
          className,
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent className={cn("z-[9999]", contentClassName)} alignItemWithTrigger={false}>
        {isLoading ? (
          <div className="p-2 my-2 text-sm text-muted-foreground text-center">{loadingMessage}</div>
        ) : error ? (
          <div className="p-2">
            <ErrorFallback onRefetch={onRetry} ErrorMsg={errorMessage} />
          </div>
        ) : options && options.length > 0 ? (
          options.map((option) =>
            renderOption ? (
              renderOption(option)
            ) : (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ),
          )
        ) : (
          <div className="p-2 text-sm text-muted-foreground text-right">{emptyMessage}</div>
        )}
      </SelectContent>
    </Select>
  );
}
