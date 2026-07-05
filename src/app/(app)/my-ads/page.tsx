"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LandPlot, Plus } from "lucide-react";
import { ListingGrid } from "@/components/listings/listing-grid";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { ListingGridSkeleton } from "@/components/shared/skeletons";
import { OrbitLoader } from "@/components/shared/orbit-loader";
import { useMyListings } from "@/hooks/use-my-listings";
import { useRequireAuth } from "@/hooks/use-require-auth";
import type { ListingStatus } from "@/types/api";
import { cn } from "@/lib/utils";

const TABS: { key: string; label: string; status: ListingStatus }[] = [
  { key: "pending", label: "Pending", status: "PENDING_REVIEW" },
  { key: "active", label: "Active", status: "APPROVED" },
  { key: "rejected", label: "Rejected", status: "REJECTED" },
  { key: "sold", label: "Sold", status: "SOLD" },
];

const EMPTY_COPY: Record<string, { title: string; description: string }> = {
  pending: {
    title: "Nothing waiting for review",
    description: "Listings you post appear here until an admin approves them.",
  },
  active: {
    title: "No live listings",
    description: "Approved listings show here and in public browse.",
  },
  rejected: {
    title: "No rejected listings",
    description: "If a listing is rejected you'll see the reviewer's note here.",
  },
  sold: {
    title: "Nothing sold yet",
    description: "When a deal closes, mark the listing sold to archive it here.",
  },
};

function MyAdsContent() {
  const { ready } = useRequireAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { listings, isLoading, error } = useMyListings();

  const tabKey = TABS.some((t) => t.key === searchParams.get("tab"))
    ? (searchParams.get("tab") as string)
    : "pending";

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const tab of TABS) {
      map[tab.key] = listings.filter((l) => l.status === tab.status).length;
    }
    return map;
  }, [listings]);

  const visible = useMemo(() => {
    const status = TABS.find((t) => t.key === tabKey)?.status;
    return listings.filter((l) => l.status === status);
  }, [listings, tabKey]);

  if (!ready) return <OrbitLoader />;

  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-pf-text-primary">My ads</h1>
        <Button
          size="sm"
          render={
            <Link href="/sell">
              <Plus size={13} strokeWidth={2} data-icon="inline-start" />
              Post land
            </Link>
          }
        />
      </div>

      <div className="flex gap-1 border-b border-pf-border-subtle">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => router.replace(`${pathname}?tab=${tab.key}`, { scroll: false })}
            className={cn(
              "relative -mb-px flex items-center gap-1.5 px-3 py-2.5 text-[14px] transition-colors",
              tabKey === tab.key
                ? "font-medium text-pf-accent"
                : "text-pf-text-tertiary hover:text-pf-text-primary",
            )}
          >
            {tab.label}
            <span
              className={cn(
                "rounded-md px-1.5 text-[12px]",
                tabKey === tab.key
                  ? "bg-pf-accent/10 text-pf-accent"
                  : "bg-pf-bg-elevated text-pf-text-hint",
              )}
            >
              {counts[tab.key] ?? 0}
            </span>
            {tabKey === tab.key ? (
              <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-pf-accent" />
            ) : null}
          </button>
        ))}
      </div>

      {error ? (
        <EmptyState
          icon={LandPlot}
          title="Couldn't load your ads"
          description={error.message}
        />
      ) : isLoading && listings.length === 0 ? (
        <ListingGridSkeleton count={4} />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={LandPlot}
          title={EMPTY_COPY[tabKey].title}
          description={EMPTY_COPY[tabKey].description}
          action={
            tabKey === "active" || tabKey === "pending" ? (
              <Button
                size="sm"
                variant="outline"
                className="border"
                render={<Link href="/sell">Post land</Link>}
              />
            ) : undefined
          }
        />
      ) : (
        <ListingGrid listings={visible} showStatus />
      )}

      {tabKey === "rejected" && visible.length > 0 ? (
        <div className="space-y-2">
          {visible
            .filter((l) => l.rejectionNote)
            .map((l) => (
              <div
                key={l.id}
                className="rounded-xl border border-pf-danger/30 bg-pf-danger-subtle px-3.5 py-2.5 text-[13px]"
              >
                <Link
                  href={`/listings/${l.id}`}
                  className="font-medium text-pf-text-primary hover:text-pf-accent"
                >
                  {l.title}
                </Link>
                <span className="text-pf-text-secondary"> — {l.rejectionNote}</span>
              </div>
            ))}
        </div>
      ) : null}
    </div>
  );
}

export default function MyAdsPage() {
  return (
    <Suspense fallback={<OrbitLoader />}>
      <MyAdsContent />
    </Suspense>
  );
}
