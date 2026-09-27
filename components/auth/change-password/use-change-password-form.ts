// use-change-password-form.ts
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import type { ChangePasswordValues } from "../schemas";

export const useChangePasswordForm = (onSuccess?: () => void) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      router.push("/profile");
    }
  };

  const changePassword = async (values: ChangePasswordValues) => {
    setServerError(null);
    setLoading(true);

    try {
      const { error } = await authClient.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        revokeOtherSessions: values.revokeOtherSessions,
      });

      if (error) {
        setServerError(error.message || "رمز عبور فعلی اشتباه است یا عملیات ناموفق بود.");
        return;
      }

      handleSuccess();
    } catch (err: any) {
      setServerError(err?.message || "خطای ارتباط با سرور رخ داد.");
    } finally {
      setLoading(false);
    }
  };

  const resetError = () => setServerError(null);

  return {
    loading,
    serverError,
    changePassword,
    resetError,
  };
};
