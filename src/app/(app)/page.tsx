"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LandPlot } from "lucide-react";
import { FilterBar } from "@/components/listings/filter-bar";
import { ListingGrid } from "@/components/listings/listing-grid";
import { Pagination } from "@/components/listings/pagination";
import { RegionChips } from "@/components/listings/region-chips";
import { EmptyState } from "@/components/shared/empty-state";
import { ListingGridSkeleton } from "@/components/shared/skeletons";
import { useDebounce } from "@/hooks/use-debounce";
import { useListings, type ListingFilters } from "@/hooks/use-listings";

type RangeDraft = Pick<
  ListingFilters,
  "minPrice" | "maxPrice" | "minSizeSqm" | "maxSizeSqm"
>;

function BrowseContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const region = searchParams.get("region") ?? undefined;
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  const [draft, setDraft] = useState<RangeDraft>({
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
    minSizeSqm: searchParams.get("minSizeSqm") ?? "",
    maxSizeSqm: searchParams.get("maxSizeSqm") ?? "",
  });
  const debouncedDraft = useDebounce(draft);

  // Push debounced range filters into the URL (resetting to page 1).
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    let changed = false;
    for (const key of ["minPrice", "maxPrice", "minSizeSqm", "maxSizeSqm"] as const) {
      const value = debouncedDraft[key] ?? "";
      if ((params.get(key) ?? "") !== value) {
        changed = true;
        if (value) params.set(key, value);
        else params.delete(key);
      }
    }
    if (changed) {
      params.delete("page");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedDraft]);

  const filters = useMemo<ListingFilters>(
    () => ({
      region,
      minPrice: searchParams.get("minPrice") ?? undefined,
      maxPrice: searchParams.get("maxPrice") ?? undefined,
      minSizeSqm: searchParams.get("minSizeSqm") ?? undefined,
      maxSizeSqm: searchParams.get("maxSizeSqm") ?? undefined,
      page,
      limit: 12,
    }),
    [region, searchParams, page],
  );

  const { listings, total, limit, isLoading, error } = useListings(filters);

  const setParam = (key: string, value: string | undefined, resetPage = true) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    if (resetPage) params.delete("page");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const hasActiveFilters = Boolean(
    draft.minPrice || draft.maxPrice || draft.minSizeSqm || draft.maxSizeSqm,
  );

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-4">
      <div className="flex items-baseline justify-between gap-3">
        <h1 className="text-pf-text-primary">
          {region ? `Land in ${region}` : "Browse land"}
        </h1>
        {!isLoading ? (
          <p className="text-[13px] text-pf-text-tertiary">
            {total} listing{total === 1 ? "" : "s"}
          </p>
        ) : null}
      </div>

      <RegionChips active={region} onSelect={(r) => setParam("region", r)} />

      <FilterBar
        draft={draft}
        onChange={(patch) => setDraft((d) => ({ ...d, ...patch }))}
        onClear={() =>
          setDraft({ minPrice: "", maxPrice: "", minSizeSqm: "", maxSizeSqm: "" })
        }
        hasActiveFilters={hasActiveFilters}
      />

      {error ? (
        <EmptyState
          icon={LandPlot}
          title="Couldn't load listings"
          description={error.message ?? "Check that the backend is running, then retry."}
        />
      ) : isLoading && listings.length === 0 ? (
        <ListingGridSkeleton />
      ) : listings.length === 0 ? (
        <EmptyState
          icon={LandPlot}
          title={region ? `No land in ${region} yet` : "No listings match"}
          description="Try widening your filters, or check back soon — new plots are added all the time."
        />
      ) : (
        <>
          <ListingGrid listings={listings} />
          <Pagination
            page={page}
            limit={limit}
            total={total}
            onPage={(p) => setParam("page", p > 1 ? String(p) : undefined, false)}
          />
        </>
      )}
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<ListingGridSkeleton />}>
      <BrowseContent />
    </Suspense>
  );
}
