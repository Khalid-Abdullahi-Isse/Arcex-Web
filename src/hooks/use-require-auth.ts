"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

/** Redirects to /login (preserving the current path) once the store has
 *  hydrated and no token is present. Returns readiness for gating render. */
export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = useAuthStore((s) => s.accessToken);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!accessToken) {
      const redirect =
        pathname.startsWith("/") && !pathname.startsWith("//")
          ? `?redirect=${encodeURIComponent(pathname)}`
          : "";
      router.replace(`/login${redirect}`);
    }
  }, [hasHydrated, accessToken, pathname, router]);

  return { ready: hasHydrated && Boolean(accessToken) };
}
