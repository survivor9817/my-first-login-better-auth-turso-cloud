// app/account/layout.tsx
"use client";

import { useState } from "react";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { AccountHeader } from "@/components/account/account-header";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex items-center justify-center w-full">
      {/* max-w-240 */}
      <div className="min-h-screen flex-1 bg-background text-foreground flex flex-col md:flex-col">
        <AccountHeader onMenuToggle={() => setIsSidebarOpen(true)} />

        <div className="flex-1 flex flex-row min-w-0">
          <AccountSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <main className="flex-1 p-2 md:p-4 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
