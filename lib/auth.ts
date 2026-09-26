import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { phoneNumber } from "better-auth/plugins";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },

  rateLimit: {
    enabled: true,
    window: 60, // پنجره زمانی بر حسب ثانیه (مثلاً ۶۰ ثانیه)
    max: 1, // در هر ۶۰ ثانیه حداکثر ۱ بار اجازه ارسال بده
    customRules: {
      // اعمال محدودیت اختصاصی برای اندپوینت ارسال پیامک
      "/phone-number/send-otp": {
        window: 60, // هر ۶۰ ثانیه
        max: 1, // فقط ۱ درخواست برای هر کاربر/IP
      },
    },
  },
  // session: {
  //   freshAge: 60 * 2, // دو دقیقه
  // },

  plugins: [
    phoneNumber({
      otpLength: 6,
      expiresIn: 120, // کد بعد از ۲ دقیقه (۱۲۰ ثانیه) منقضی می‌شود

      sendOTP: ({ phoneNumber, code }, ctx) => {
        // 🟡 موقت: چاپ کد در کنسول به جای ارسال پیامک
        console.log("\n============================");
        console.log(`📱 OTP برای ${phoneNumber}`);
        console.log(`🔑 کد: ${code}`);
        console.log("============================\n");
      },
      signUpOnVerification: {
        getTempEmail: (phoneNumber) => `${phoneNumber.replace(/\+/g, "")}@temp.local`,
        getTempName: (phoneNumber) => `User ${phoneNumber}`,
      },
    }),
  ],
});

// lib/auth.ts
// export const auth = betterAuth({
//   rateLimit: {
//     enabled: true,
//     window: 60, // پنجره زمانی بر حسب ثانیه (مثلاً ۶۰ ثانیه)
//     max: 1, // در هر ۶۰ ثانیه حداکثر ۱ بار اجازه ارسال بده
//     customRules: {
//       // اعمال محدودیت اختصاصی برای اندپوینت ارسال پیامک
//       "/phone-number/send-otp": {
//         window: 60, // هر ۶۰ ثانیه
//         max: 1, // فقط ۱ درخواست برای هر کاربر/IP
//       },
//     },
//   },
//   session: {
//     freshAge: 60 * 2, // دو دقیقه
//   },
//   plugins: [
//     phoneNumber({
//       otpLength: 6,
//       expiresIn: 120, // کد بعد از ۲ دقیقه (۱۲۰ ثانیه) منقضی می‌شود
//       sendOTP: async ({ phoneNumber, code }, request) => {
//         await sendSms(phoneNumber, code);
//       },
//     }),
//   ],
// });

// // lib/auth.ts
// import { betterAuth } from "better-auth";
// import { phoneNumber } from "better-auth/plugins";

// export const auth = betterAuth({
//   emailAndPassword: {
//     enabled: true,
//   },
//   plugins: [
//     phoneNumber({
//       sendOTP: async ({ phoneNumber, code }) => {
//         // ارسال پیامک
//       },
//       // این گزینه جادوی کار شماست:
//       signUpOnVerification: {
//         getTempEmail: (phoneNumber) => `${phoneNumber.replace(/\+/g, "")}@temp.local`,
//         getTempName: (phoneNumber) => `User ${phoneNumber}`,
//       }
//     }),
//   ],
// });
