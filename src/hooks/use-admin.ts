"use client";

import useSWR from "swr";
import { useMe } from "@/hooks/use-me";
import type { Listing, PendingDocument } from "@/types/api";

export function usePendingListings() {
  const { isAdmin, isReady } = useMe();
  const { data, error, isLoading, mutate } = useSWR<Listing[]>(
    isReady && isAdmin ? "/admin/listings/pending" : null,
  );
  return { listings: data ?? [], isLoading, error, mutate };
}

export function usePendingDocuments() {
  const { isAdmin, isReady } = useMe();
  const { data, error, isLoading, mutate } = useSWR<PendingDocument[]>(
    isReady && isAdmin ? "/admin/documents/pending" : null,
  );
  return { documents: data ?? [], isLoading, error, mutate };
}
