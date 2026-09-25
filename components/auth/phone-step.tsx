"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";

import { phoneSchema, type PhoneValues } from "./schemas";
import { PhoneInput } from "./phone-input";
import { cn } from "cn";

interface PhoneStepProps {
  defaultValue?: string;
  loading: boolean;
  serverError: string | null;
  onSubmit: (phone: string) => Promise<void>;
}

const PhoneStep = ({ defaultValue = "", loading, serverError, onSubmit }: PhoneStepProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: defaultValue },
  });

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values.phone))}>
      <FieldGroup className="gap-4">
        <FieldContent className="flex justify-center items-center gap-4">
          <FieldTitle className="text-2xl font-bold">ثبت نام یا ورود با پیامک</FieldTitle>
          <FieldDescription>شماره موبایلت رو وارد کن تا کد تأیید برات پیامک بشه.</FieldDescription>
        </FieldContent>

        <Field data-invalid={!!errors.phone}>
          <FieldLabel htmlFor="phone" className="sr-only">
            شماره موبایل
          </FieldLabel>
          <PhoneInput
            id="phone"
            placeholder="شماره موبایل"
            aria-invalid={!!errors.phone}
            {...register("phone")}
            className="text-center pr-3"
          />
          {errors.phone && <FieldError errors={[errors.phone]} />}
        </Field>

        {serverError && (
          <FieldError role="alert" errors={[{ message: serverError }]} className="text-center" />
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "در حال ارسال..." : "ارسال کد"}
        </Button>

        <p className="text-center text-xs leading-6 text-muted-foreground">
          با ثبت‌نام در درس‌یاور،{" "}
          <Link
            href="/terms"
            target="_blank"
            className="font-medium text-primary underline underline-offset-2"
          >
            قوانین و شرایط
          </Link>{" "}
          را قبول می‌کنم.
        </p>

        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
          <span>قبلاً ثبت‌نام کردی؟</span>
          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({ variant: "link" }),
              "h-auto p-0 font-bold underline underline-offset-2",
            )}
          >
            ورود
          </Link>
        </div>
      </FieldGroup>
    </form>
  );
};

export default PhoneStep;
