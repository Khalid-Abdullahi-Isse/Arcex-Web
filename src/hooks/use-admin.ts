"use client";

import useSWR from "swr";
import { useMe } from "@/hooks/use-me";
import { buildQuery } from "@/lib/api";
import type {
  ListedVsSoldValue,
  Listing,
  PendingDocument,
  SalesByRegion,
  SalesSummary,
  SalesTrendPoint,
  StatusBreakdown,
} from "@/types/api";

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

export function useSalesAnalytics(params: {
  from?: string;
  to?: string;
  granularity?: "day" | "week" | "month";
}) {
  const { isAdmin, isReady } = useMe();
  const range = buildQuery({ from: params.from, to: params.to });
  const trend = buildQuery({
    from: params.from,
    to: params.to,
    granularity: params.granularity ?? "month",
  });
  const enabled = isReady && isAdmin;

  const summary = useSWR<SalesSummary>(enabled ? `/admin/analytics/sales-summary${range}` : null);
  const trendData = useSWR<SalesTrendPoint[]>(enabled ? `/admin/analytics/sales-trend${trend}` : null);
  const byRegion = useSWR<SalesByRegion[]>(enabled ? `/admin/analytics/by-region${range}` : null);
  const status = useSWR<StatusBreakdown>(enabled ? "/admin/analytics/status-breakdown" : null);
  const listedVsSold = useSWR<ListedVsSoldValue>(
    enabled ? `/admin/analytics/listed-vs-sold-value${range}` : null,
  );

  return {
    summary: summary.data,
    trend: trendData.data ?? [],
    byRegion: byRegion.data ?? [],
    status: status.data,
    listedVsSold: listedVsSold.data,
    isLoading:
      summary.isLoading ||
      trendData.isLoading ||
      byRegion.isLoading ||
      status.isLoading ||
      listedVsSold.isLoading,
    error: summary.error ?? trendData.error ?? byRegion.error ?? status.error ?? listedVsSold.error,
  };
}
