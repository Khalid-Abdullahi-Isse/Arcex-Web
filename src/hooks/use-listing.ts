"use client";

import useSWR from "swr";
import type { Listing } from "@/types/api";

export function useListing(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Listing>(
    id ? `/listings/${id}` : null,
  );

  return { listing: data, isLoading, error, mutate };
}
