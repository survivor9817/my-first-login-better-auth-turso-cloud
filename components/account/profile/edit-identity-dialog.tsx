"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UserPen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";

export const identitySchema = z.object({
  firstName: z.string().min(2, "نام باید حداقل ۲ حرف باشد"),
  lastName: z.string().min(2, "نام خانوادگی باید حداقل ۲ حرف باشد"),
  nationalCode: z.string().length(10, "کد ملی باید ۱۰ رقم باشد").regex(/^\d+$/, "فقط عدد مجاز است"),
  birthDate: z.string().min(1, "تاریخ تولد الزامی است"),
});

export type IdentityFormValues = z.infer<typeof identitySchema>;

interface EditIdentityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues: IdentityFormValues;
  onSubmit: (values: IdentityFormValues) => Promise<void> | void;
}

export function EditIdentityDialog({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
}: EditIdentityDialogProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IdentityFormValues>({
    resolver: zodResolver(identitySchema),
    defaultValues,
    values: defaultValues,
  });

  const onFormSubmit = (values: IdentityFormValues) => {
    startTransition(async () => {
      await onSubmit(values);
      onOpenChange(false);
    });
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        <span className="flex items-center gap-2 text-foreground font-semibold">
          <UserPen className="h-5 w-5 text-primary" />
          ویرایش اطلاعات شناسایی
        </span>
      }
      description="اطلاعات شناسایی خود را بررسی و ذخیره کنید."
    >
      <div className="flex flex-col gap-4 pt-2" dir="rtl">
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <FieldGroup>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field data-invalid={!!errors.firstName}>
                <FieldLabel htmlFor="firstName">نام</FieldLabel>
                <Input
                  id="firstName"
                  placeholder="مثلاً: رضا"
                  aria-invalid={!!errors.firstName}
                  {...register("firstName")}
                />
                <FieldError errors={[errors.firstName]} />
              </Field>

              <Field data-invalid={!!errors.lastName}>
                <FieldLabel htmlFor="lastName">نام خانوادگی</FieldLabel>
                <Input
                  id="lastName"
                  placeholder="مثلاً: قزلسفلو"
                  aria-invalid={!!errors.lastName}
                  {...register("lastName")}
                />
                <FieldError errors={[errors.lastName]} />
              </Field>
            </div>

            <Field data-invalid={!!errors.nationalCode}>
              <FieldLabel htmlFor="nationalCode">کد ملی</FieldLabel>
              <Input
                id="nationalCode"
                placeholder="۱۰ رقم کد ملی"
                maxLength={10}
                inputMode="numeric"
                aria-invalid={!!errors.nationalCode}
                {...register("nationalCode")}
              />
              <FieldError errors={[errors.nationalCode]} />
            </Field>

            <Field data-invalid={!!errors.birthDate}>
              <FieldLabel htmlFor="birthDate">تاریخ تولد</FieldLabel>
              <Input
                id="birthDate"
                placeholder="مثلاً: ۱۳۷۶/۰۴/۱۸"
                aria-invalid={!!errors.birthDate}
                {...register("birthDate")}
              />
              <FieldError errors={[errors.birthDate]} />
            </Field>
          </FieldGroup>

          <div className="flex flex-row-reverse justify-start gap-2 pt-3 border-t mt-4">
            <Button type="submit" disabled={isPending} className="flex-1 sm:flex-initial min-w-28">
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  در حال ذخیره...
                </>
              ) : (
                "ذخیره تغییرات"
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
