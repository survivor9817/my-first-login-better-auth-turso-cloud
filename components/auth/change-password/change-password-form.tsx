"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card className="min-w-80 max-w-100 w-full mx-2" dir="rtl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">تغییر رمز عبور</CardTitle>
        <CardDescription>رمز عبور فعلی و رمز عبور جدید خود را وارد کنید</CardDescription>
      </CardHeader>

      <CardContent>
        <form id="change-password-form" onSubmit={handleSubmit((values) => changePassword(values))}>
          <FieldGroup className="gap-3">
            <Field data-invalid={!!errors.currentPassword}>
              <FieldLabel htmlFor="currentPassword">رمز عبور فعلی</FieldLabel>
              <PasswordInput
                id="currentPassword"
                placeholder="رمز عبور فعلی"
                autoComplete="current-password"
                aria-invalid={!!errors.currentPassword}
                {...register("currentPassword")}
              />
              {errors.currentPassword && <FieldError errors={[errors.currentPassword]} />}
            </Field>

            <Field data-invalid={!!errors.newPassword}>
              <FieldLabel htmlFor="newPassword">رمز عبور جدید</FieldLabel>
              <PasswordInput
                id="newPassword"
                placeholder="حداقل ۸ کاراکتر"
                autoComplete="new-password"
                aria-invalid={!!errors.newPassword}
                {...register("newPassword")}
              />
              {errors.newPassword && <FieldError errors={[errors.newPassword]} />}
            </Field>

            <Field data-invalid={!!errors.confirmPassword}>
              <FieldLabel htmlFor="confirmPassword">تکرار رمز عبور جدید</FieldLabel>
              <PasswordInput
                id="confirmPassword"
                placeholder="تکرار رمز عبور جدید"
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && <FieldError errors={[errors.confirmPassword]} />}
            </Field>

            <Controller
              name="revokeOtherSessions"
              control={control}
              render={({ field }) => (
                <Field orientation="horizontal" className="items-start gap-2 pt-1">
                  <Checkbox
                    id="revokeOtherSessions"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-0.5 shrink-0"
                  />
                  <div className="grid gap-0.5 leading-none">
                    <FieldLabel
                      htmlFor="revokeOtherSessions"
                      className="text-xs font-normal text-muted-foreground cursor-pointer select-none"
                    >
                      خروج از سایر حساب‌ها و دستگاه‌های متصل
                    </FieldLabel>
                    <span className="text-[11px] text-muted-foreground/80">
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
        </form>
      </CardContent>

      <CardFooter className="flex-col gap-4">
        <Button type="submit" form="change-password-form" className="w-full" disabled={loading}>
          {loading ? "در حال ثبت تغییرات..." : "به‌روزرسانی رمز"}
        </Button>

        <ForgotPasswordLink />
      </CardFooter>
    </Card>
  );
};

export default ChangePasswordForm;
