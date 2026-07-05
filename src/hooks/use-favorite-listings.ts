"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { useFavoritesStore } from "@/store/favorites";
import type { Listing } from "@/types/api";

/**
 * Fetches every favorited listing; ids that 404 (deleted listings) are
 * dropped from the result and pruned from the store.
 */
export function useFavoriteListings() {
  const ids = useFavoritesStore((s) => s.ids);
  const hasHydrated = useFavoritesStore((s) => s.hasHydrated);
  const remove = useFavoritesStore((s) => s.remove);

  const { data, error, isLoading, mutate } = useSWR<Listing[]>(
    hasHydrated && ids.length > 0 ? ["favorites", ...ids] : null,
    async () => {
      const results = await Promise.allSettled(
        ids.map((id) => fetcher<Listing>(`/listings/${id}`)),
      );
      const listings: Listing[] = [];
      results.forEach((result, i) => {
        if (result.status === "fulfilled") {
          listings.push(result.value);
        } else {
          remove(ids[i]);
        }
      });
      return listings;
    },
  );

  return {
    listings: data ?? [],
    isEmpty: hasHydrated && ids.length === 0,
    isReady: hasHydrated,
    isLoading,
    error,
    mutate,
  };
}
