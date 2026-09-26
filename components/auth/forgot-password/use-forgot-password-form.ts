// use-forgot-password-flow.ts
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export type ForgotPasswordStep = "phone" | "otp" | "password";

export const RESEND_DELAY_SECONDS = 60;

export function useForgotPasswordForm(onSuccess?: () => void) {
  const router = useRouter();

  const [step, setStep] = useState<ForgotPasswordStep>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function handleChangePhone() {
    setServerError(null);
    setLoading(false);
    setOtp("");
    setStep("phone");
  }

  function handleCompleteFlow() {
    if (onSuccess) {
      onSuccess();
    } else {
      router.push("/login");
    }
  }

  // مرحله ۱: ارسال کد بازیابی رمز
  async function requestOtp(phoneValue: string) {
    setServerError(null);
    setLoading(true);
    setPhone(phoneValue);

    try {
      const { error } = await authClient.phoneNumber.requestPasswordReset({
        phoneNumber: phoneValue,
      });

      if (error) {
        setServerError(error.message || "خطا در ارسال کد بازیابی.");
        return;
      }

      setStep("otp");
    } catch (err: any) {
      setServerError(err?.message || "خطای ارتباط با سرور رخ داد.");
    } finally {
      setLoading(false);
    }
  }

  // مرحله ۲: در این پلاگین اعتبارسنجی مستقل OTP برای ریست رمز وجود ندارد؛
  // کد فقط محلی ذخیره می‌شود و اعتبارسنجی‌اش همراه رمز جدید در resetPassword انجام می‌شود
  async function verifyOtp(otpValue: string) {
    setServerError(null);
    setOtp(otpValue);
    setStep("password");
  }

  async function resendOtp() {
    setServerError(null);
    try {
      const { error } = await authClient.phoneNumber.requestPasswordReset({
        phoneNumber: phone,
      });
      if (error) {
        setServerError(error.message || "خطا در ارسال مجدد کد.");
      }
    } catch (err: any) {
      setServerError(err?.message || "خطای ارتباط با سرور.");
    }
  }

  // مرحله ۳: تعیین رمز جدید (شامل اعتبارسنجی واقعی OTP)
  async function submitPassword(newPassword: string) {
    setServerError(null);
    setLoading(true);

    try {
      const { error } = await authClient.phoneNumber.resetPassword({
        phoneNumber: phone,
        otp,
        newPassword,
      });

      if (error) {
        setServerError(error.message || "کد وارد شده اشتباه یا منقضی است. دوباره تلاش کنید.");
        setStep("otp"); // چون otp نامعتبر بود، برگرد به مرحله‌ی OTP
        return;
      }

      handleCompleteFlow();
    } catch (err: any) {
      setServerError(err?.message || "خطا در تنظیم رمز عبور.");
    } finally {
      setLoading(false);
    }
  }

  return {
    step,
    phone,
    loading,
    serverError,
    requestOtp,
    verifyOtp,
    resendOtp,
    submitPassword,
    handleChangePhone,
  };
}
