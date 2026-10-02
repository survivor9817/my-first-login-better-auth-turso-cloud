import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, phoneNumberClient } from "better-auth/client/plugins";
import type { auth } from "./auth"; // ✅ استفاده از type برای جلوگیری از نشت کدهای سرور

export const authClient = createAuthClient({
  plugins: [phoneNumberClient(), inferAdditionalFields<typeof auth>()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
