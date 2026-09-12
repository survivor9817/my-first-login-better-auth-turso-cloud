"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signIn, signUp, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuthPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, isPending: isSessionLoading } = useSession();

  // مقادیر فرم
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // اگر کاربر لاگین بود، مستقیماً به داشبورد هدایت شود
  useEffect(() => {
    if (session && !isSessionLoading) {
      router.replace("/dashboard");
    }
  }, [session, isSessionLoading, router]);

  // اکشن پس از موفقیت در احراز هویت
  const handleAuthSuccess = async () => {
    setErrorMsg(null);
    await queryClient.invalidateQueries();
    router.push("/dashboard");
    router.refresh();
  };

  // میوتیشن ورود
  const signInMutation = useMutation({
    mutationFn: async () => {
      const res = await signIn.email({ email, password });
      if (res.error) throw new Error(res.error.message || "خطا در ورود به حساب کاربری");
      return res.data;
    },
    onSuccess: handleAuthSuccess,
    onError: (err: Error) => setErrorMsg(err.message),
  });

  // میوتیشن ثبت‌نام
  const signUpMutation = useMutation({
    mutationFn: async () => {
      const res = await signUp.email({ email, password, name });
      if (res.error) throw new Error(res.error.message || "خطا در ایجاد حساب کاربری");
      return res.data;
    },
    onSuccess: handleAuthSuccess,
    onError: (err: Error) => setErrorMsg(err.message),
  });

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    signInMutation.mutate();
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    signUpMutation.mutate();
  };

  if (isSessionLoading || session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">در حال انتقال به داشبورد...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/20">
      <Tabs
        defaultValue="signin"
        className="w-full max-w-md"
        onValueChange={() => setErrorMsg(null)}
      >
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="signin">ورود</TabsTrigger>
          <TabsTrigger value="signup">ثبت‌نام</TabsTrigger>
        </TabsList>

        {errorMsg && (
          <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive text-center">
            {errorMsg}
          </div>
        )}

        {/* تب ورود */}
        <TabsContent value="signin">
          <Card>
            <CardHeader>
              <CardTitle>ورود به حساب</CardTitle>
              <CardDescription>ایمیل و رمز عبور خود را برای ورود وارد کنید.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSignInSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">ایمیل</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">رمز عبور</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={signInMutation.isPending}
                >
                  {signInMutation.isPending ? "در حال پردازش..." : "ورود"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* تب ثبت‌نام */}
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>ایجاد حساب جدید</CardTitle>
              <CardDescription>مشخصات خود را برای ثبت‌نام تکمیل کنید.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSignUpSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">نام و نام خانوادگی</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="علیرضا"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">ایمیل</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">رمز عبور</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={signUpMutation.isPending}
                >
                  {signUpMutation.isPending ? "در حال ثبت‌نام..." : "ایجاد حساب"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
