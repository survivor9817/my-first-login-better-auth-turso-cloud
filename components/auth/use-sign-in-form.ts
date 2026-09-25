"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// import { authClient } from "@/lib/auth-client"; // مطمئن شوید phoneNumberClient به کلاینت اضافه شده باشد

/**
 * منطق فرم ورود با شماره تلفن و رمز عبور
 */
export function useSignInForm(onSuccess?: () => void) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // --- هدایت کاربر به صفحه نهایی پس از ورود موفق ---
  function handleCompleteFlow() {
    if (onSuccess) {
      onSuccess();
    } else {
      router.push(callbackUrl);
    }
  }

  // --- ورود با شماره تلفن و رمز عبور ---
  async function signIn(phone: string, password: string) {
    setServerError(null);
    setLoading(true);

    // --- شبیه‌سازی تستی فرانت‌اند ---
    console.log("ورود با:", phone, password);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);
    handleCompleteFlow();

    /*
    // --- پیاده‌سازی واقعی با Better Auth ---
    try {
      const { data, error } = await authClient.signIn.phoneNumber({
        phoneNumber: phone,
        password,
      });

      if (error) {
        setServerError(error.message || "شماره موبایل یا رمز عبور اشتباه است.");
        return;
      }

      handleCompleteFlow();
    } catch (err: any) {
      setServerError(err?.message || "خطای ارتباط با سرور رخ داد.");
    } finally {
      setLoading(false);
    }
    */
  }

  return {
    loading,
    serverError,
    signIn,
  };
}
