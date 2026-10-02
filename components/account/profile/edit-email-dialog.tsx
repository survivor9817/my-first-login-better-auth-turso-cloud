"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";

const emailSchema = z.object({
  email: z.string().email("ایمیل وارد شده معتبر نیست"),
});

interface EditEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValue?: string;
  onSendOtp: (email: string) => Promise<void> | void;
}

export function EditEmailDialog({
  open,
  onOpenChange,
  defaultValue = "",
  onSendOtp,
}: EditEmailDialogProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: defaultValue },
    values: { email: defaultValue },
  });

  const onFormSubmit = (data: { email: string }) => {
    startTransition(async () => {
      await onSendOtp(data.email);
    });
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        <span className="flex items-center gap-2 text-foreground font-semibold">
          <Mail className="h-5 w-5 text-primary" />
          ویرایش ایمیل
        </span>
      }
      description="لینک یا کد فعال‌سازی به ایمیل جدید فرستاده می‌شود."
    >
      <div className="flex flex-col gap-4 pt-2" dir="rtl">
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <FieldGroup>
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">ایمیل جدید</FieldLabel>
              <Input
                id="email"
                dir="ltr"
                type="email"
                placeholder="example@gmail.com"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              <FieldError errors={[errors.email]} />
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
