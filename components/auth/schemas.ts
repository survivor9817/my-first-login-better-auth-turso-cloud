import { z } from "zod";
import { zIranianMobile } from "zod-ir";

export const phoneSchema = z.object({
  phone: zIranianMobile({ strictZero: true, message: "شماره تلفن معتبر نیست" }),
});
export type PhoneValues = z.infer<typeof phoneSchema>;

export const otpSchema = z.object({
  otp: z.string().length(6, "کد باید ۶ رقم باشد"),
});
export type OtpValues = z.infer<typeof otpSchema>;

export const passwordSchema = z
  .object({
    password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن یکسان نیستند",
    path: ["confirmPassword"],
  });
export type PasswordValues = z.infer<typeof passwordSchema>;

export const signInSchema = z.object({
  phone: zIranianMobile({ strictZero: true, message: "شماره تلفن معتبر نیست" }),
  password: z.string().min(1, "رمز عبور را وارد کنید"),
});
export type SignInValues = z.infer<typeof signInSchema>;
