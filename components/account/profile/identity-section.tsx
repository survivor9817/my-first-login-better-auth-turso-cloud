"use client";

import { useState } from "react";
import { Pencil, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { EditIdentityDialog, IdentityFormValues } from "./edit-identity-dialog";
import { ProfileItemGroup, ProfileItem, ProfileStatusBadge } from "./profile-item";

export function IdentitySection() {
  const [identityOpen, setIdentityOpen] = useState(false);

  const [identity, setIdentity] = useState<IdentityFormValues & { isVerified: boolean }>({
    firstName: "رضا",
    lastName: "قزلسفلو",
    nationalCode: "۲۱۱۰۰۱۴۲۹۸",
    birthDate: "۱۳۷۶/۰۴/۱۸",
    isVerified: true,
  });

  const handleUpdateIdentity = async (values: IdentityFormValues) => {
    await new Promise((res) => setTimeout(res, 600));
    setIdentity((prev) => ({ ...prev, ...values }));
  };

  return (
    <>
      <Card className="rounded-2xl border-border/80 shadow-sm overflow-hidden py-0 gap-0" dir="rtl">
        <CardHeader className="flex flex-row items-center justify-between py-3.5! px-4 border-b bg-muted/20 space-y-0">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-bold text-foreground">اطلاعات شناسایی</CardTitle>
            {identity.isVerified && <ProfileStatusBadge>تایید شده</ProfileStatusBadge>}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIdentityOpen(true)}
            className="h-8 gap-1.5 px-3 text-xs shadow-none hover:bg-muted"
          >
            <Pencil className="h-3.5 w-3.5" />
            ویرایش
          </Button>
        </CardHeader>

        <CardContent className="p-0! pt-0!">
          <ProfileItemGroup>
            <ProfileItem label="نام" value={identity.firstName} />
            <ProfileItem label="نام خانوادگی" value={identity.lastName} />
            <ProfileItem label="کد ملی" value={identity.nationalCode} />
            <ProfileItem label="تاریخ تولد" value={identity.birthDate} />
          </ProfileItemGroup>
        </CardContent>
      </Card>

      <EditIdentityDialog
        open={identityOpen}
        onOpenChange={setIdentityOpen}
        defaultValues={identity}
        onSubmit={handleUpdateIdentity}
      />
    </>
  );
}
