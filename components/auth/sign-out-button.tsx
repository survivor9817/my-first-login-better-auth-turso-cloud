"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
    setLoading(false);
  };

  return (
    <Button
      variant="destructive"
      onClick={handleSignOut}
      disabled={loading}
      className="cursor-pointer"
    >
      {loading ? "در حال خروج..." : "خروج از حساب"}
    </Button>
  );
}
