"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export const useSignInForm = (onSuccess?: () => void) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleCompleteFlow = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      router.push(callbackUrl);
    }
  };

  const signIn = async (phone: string, password: string) => {
    setServerError(null);
    setLoading(true);

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
  };

  return {
    loading,
    serverError,
    signIn,
  };
};
