"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import PasswordInput from "../password-input";
import { changePasswordSchema, type ChangePasswordValues } from "../schemas";
import { useChangePasswordForm } from "./use-change-password-form";
import ForgotPasswordLink from "../forgot-password-link";

const ChangePasswordForm = () => {
  const { loading, serverError, changePassword } = useChangePasswordForm();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      revokeOtherSessions: true,
    },
  });

  return (
    <Card
      className="mx-auto w-full max-w-md rounded-2xl border-border/80 shadow-sm overflow-hidden py-0 gap-0"
      dir="rtl"
    >
      {/* هدر یکپارچه به همراه توضیحات */}
      <CardHeader className="flex flex-col gap-1 py-3.5! border-b bg-muted/20 space-y-0">
        <div className="flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-primary" />
          <CardTitle className="text-base font-bold text-foreground">تغییر گذرواژه</CardTitle>
        </div>
        <CardDescription className="text-xs text-muted-foreground pr-6">
          رمز عبور فعلی و رمز عبور جدید خود را وارد کنید
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 sm:p-5">
        <form
          id="change-password-form"
          onSubmit={handleSubmit((values) => changePassword(values))}
          className="space-y-4"
        >
          <FieldGroup className="gap-3">
            {/* گذرواژه فعلی */}
            <Field data-invalid={!!errors.currentPassword}>
              <FieldLabel htmlFor="currentPassword">گذرواژه فعلی</FieldLabel>
              <PasswordInput
                className="text-sm"
                id="currentPassword"
                placeholder="گذرواژه فعلی"
                autoComplete="current-password"
                aria-invalid={!!errors.currentPassword}
                {...register("currentPassword")}
              />
              <FieldError errors={[errors.currentPassword]} />
            </Field>

            {/* گذرواژه جدید */}
            <Field data-invalid={!!errors.newPassword}>
              <FieldLabel htmlFor="newPassword">گذرواژه جدید</FieldLabel>
              <PasswordInput
                className="text-sm"
                id="newPassword"
                placeholder="حداقل ۸ کاراکتر"
                autoComplete="new-password"
                aria-invalid={!!errors.newPassword}
                {...register("newPassword")}
              />
              <FieldError errors={[errors.newPassword]} />
            </Field>

            {/* تکرار گذرواژه جدید */}
            <Field data-invalid={!!errors.confirmPassword}>
              <FieldLabel htmlFor="confirmPassword">تکرار گذرواژه جدید</FieldLabel>
              <PasswordInput
                className="text-sm"
                id="confirmPassword"
                placeholder="تکرار گذرواژه جدید"
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                {...register("confirmPassword")}
              />
              <FieldError errors={[errors.confirmPassword]} />
            </Field>

            {/* چک‌باکس نشست‌های دیگر */}
            <Controller
              name="revokeOtherSessions"
              control={control}
              render={({ field }) => (
                <Field orientation="horizontal" className="items-start gap-2.5 pt-1">
                  <Checkbox
                    id="revokeOtherSessions"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-0.5 shrink-0"
                  />
                  <div className="grid gap-1 leading-snug">
                    <FieldLabel
                      htmlFor="revokeOtherSessions"
                      className="text-xs font-normal text-muted-foreground cursor-pointer select-none"
                    >
                      خروج از سایر حساب‌ها و دستگاه‌های متصل
                    </FieldLabel>
                    <span className="text-[11px] text-muted-foreground/70">
                      (برای امنیت بیشتر، نشست‌های فعال دیگر بسته خواهند شد)
                    </span>
                  </div>
                </Field>
              )}
            />

            {serverError && (
              <FieldError
                role="alert"
                errors={[{ message: serverError }]}
                className="text-center"
              />
            )}
          </FieldGroup>

          {/* اکشن‌های فرم با دکمه ارسال و لینک فراموشی */}
          <div className="flex flex-col gap-3 pt-3 border-t">
            <Button type="submit" form="change-password-form" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  در حال ثبت تغییرات...
                </>
              ) : (
                "به‌روزرسانی گذرواژه"
              )}
            </Button>

            <div className="flex justify-center text-xs">
              <ForgotPasswordLink />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordForm;
