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

export const signInSchema = z.object({
  phone: zIranianMobile({ strictZero: true, message: "شماره تلفن معتبر نیست" }),
  password: z.string().min(1, "رمز عبور را وارد کنید"),
});
export type SignInValues = z.infer<typeof signInSchema>;

export const passwordSchema = z
  .object({
    password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
    confirmPassword: z.string().min(1, "تکرار رمز عبور را وارد کنید"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن یکسان نیستند",
    path: ["confirmPassword"],
  });
export type PasswordValues = z.infer<typeof passwordSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "رمز عبور فعلی را وارد کنید"),
    newPassword: z.string().min(8, "رمز عبور جدید باید حداقل ۸ کاراکتر باشد"),
    confirmPassword: z.string().min(1, "تکرار رمز عبور جدید را وارد کنید"),
    revokeOtherSessions: z.boolean(), // به جای .default(true)
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "رمز عبور جدید نمی‌تواند با رمز عبور فعلی یکسان باشد",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "رمز عبور جدید و تکرار آن یکسان نیستند",
    path: ["confirmPassword"],
  });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
