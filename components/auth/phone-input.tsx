import * as React from "react";
import { PhoneIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface PhoneInputProps extends Omit<
  React.ComponentProps<typeof Input>,
  "type" | "dir" | "inputMode"
> {
  ref?: React.Ref<HTMLInputElement>;
}

function PhoneInput({ className, ref, ...props }: PhoneInputProps) {
  return (
    <div className="relative">
      <PhoneIcon
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        ref={ref}
        type="tel"
        dir="rtl"
        inputMode="numeric" // or tel?
        autoComplete="tel"
        className={cn("pr-10", className)}
        {...props}
      />
    </div>
  );
}

export { PhoneInput };
