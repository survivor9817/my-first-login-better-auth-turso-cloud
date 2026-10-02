"use client";

import { useState } from "react";
import Link from "next/link";
import { LogOut, GraduationCap, Pencil, User as UserIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
// import { authClient } from "@/lib/auth-client";
import { LogoutConfirmDialog } from "./logout-confirm-dialog";

export interface UserCardProps {
  className?: string;
  editProfileHref?: string;
  onLogoutSuccess?: () => void;
}

const MOCK_USER = {
  name: "رضا قزلسفلو",
  role: "معلم مدرسه",
  avatarUrl: "/imgs/reza.jpg",
};

function getInitials(name?: string): string {
  if (!name || !name.trim()) return "م";

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].charAt(0);
  }

  return `${parts[0].charAt(0)}${parts[1].charAt(0)}`;
}

export function UserCard({
  className,
  editProfileHref = "/profile/edit",
  onLogoutSuccess,
}: UserCardProps) {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                      کد اصلی دریافت سشن از Better Auth                     */
  /* -------------------------------------------------------------------------- */
  /*
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user
    ? {
        name: session.user.name || "کاربر مهمان",
        role: (session.user as any).role || "تازه‌وارد",
        avatarUrl: session.user.image ?? undefined,
      }
    : null;

  if (isPending) {
    return (
      <div className={cn("flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card p-6", className)}>
        <Skeleton className="h-20 w-20 rounded-full" />
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-16 rounded-full" />
      </div>
    );
  }
  */

  const user = MOCK_USER;

  const displayName = user?.name || "کاربر مهمان";
  const displayRole = user?.role || "تازه‌وارد";
  const initials = getInitials(displayName);

  const handleConfirmLogout = async () => {
    setIsLoading(true);
    try {
      /*
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            setIsLogoutOpen(false);
            onLogoutSuccess?.();
            window.location.href = "/login";
          },
        },
      });
      */
      await new Promise((resolve) => setTimeout(resolve, 600));
      setIsLogoutOpen(false);
      onLogoutSuccess?.();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-border/60 bg-card p-4",
          className,
        )}
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--muted-foreground) / 0.16) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      >
        {/* دکمه خروج در گوشه سمت چپ (در چیدمان راست‌به‌چپ left-2 قرار می‌گیرد تا گوشه راست برای بستن سایدبار آزاد بماند) */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setIsLogoutOpen(true)}
          aria-label="خروج از حساب"
          className={cn(
            "absolute top-2 right-2 z-10 h-8 w-8 rounded-full",
            "text-muted-foreground",
            "hover:bg-destructive/10 hover:text-destructive",
            "focus-visible:ring-2 focus-visible:ring-destructive/40",
          )}
        >
          <LogOut className="h-4 w-4" />
        </Button>

        {/* محتوای آواتار، نام و نقش کاربر */}
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <Avatar className="h-20 w-20 ring-2 ring-primary/25 ring-offset-2 ring-offset-card shadow-sm">
            {user?.avatarUrl && (
              <AvatarImage src={user.avatarUrl} alt={displayName} className="object-cover" />
            )}
            <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">
              {initials ? initials : <UserIcon className="h-8 w-8" />}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col items-center gap-2">
            <span className="text-base font-bold leading-tight text-foreground">{displayName}</span>
            <Badge
              variant="outline"
              className="gap-1 rounded-full border-primary/30 bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary"
            >
              <GraduationCap className="h-3 w-3" />
              {displayRole}
            </Badge>
          </div>
        </div>

        {/* دکمه ویرایش اطلاعات کاربری با متن واضح و آیکون هماهنگ */}
        {/* <Button
          render={<Link href={editProfileHref} />}
          nativeButton={false}
          variant="secondary"
          size="sm"
          className={cn(
            "w-full gap-1.5 rounded-xl border border-border/60",
            "mt-2",
            "text-xs font-semibold hover:border-primary/40 hover:text-primary transition-all duration-150",
          )}
        >
          <Pencil className="h-3.5 w-3.5" />
          <span>تکمیل اطلاعات کاربری</span>
        </Button> */}
      </div>

      <LogoutConfirmDialog
        open={isLogoutOpen}
        onOpenChange={setIsLogoutOpen}
        onConfirm={handleConfirmLogout}
        isLoading={isLoading}
      />
    </>
  );
}
