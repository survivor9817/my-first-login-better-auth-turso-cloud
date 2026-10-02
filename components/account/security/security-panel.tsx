"use client";
import ChangePasswordForm from "@/components/auth/change-password/change-password-form";
import { ActiveSessions } from "./active-sessions";

export function SecurityPanel() {
  return (
    <div className="flex flex-col gap-8 justify-center items-center">
      <ActiveSessions />
      <ChangePasswordForm />
    </div>
  );
}
