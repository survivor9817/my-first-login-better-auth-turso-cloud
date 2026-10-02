"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Phone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";

const phoneSchema = z.object({
  phone: z.string().regex(/^09\d{9}$/, "شماره موبایل معتبر نیست (مثلاً: ۰۹۱۲۳۴۵۶۷۸۹)"),
});

interface EditPhoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValue?: string;
  onSendOtp: (phone: string) => Promise<void> | void;
}

export function EditPhoneDialog({
  open,
  onOpenChange,
  defaultValue = "",
  onSendOtp,
}: EditPhoneDialogProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: defaultValue },
    values: { phone: defaultValue },
  });

  const onFormSubmit = (data: { phone: string }) => {
    startTransition(async () => {
      await onSendOtp(data.phone);
    });
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        <span className="flex items-center gap-2 text-foreground font-semibold">
          <Phone className="h-5 w-5 text-primary" />
          ویرایش شماره موبایل
        </span>
      }
      description="کد تأیید به شماره جدید ارسال خواهد شد."
    >
      <div className="flex flex-col gap-4 pt-2" dir="rtl">
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <FieldGroup>
            <Field data-invalid={!!errors.phone}>
              <FieldLabel htmlFor="phone">شماره موبایل جدید</FieldLabel>
              <Input
                id="phone"
                dir="ltr"
                placeholder="09123456789"
                maxLength={11}
                inputMode="numeric"
                aria-invalid={!!errors.phone}
                {...register("phone")}
              />
              <FieldError errors={[errors.phone]} />
            </Field>
          </FieldGroup>

          <div className="flex flex-row-reverse justify-start gap-2 pt-3 border-t mt-4">
            <Button type="submit" disabled={isPending} className="flex-1 sm:flex-initial">
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  در حال ارسال...
                </>
              ) : (
                "ارسال کد تایید"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="flex-1 sm:flex-initial"
            >
              انصراف
            </Button>
          </div>
        </form>
      </div>
    </ResponsiveDialog>
  );
}
