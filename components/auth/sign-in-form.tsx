"use client";

import Link from "next/link";
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
import { PasswordInput } from "./password-input";
import { PhoneInput } from "./phone-input";

import { signInSchema, type SignInValues } from "./schemas";
import { useSignInForm } from "./use-sign-in-form";

const SignInForm = () => {
  const { loading, serverError, signIn } = useSignInForm();

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { phone: "", password: "" },
  });

  return (
    <Card className="min-w-80 max-w-100 w-full mx-2">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">ورود به حساب کاربری</CardTitle>
        <CardDescription className="flex items-center justify-center gap-1">
          <span>هنوز ثبت نام نکردی؟</span>
          <Button
            render={<Link href="/sign-up" />}
            nativeButton={false}
            variant="link"
            className="h-auto p-0 font-bold underline underline-offset-2"
          >
            ثبت نام
          </Button>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="sign-in-form"
          onSubmit={form.handleSubmit((values) => signIn(values.phone, values.password))}
        >
          <FieldGroup>
            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="sign-in-phone" className="sr-only">
                    شماره موبایل
                  </FieldLabel>
                  <PhoneInput
                    {...field}
                    id="sign-in-phone"
                    placeholder="شماره موبایل"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="-mt-2">
                  <FieldLabel htmlFor="sign-in-password" className="sr-only">
                    رمز عبور
                  </FieldLabel>
                  <PasswordInput
                    {...field}
                    id="sign-in-password"
                    placeholder="رمز عبور"
                    autoComplete="current-password"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
        <Button type="submit" form="sign-in-form" className="w-full" disabled={loading}>
          {loading ? "در حال ورود..." : "ورود"}
        </Button>

        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">رمز عبورت یادت رفته؟</span>
          <Button
            render={<Link href="/forgot-password" />}
            nativeButton={false}
            variant="link"
            className="h-auto p-0 text-sm font-bold underline underline-offset-2"
          >
            ورود سریع با پیامک
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SignInForm;
