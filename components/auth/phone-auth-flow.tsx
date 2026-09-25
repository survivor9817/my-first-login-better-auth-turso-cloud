"use client";

import { Card, CardContent } from "@/components/ui/card";
import PhoneStep from "./phone-step";
import OtpStep from "./otp-step";
import PasswordStep from "./password-step";
import { usePhoneAuthFlow, RESEND_DELAY_SECONDS } from "./use-phone-auth-flow";

export default function PhoneAuthFlow() {
  const {
    step,
    phone,
    requestOtp,
    loading,
    serverError,
    verifyOtp,
    resendOtp,
    isNewUser,
    submitPassword,
    skipPassword,
    handleChangePhone,
  } = usePhoneAuthFlow();

  return (
    <Card className="min-w-80 max-w-100 w-full mx-2">
      <CardContent>
        {step === "phone" && (
          <PhoneStep
            defaultValue={phone}
            loading={loading}
            serverError={serverError}
            onSubmit={requestOtp}
          />
        )}

        {step === "otp" && (
          <OtpStep
            phone={phone}
            resendDelay={RESEND_DELAY_SECONDS}
            loading={loading}
            serverError={serverError}
            onVerify={verifyOtp}
            onResend={resendOtp}
            onChangePhone={handleChangePhone}
          />
        )}

        {step === "password" && (
          <PasswordStep
            loading={loading}
            serverError={serverError}
            onSubmit={submitPassword}
            onSkip={skipPassword}
            isNewUser={isNewUser}
          />
        )}
      </CardContent>
    </Card>
  );
}
