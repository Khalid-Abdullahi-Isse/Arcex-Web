"use client";

import useSWR from "swr";
import { useAuthStore } from "@/store/auth";
import type { User } from "@/types/api";

export function useMe() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const setUser = useAuthStore((s) => s.setUser);
  const cachedUser = useAuthStore((s) => s.user);

  const { data, error, isLoading, mutate } = useSWR<User>(
    hasHydrated && accessToken ? "/users/me" : null,
    {
      onSuccess: (user) => setUser(user),
    },
  );

  return {
    user: data ?? cachedUser,
    isLoggedIn: Boolean(accessToken),
    isAdmin: (data ?? cachedUser)?.role === "ADMIN",
    isReady: hasHydrated,
    isLoading,
    error,
    mutate,
  };
}
