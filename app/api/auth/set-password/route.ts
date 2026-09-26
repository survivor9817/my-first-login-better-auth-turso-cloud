// app/api/auth/set-password/route.ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// پنجره زمانی مجاز برای تنظیم رمز پس از لاگین با OTP (مثلاً ۲ دقیقه)
const MAX_SESSION_AGE_MS = 2 * 60 * 1000;

export async function POST(req: Request) {
  try {
    const { newPassword } = await req.json();

    if (!newPassword || newPassword.length < 6) {
      // پیام مبهم: نگوییم "رمز کوتاه است"، بگوییم درخواست نامعتبر است
      return NextResponse.json({ message: "درخواست نامعتبر است." }, { status: 400 });
    }

    // // ۱. type-safety بیشتر روی ورودی
    // const { newPassword } = await req.json();

    // if (typeof newPassword !== "string" || newPassword.length < 6) {
    //   return NextResponse.json({ message: "درخواست نامعتبر است." }, { status: 400 });
    // }

    const reqHeaders = await headers();

    // ۱. بررسی وجود سشن
    const session = await auth.api.getSession({ headers: reqHeaders });

    // پیام مبهم برای امنیت (جلوگیری از Enumration)
    if (!session) {
      return NextResponse.json({ message: "عملیات مجاز نیست." }, { status: 401 });
    }

    // ۲. بررسی تازگی سشن (جلوگیری از استفاده از سشن‌های قدیمی)
    const sessionCreatedAt = new Date(session.session.createdAt).getTime();
    const sessionAge = Date.now() - sessionCreatedAt;

    if (sessionAge > MAX_SESSION_AGE_MS) {
      // به جای اینکه بگوییم "سشن منقضی شده"، می‌گوییم نیاز به احراز هویت مجدد است
      return NextResponse.json(
        { message: "لطفاً برای انجام این عملیات، مجدداً وارد حساب کاربری خود شوید." },
        { status: 401 },
      );
    }

    // ۳. استفاده از API رسمی Better Auth برای تنظیم/تغییر رمز
    // این متد به طور خودکار تشخیص می‌دهد که آیا باید رکورد جدید بسازد یا قبلی را آپدیت کند
    await auth.api.setPassword({
      body: { newPassword: newPassword },
      headers: reqHeaders,
    });

    return NextResponse.json({
      success: true,
      message: "رمز عبور با موفقیت تنظیم شد.",
    });
  } catch (error: any) {
    console.error("Set Password Error:", error);
    // پیام خطای عمومی و مبهم برای تمام خطاهای پیش‌بینی‌نشده
    return NextResponse.json({ message: "خطا در پردازش درخواست." }, { status: 400 });
  }
}
