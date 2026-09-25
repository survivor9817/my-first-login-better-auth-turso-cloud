"use client";

import * as React from "react";
import { LockIcon, EyeIcon, EyeOffIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface PasswordInputProps extends Omit<React.ComponentProps<typeof Input>, "type"> {
  ref?: React.Ref<HTMLInputElement>;
}

function PasswordInput({ className, ref, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative">
      <LockIcon
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        ref={ref}
        type={showPassword ? "text" : "password"}
        dir="rtl"
        className={cn("px-10", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        aria-label={showPassword ? "پنهان کردن رمز" : "نمایش رمز"}
        aria-pressed={showPassword}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-sm text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {showPassword ? (
          <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
        ) : (
          <EyeIcon className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

export { PasswordInput };
