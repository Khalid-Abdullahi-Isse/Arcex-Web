"use client";

import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { Sidebar } from "@/components/layout/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Suspense fallback={<div className="hidden w-[60px] shrink-0 lg:block" />}>
        <Sidebar />
      </Suspense>
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <main className="min-w-0 flex-1 px-4 pb-24 pt-5 md:px-6 lg:pb-10">
          {children}
        </main>
      </div>
      <MobileTabbar />
    </div>
  );
}
