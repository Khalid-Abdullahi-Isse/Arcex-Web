"use client";

import { ThemeProvider } from "next-themes";
import { SWRConfig } from "swr";
import { Toaster } from "@/components/ui/sonner";
import { fetcher } from "@/lib/api";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="acrex-theme"
    >
      <SWRConfig
        value={{
          fetcher,
          revalidateOnFocus: false,
          dedupingInterval: 5000,
          shouldRetryOnError: false,
        }}
      >
        {children}
        <Toaster position="bottom-right" richColors />
      </SWRConfig>
    </ThemeProvider>
  );
}
