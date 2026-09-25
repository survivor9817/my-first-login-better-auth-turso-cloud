"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// import { authClient } from "@/lib/auth-client"; // مطمئن شوید phoneNumberClient به کلاینت اضافه شده باشد

export type PhoneAuthStep = "phone" | "otp" | "password";

export const RESEND_DELAY_SECONDS = 60;

/**
 * منطق مشترک فلوی احراز هویت با شماره تلفن:
 * مرحله ۱) ارسال OTP
 * مرحله ۲) تایید OTP و تشخیص وضعیت کاربر (کاربر جدید است یا قدیمی)
 * مرحله ۳) ست/تغییر رمز عبور یا رد شدن از آن با حفظ نشست لاگین
 */
export function usePhoneAuthFlow(onSuccess?: () => void) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [step, setStep] = useState<PhoneAuthStep>("phone");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // وضعیت کاربر: آیا کاربر تازه ثبت‌نام کرده (true) یا از قبل اکانت داشته (false)
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);

  // --- بازگشت به مرحله شماره تلفن و پاک‌سازی وضعیت‌ها ---
  function handleChangePhone() {
    setServerError(null);
    setLoading(false);
    setIsNewUser(null);
    setStep("phone");
  }

  // --- هدایت کاربر به صفحه نهایی (پس از ثبت رمز یا رد شدن) ---
  function handleCompleteFlow() {
    if (onSuccess) {
      onSuccess();
    } else {
      router.push(callbackUrl);
    }
  }

  // --- رد شدن از مرحله رمز عبور (ورود مستقیم به حساب با OTP) ---
  function skipPassword() {
    handleCompleteFlow();
  }

  // --- مرحله ۱: ارسال کد تایید ---
  async function requestOtp(phoneValue: string) {
    setServerError(null);
    setLoading(true);
    setPhone(phoneValue);

    // --- شبیه‌سازی تستی فرانت‌اند ---
    console.log("OTP ارسال شد برای:", phoneValue);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);
    setStep("otp");

    /*
    // --- پیاده‌سازی واقعی با Better Auth ---
    try {
      const { data, error } = await authClient.phoneNumber.sendOtp({
        phoneNumber: phoneValue,
      });

      if (error) {
        setServerError(error.message || "خطا در ارسال کد تایید.");
        return;
      }

      setStep("otp");
    } catch (err: any) {
      setServerError(err?.message || "خطای ارتباط با سرور رخ داد.");
    } finally {
      setLoading(false);
    }
    */
  }

  // --- مرحله ۲: تایید OTP و بررسی زمان ساخت کاربر ---
  async function verifyOtp(otpValue: string) {
    setServerError(null);
    setLoading(true);

    // --- شبیه‌سازی تستی فرانت‌اند ---
    console.log("کد تایید شد:", otpValue);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // شبیه‌سازی: مثلاً کاربر جدید تشخیص داده شد (یا برای تست false بگذارید)
    setIsNewUser(true);
    setLoading(false);
    setStep("password");

    /*
    // --- پیاده‌سازی واقعی با Better Auth ---
    try {
      const { data, error } = await authClient.phoneNumber.verify({
        phoneNumber: phone,
        code: otpValue, // کلید پارامتر در Better Auth الزاماً code است
      });

      if (error) {
        setServerError(error.message || "کد وارد شده اشتباه یا منقضی است.");
        return;
      }

      // تشخیص نوپا بودن کاربر:
      // اگر اختلاف زمان ایجاد اکانت (createdAt) با زمان حال کمتر از ۱۵ ثانیه باشد،
      // یعنی کاربر در همین لحظه ایجاد شده و کاربر جدید (ثبت‌نامی) است.
      if (data?.user?.createdAt) {
        const createdAtTime = new Date(data.user.createdAt).getTime();
        const now = Date.now();
        const newlyCreated = now - createdAtTime < 15_000;
        setIsNewUser(newlyCreated);
      } else {
        setIsNewUser(false);
      }

      setStep("password");
    } catch (err: any) {
      setServerError(err?.message || "خطا در تایید کد.");
    } finally {
      setLoading(false);
    }
    */
  }

  // --- ارسال مجدد کد ---
  async function resendOtp() {
    setServerError(null);
    console.log("درخواست ارسال مجدد کد برای:", phone);

    /*
    // --- پیاده‌سازی واقعی با Better Auth ---
    try {
      const { error } = await authClient.phoneNumber.sendOtp({
        phoneNumber: phone,
      });
      if (error) {
        setServerError(error.message || "خطا در ارسال مجدد کد.");
      }
    } catch (err: any) {
      setServerError(err?.message || "خطای ارتباط با سرور.");
    }
    */
  }

  // --- مرحله ۳: ست/تغییر رمز عبور برای کاربر سشن‌دار جاری ---
  async function submitPassword(password: string) {
    setServerError(null);
    setLoading(true);

    // --- شبیه‌سازی تستی فرانت‌اند ---
    console.log("رمز عبور ثبت شد:", password);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);
    handleCompleteFlow();

    /*
    // --- پیاده‌سازی واقعی با Better Auth ---
    try {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setServerError(errData.message || "خطا در تنظیم رمز عبور.");
        return;
      }

      handleCompleteFlow();
    } catch (err: any) {
      setServerError(err?.message || "خطا در ارتباط با سرور.");
    } finally {
      setLoading(false);
    }
    */
  }

  return {
    step,
    phone,
    loading,
    serverError,
    isNewUser, // 👈 مقدار true برای ثبت‌نامی و false برای کاربر قبلی
    requestOtp,
    verifyOtp,
    resendOtp,
    submitPassword,
    skipPassword, // 👈 متد رد شدن از مرحله پسورد
    handleChangePhone,
  };
}
