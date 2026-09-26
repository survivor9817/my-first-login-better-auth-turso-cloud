"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";

import { passwordSchema, type PasswordValues } from "./schemas";
import { PasswordInput } from "./password-input";

interface PasswordStepProps {
  loading: boolean;
  serverError: string | null;
  onSubmit: (password: string) => Promise<void>;
}

function PasswordStep({ loading, serverError, onSubmit }: PasswordStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values.password))}>
      <FieldGroup className="gap-4">
        <FieldContent className="flex flex-col justify-center items-center gap-1 text-center">
          <FieldTitle className="text-2xl font-bold">تعیین کلمه عبور</FieldTitle>
          <FieldDescription>رمز گذاشتن برای ورود بدون پیامک لازمه.</FieldDescription>
        </FieldContent>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password" className="sr-only">
            رمز عبور جدید
          </FieldLabel>
          <PasswordInput
            id="password"
            placeholder="رمز عبور جدید"
            aria-invalid={!!errors.password}
            autoComplete="new-password"
            {...register("password")}
          />
          {errors.password && <FieldError errors={[errors.password]} />}
        </Field>

        <Field data-invalid={!!errors.confirmPassword}>
          <FieldLabel htmlFor="confirmPassword" className="sr-only">
            تکرار رمز عبور
          </FieldLabel>
          <PasswordInput
            id="confirmPassword"
            placeholder="تکرار رمز عبور"
            aria-invalid={!!errors.confirmPassword}
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && <FieldError errors={[errors.confirmPassword]} />}
        </Field>

        {serverError && (
          <FieldError role="alert" errors={[{ message: serverError }]} className="text-center" />
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "در حال ثبت..." : "ثبت رمز عبور"}
        </Button>
      </FieldGroup>
    </form>
  );
}

export default PasswordStep;
