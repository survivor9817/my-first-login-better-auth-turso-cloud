// app/api/auth/set-password/route.ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const MAX_SESSION_AGE_MS = 2 * 60 * 1000;

export async function POST(req: Request) {
  try {
    const { newPassword } = await req.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ message: "درخواست نامعتبر است." }, { status: 400 });
    }

    const reqHeaders = await headers();

    const session = await auth.api.getSession({ headers: reqHeaders });

    if (!session) {
      return NextResponse.json({ message: "عملیات مجاز نیست." }, { status: 401 });
    }

    const sessionCreatedAt = new Date(session.session.createdAt).getTime();
    const sessionAge = Date.now() - sessionCreatedAt;
    if (sessionAge > MAX_SESSION_AGE_MS) {
      return NextResponse.json(
        { message: "لطفاً برای انجام این عملیات، دوباره وارد حساب کاربری خود شوید." },
        { status: 401 },
      );
    }

    await auth.api.setPassword({
      body: { newPassword },
      headers: reqHeaders,
    });

    return NextResponse.json({
      success: true,
      message: "رمز عبور با موفقیت تنظیم شد.",
    });
  } catch (error: any) {
    console.error("Set Password Error:", error);
    return NextResponse.json({ message: "خطا در پردازش درخواست." }, { status: 400 });
  }
}
