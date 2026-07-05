"use client";

import useSWR from "swr";
import { buildQuery } from "@/lib/api";
import type { Listing, Paginated } from "@/types/api";

export interface ListingFilters {
  region?: string;
  minPrice?: string;
  maxPrice?: string;
  minSizeSqm?: string;
  maxSizeSqm?: string;
  page?: number;
  limit?: number;
}

export function useListings(filters: ListingFilters) {
  const query = buildQuery({
    region: filters.region,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    minSizeSqm: filters.minSizeSqm,
    maxSizeSqm: filters.maxSizeSqm,
    page: filters.page ?? 1,
    limit: filters.limit ?? 12,
  });

  const { data, error, isLoading, mutate } = useSWR<Paginated<Listing>>(
    `/listings${query}`,
    { keepPreviousData: true },
  );

  return {
    listings: data?.items ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? filters.page ?? 1,
    limit: data?.limit ?? filters.limit ?? 12,
    isLoading,
    error,
    mutate,
  };
}
