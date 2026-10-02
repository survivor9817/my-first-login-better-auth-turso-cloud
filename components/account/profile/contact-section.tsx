"use client";

import { useState } from "react";
import { PhoneCall } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { EditPhoneDialog } from "./edit-phone-dialog";
import { EditEmailDialog } from "./edit-email-dialog";
import { ProfileItemGroup, ProfileContactItem } from "./profile-item";

export function ContactSection() {
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);

  const [contact, setContact] = useState({
    phone: "۰۹۰۱۰۰۳۲۵۲۶",
    email: "rezaghezelsofloo@gmail.com",
    isPhoneVerified: true,
    isEmailVerified: true,
  });

  const handleSendPhoneOtp = async (phone: string) => {
    await new Promise((res) => setTimeout(res, 600));
    setContact((prev) => ({ ...prev, phone }));
  };

  const handleSendEmailOtp = async (email: string) => {
    await new Promise((res) => setTimeout(res, 600));
    setContact((prev) => ({ ...prev, email }));
  };

  return (
    <>
      <Card className="rounded-2xl border-border/80 shadow-sm overflow-hidden gap-0 py-0" dir="rtl">
        <CardHeader className="flex flex-row items-center justify-between py-3.5! px-4 border-b bg-muted/20 space-y-0">
          <div className="flex items-center gap-3">
            <PhoneCall className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-bold text-foreground">اطلاعات تماس</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-0! pt-0!">
          <ProfileItemGroup>
            <ProfileContactItem
              label="شماره موبایل"
              value={contact.phone}
              isVerified={contact.isPhoneVerified}
              onEdit={() => setPhoneOpen(true)}
            />
            <ProfileContactItem
              label="ایمیل"
              value={contact.email}
              isVerified={contact.isEmailVerified}
              onEdit={() => setEmailOpen(true)}
            />
          </ProfileItemGroup>
        </CardContent>
      </Card>

      <EditPhoneDialog
        open={phoneOpen}
        onOpenChange={setPhoneOpen}
        defaultValue={contact.phone}
        onSendOtp={handleSendPhoneOtp}
      />

      <EditEmailDialog
        open={emailOpen}
        onOpenChange={setEmailOpen}
        defaultValue={contact.email}
        onSendOtp={handleSendEmailOtp}
      />
    </>
  );
}
