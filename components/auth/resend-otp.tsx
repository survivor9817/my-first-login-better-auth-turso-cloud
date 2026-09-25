"use client";

import * as React from "react";

import { useCountdown } from "@/hooks/use-countdown";

interface ResendOtpProps {
  resendDelay: number;
  loading: boolean;
  onResend: () => Promise<void>;
}

/**
 * این تایمر فقط UX هست، نه enforcement واقعی.
 * Better Auth مقدار اعتبار/زمان مجاز resend رو در پاسخ sendOtp برنمی‌گردونه،
 * پس محدودیت واقعی (rate limit) باید سمت سرور جدا پیاده بشه.
 */
function ResendOtp({ resendDelay, loading, onResend }: ResendOtpProps) {
  const [timeLeft, { startCountdown, resetCountdown }] = useCountdown({
    countStart: resendDelay,
    countStop: 0,
    intervalMs: 1000,
  });

  React.useEffect(() => {
    startCountdown();
  }, [startCountdown]);

  const handleResend = async () => {
    if (timeLeft > 0) return;
    await onResend();
    resetCountdown();
    startCountdown();
  };

  if (timeLeft > 0) {
    return (
      <span className="text-muted-foreground block">ارسال دوباره تا {timeLeft} ثانیه دیگر</span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleResend}
      disabled={loading}
      className="text-primary font-bold underline underline-offset-2 block mx-auto"
    >
      ارسال دوباره کد تأیید
    </button>
  );
}

export default ResendOtp;
