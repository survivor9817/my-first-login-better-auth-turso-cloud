"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

import { otpSchema, type OtpValues } from "./schemas";
import { useCountdown } from "@/hooks/use-countdown";

interface OtpStepProps {
  phone: string;
  resendDelay: number;
  loading: boolean;
  serverError: string | null;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  onChangePhone: () => void;
}

function OtpStep({
  phone,
  resendDelay,
  loading,
  serverError,
  onVerify,
  onResend,
  onChangePhone,
}: OtpStepProps) {
  const [timeLeft, { startCountdown, resetCountdown }] = useCountdown({
    countStart: resendDelay,
    countStop: 0,
    intervalMs: 1000,
  });

  const { control, handleSubmit } = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  React.useEffect(() => {
    startCountdown();
  }, [startCountdown]);

  const handleResend = async () => {
    if (timeLeft > 0) return;
    await onResend();
    resetCountdown();
    startCountdown();
  };

  return (
    <form onSubmit={handleSubmit((values) => onVerify(values.otp))}>
      <FieldGroup className="gap-4">
        <FieldContent className="flex justify-center items-center">
          <FieldTitle className="text-2xl font-bold">تأیید شماره موبایل</FieldTitle>
          <FieldDescription>کد ۶ رقمی ارسال شده به {phone} را وارد کنید.</FieldDescription>
        </FieldContent>

        <Controller
          name="otp"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="w-fit mx-auto">
              <FieldLabel htmlFor="otp" className="sr-only">
                کد تایید
              </FieldLabel>
              <InputOTP
                id="otp"
                maxLength={6}
                value={field.value}
                onChange={field.onChange}
                aria-invalid={fieldState.invalid}
                autoFocus
                autoComplete="off"
              >
                <InputOTPGroup dir="ltr">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {serverError && (
          <FieldError role="alert" errors={[{ message: serverError }]} className="text-center" />
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "در حال بررسی..." : "ثبت کد تأیید"}
        </Button>

        <div className="text-center text-sm space-y-2">
          {timeLeft > 0 ? (
            <span className="text-muted-foreground block">
              ارسال دوباره تا {timeLeft} ثانیه دیگر
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              className="text-primary font-bold underline underline-offset-2 block mx-auto"
            >
              ارسال مجدد کد
            </button>
          )}

          <p className="text-muted-foreground mt-4">
            شماره رو اشتباه وارد کردی؟{" "}
            <button
              type="button"
              onClick={onChangePhone}
              className="text-primary font-bold underline underline-offset-2"
            >
              ویرایش شماره
            </button>
          </p>
        </div>
      </FieldGroup>
    </form>
  );
}

export default OtpStep;
