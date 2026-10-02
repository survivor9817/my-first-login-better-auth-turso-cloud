"use client";

import { useMemo, useState } from "react";
import { Laptop, Smartphone, ShieldAlert, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RevokeSessionDialog } from "./revoke-session-dialog";
import { ProfileStatusBadge } from "../profile/profile-item";

// ------------------------------------------------------------------
// نمونه فراخوانی واقعی با Better Auth:
// import { authClient } from "@/lib/auth-client";
//
// const { data: sessionData } = authClient.useSession();
// const { data: sessions, refetch } = authClient.useListSessions();
//
// const handleRevoke = async (token: string) => {
//   await authClient.revokeSession({ token });
//   refetch();
// };
// ------------------------------------------------------------------

// ساختار اصلی دیتای نشست در Better Auth
export interface BetterAuthSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

// دیتای ماک با User-Agentهای واقعی مرورگرها
const MOCK_BETTER_AUTH_SESSIONS: BetterAuthSession[] = [
  {
    id: "sess_01j9a8b1c2d3e4f5g6h7j8k9m0",
    userId: "user_01j9a8112233445566778899aa",
    token: "current_active_token_xyz_123",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // ۲ ساعت پیش
    updatedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    ipAddress: "5.218.42.19",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  },
  {
    id: "sess_01j9a8b1c2d3e4f5g6h7j8k9m1",
    userId: "user_01j9a8112233445566778899aa",
    token: "token_mobile_safari_456",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // ۳ روز پیش
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toISOString(),
    ipAddress: "2.147.112.5",
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1",
  },
  {
    id: "sess_01j9a8b1c2d3e4f5g6h7j8k9m2",
    userId: "user_01j9a8112233445566778899aa",
    token: "token_android_firefox_789",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1).toISOString(),
    ipAddress: "185.190.22.9",
    userAgent: "Mozilla/5.0 (Android 14; Mobile; rv:132.0) Gecko/132.0 Firefox/132.0",
  },
];

// تابع پارس‌کننده رشته UserAgent خام برای تشخیص دستگاه و مرورگر
function parseUserAgent(userAgent?: string | null) {
  if (!userAgent) {
    return {
      browser: "دستگاه نامشخص",
      os: "سیستم‌عامل نامشخص",
      isMobile: false,
    };
  }

  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent);

  let browser = "مرورگر وب";
  if (/Edg/i.test(userAgent)) browser = "مایکروسافت اج";
  else if (/Chrome/i.test(userAgent) && !/Edg/i.test(userAgent)) browser = "گوگل کروم";
  else if (/Firefox/i.test(userAgent)) browser = "فایرفاکس";
  else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) browser = "سافاری";

  let os = "نامشخص";
  if (/Windows/i.test(userAgent)) os = "ویندوز";
  else if (/iPhone|iPad|iPod/i.test(userAgent)) os = "iOS";
  else if (/Android/i.test(userAgent)) os = "اندروید";
  else if (/Mac OS/i.test(userAgent)) os = "macOS";
  else if (/Linux/i.test(userAgent)) os = "لینوکس";

  return { browser, os, isMobile };
}

// فرمت‌دهی ساده زمان
function formatRelativeTime(dateString: string | Date) {
  const diffInHours = Math.floor((Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) return "هم‌اکنون فعال";
  if (diffInHours < 24) return `${diffInHours} ساعت پیش`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} روز پیش`;
}

export function ActiveSessions() {
  const [sessions, setSessions] = useState<BetterAuthSession[]>(MOCK_BETTER_AUTH_SESSIONS);
  const [selectedSession, setSelectedSession] = useState<BetterAuthSession | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);

  // توکن نشست فعلی (در حالت واقعی از useSession گرفته می‌شود)
  const currentToken = "current_active_token_xyz_123";

  const handleConfirmRevoke = async () => {
    if (!selectedSession) return;
    setIsRevoking(true);

    // شبیه‌سازی فراخوانی بترعاث:
    // await authClient.revokeSession({ token: selectedSession.token });
    await new Promise((res) => setTimeout(res, 600));

    setSessions((prev) => prev.filter((s) => s.id !== selectedSession.id));
    setIsRevoking(false);
    setDialogOpen(false);
    setSelectedSession(null);
  };

  const selectedDeviceInfo = useMemo(() => {
    if (!selectedSession) return "این دستگاه";
    const { browser, os } = parseUserAgent(selectedSession.userAgent);
    return `${browser} در ${os}`;
  }, [selectedSession]);

  return (
    <div className="mx-auto w-full max-w-md space-y-4" dir="rtl">
      <Card className="rounded-2xl border-border/80 shadow-sm overflow-hidden !py-0 gap-0">
        <CardHeader className="flex flex-row items-center justify-between !py-3.5 px-4 border-b bg-muted/20 space-y-0">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-bold text-foreground">نشست‌های فعال</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="!p-0 !pt-0">
          <div className="divide-y divide-border">
            {sessions.map((session) => {
              const { browser, os, isMobile } = parseUserAgent(session.userAgent);
              const DeviceIcon = isMobile ? Smartphone : Laptop;
              const isCurrent = session.token === currentToken;

              return (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-muted/30"
                >
                  {/* راست: آیکون دستگاه + اطلاعات مرورگر، سیستم‌عامل، IP و زمان */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground">
                      <DeviceIcon className="h-4 w-4" />
                    </div>

                    <div className="flex flex-col items-start gap-1">
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground/90">
                        <span>{browser}</span>
                        <span className="text-xs font-normal text-muted-foreground">({os})</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span dir="ltr">{session.ipAddress || "آی‌پی ثبت‌نشده"}</span>
                        <span>•</span>
                        <span>{formatRelativeTime(session.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* چپ: برچسب وضعیت نشست فعلی یا دکمه خاتمه نشست‌های دیگر */}
                  <div className="flex items-center gap-2">
                    {isCurrent ? (
                      <ProfileStatusBadge className="bg-emerald-50 text-emerald-700">
                        این دستگاه
                      </ProfileStatusBadge>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSession(session);
                          setDialogOpen(true);
                        }}
                        className="h-8 gap-1.5 px-3 text-xs shadow-none text-destructive hover:text-destructive hover:bg-destructive/10 border-border"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        خاتمه
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <RevokeSessionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        isLoading={isRevoking}
        deviceName={selectedDeviceInfo}
        onConfirm={handleConfirmRevoke}
      />
    </div>
  );
}
