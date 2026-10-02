"use client";

import { useState, useEffect, useMemo, ChangeEvent, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { BaseUIEvent } from "@base-ui/react";
import { Label } from "@/components/ui/label";
import ErrorFallback from "@/components/error-fallback";

type AsyncFloatingComboboxProps<T> = {
  items: T[];
  value: T | null;
  onValueChange: (item: T | null) => void;
  getLabel: (item: T) => string;
  getKey: (item: T) => string | number;
  label: string;
  emptyMessage?: string;
  className?: string;
  error?: unknown;
  onRetry: () => void; // چون این کامپوننت ذاتاً برای دیتای async هست، همیشه اجباریه
  errorMessage?: string;
};

// نسخه‌ی مخصوص دیتای ناهمزمان: با نمایش فالبک خطا داخل content هنگام fetch ناموفق
function AsyncFloatingCombobox<T>({
  items,
  value,
  onValueChange,
  getLabel,
  getKey,
  label,
  emptyMessage = "موردی پیدا نشد",
  className,
  error,
  onRetry,
  errorMessage = "خطا در بارگذاری گزینه‌ها",
}: AsyncFloatingComboboxProps<T>) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [localValue, setLocalValue] = useState<T | null>(value);
  const comboboxInputValue = open ? inputValue : localValue ? getLabel(localValue) : "";
  const hasValue = Boolean(localValue);
  const isFloating = hasValue || open || inputValue.length > 0;

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (open) {
      setInputValue(localValue ? getLabel(localValue) : "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, localValue]);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!inputRef.current) return;
    if (open) {
      const raf1 = requestAnimationFrame(() => {
        inputRef.current?.select();
      });
      return () => cancelAnimationFrame(raf1);
    }
  }, [open]);

  const filteredItems = useMemo(() => {
    if (!inputValue || inputValue === (localValue ? getLabel(localValue) : "")) return items;
    return items.filter((item) => getLabel(item).toLowerCase().includes(inputValue.toLowerCase()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, inputValue, localValue]);

  const onInputChange = (e: BaseUIEvent<ChangeEvent<HTMLInputElement, HTMLInputElement>>) => {
    if (!open) setOpen(true);
    setInputValue(e.target.value);
  };

  const handleSelect = (newItem: T | null) => {
    if (!newItem) return;
    setLocalValue(newItem);
    if (!localValue || getKey(newItem) !== getKey(localValue)) {
      onValueChange(newItem);
    }
    setOpen(false);
    setInputValue("");
  };

  return (
    <div
      className={cn("relative mt-10 w-full max-w-80", className)}
      onMouseDown={(e) => {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT") {
          return;
        }
        if (inputRef.current) {
          e.preventDefault();
          inputRef.current.focus();
          setOpen(true);
        }
      }}
    >
      <Combobox
        items={filteredItems}
        value={localValue}
        isItemEqualToValue={(item: T | null, val: T | null) =>
          !!item && !!val && getKey(item) === getKey(val)
        }
        open={open}
        onOpenChange={setOpen}
        onValueChange={handleSelect}
        autoHighlight
      >
        <Label
          className={cn(
            "pointer-events-none absolute z-10 px-2",
            "top-0 right-4 transition-transform duration-200 ease-out",
            "font-bold",
            isFloating
              ? "-translate-y-2 text-xs scale-90 bg-background"
              : "translate-y-3 text-base scale-100",
          )}
        >
          {label}
        </Label>

        <ComboboxInput
          ref={inputRef}
          value={comboboxInputValue}
          onChange={onInputChange}
          placeholder={isFloating ? "انتخاب کنید." : ""}
          className={cn(
            "h-11.5 w-full border-2 border-[rgb(200,200,200)] bg-background ",
            "px-3 text-center text-base font-black cursor-pointer",
            "focus-visible:ring-0 focus-visible:ring-offset-0",
          )}
        />

        <ComboboxContent className="w-(--anchor-width) p-0 ">
          {error ? (
            <div className="p-2">
              <ErrorFallback onRefetch={onRetry} ErrorMsg={errorMessage} />
            </div>
          ) : (
            <ComboboxList>
              <ComboboxEmpty className="p-2 text-center text-sm font-bold text-gray-500">
                {inputValue ? `هیچ موردی با "${inputValue}" پیدا نشد` : emptyMessage}
              </ComboboxEmpty>

              {filteredItems.map((item) => (
                <ComboboxItem
                  key={getKey(item)}
                  value={item}
                  className="justify-center font-bold cursor-pointer"
                >
                  {getLabel(item)}
                </ComboboxItem>
              ))}
            </ComboboxList>
          )}
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

export default AsyncFloatingCombobox;
