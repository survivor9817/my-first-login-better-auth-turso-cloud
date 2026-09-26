import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out/sign-out-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log(session);

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <main className="p-8 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">داشبورد کاربری</h1>
        <SignOutButton />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>مشخصات کاربر</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="font-semibold">نام:</span> {session.user.name}
          </p>
          <p>
            <span className="font-semibold">ایمیل:</span> {session.user.email}
          </p>
          <p className="text-xs text-muted-foreground">شناسه کاربر: {session.user.id}</p>
        </CardContent>
      </Card>
    </main>
  );
}
