"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export type PhoneAuthStep = "phone" | "otp" | "password";

export const RESEND_DELAY_SECONDS = 60;

export const useSignUpForm = (onSuccess?: () => void) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [step, setStep] = useState<PhoneAuthStep>("phone");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleChangePhone = () => {
    setServerError(null);
    setLoading(false);
    setStep("phone");
  };

  const handleCompleteFlow = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      router.push(callbackUrl);
    }
  };

  const skipPassword = () => {
    handleCompleteFlow();
  };

  const requestOtp = async (phoneValue: string) => {
    setServerError(null);
    setLoading(true);
    setPhone(phoneValue);

    try {
      const { error } = await authClient.phoneNumber.sendOtp({
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
  };

  const verifyOtp = async (otpValue: string) => {
    setServerError(null);
    setLoading(true);

    try {
      const { error } = await authClient.phoneNumber.verify({
        phoneNumber: phone,
        code: otpValue,
      });

      if (error) {
        setServerError(error.message || "کد وارد شده اشتباه یا منقضی است.");
        return;
      }

      const { data: accounts, error: accountsError } = await authClient.listAccounts();

      if (accountsError) {
        setServerError(accountsError.message || "خطا در بررسی وضعیت حساب.");
        return;
      }

      const hasPassword = accounts?.some((account) => account.providerId === "credential");

      if (hasPassword) {
        handleCompleteFlow();
      } else {
        setStep("password");
      }
    } catch (err: any) {
      setServerError(err?.message || "خطا در تایید کد.");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setServerError(null);
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
  };

  const submitPassword = async (password: string) => {
    setServerError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: password }),
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
  };

  return {
    step,
    phone,
    loading,
    serverError,
    requestOtp,
    verifyOtp,
    resendOtp,
    submitPassword,
    skipPassword,
    handleChangePhone,
  };
};
