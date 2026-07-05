"use client";

import useSWR from "swr";
import { useAuthStore } from "@/store/auth";
import type { Listing } from "@/types/api";

export function useMyListings() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  const { data, error, isLoading, mutate } = useSWR<Listing[]>(
    hasHydrated && accessToken ? "/users/me/listings" : null,
  );

  return { listings: data ?? [], isLoading, error, mutate };
}
