"use client";

import Link from "next/link";
import { FavoriteButton } from "@/components/listings/favorite-button";
import { ListingImage } from "@/components/listings/listing-image";
import { StatusBadge } from "@/components/listings/status-badge";
import { formatMoney, formatSqm, relativeTime } from "@/lib/format";
import type { Listing } from "@/types/api";

export function ListingCard({
  listing,
  showStatus = false,
}: {
  listing: Listing;
  showStatus?: boolean;
}) {
  const cover = listing.images?.slice().sort((a, b) => a.order - b.order)[0];

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block overflow-hidden rounded-xl border border-pf-border-default bg-pf-bg-surface transition-all duration-150 ease-out hover:border-pf-accent/50 active:scale-[0.98]"
    >
      <div className="relative">
        <ListingImage
          src={cover?.url}
          alt={listing.title}
          className="aspect-[4/3] w-full"
        />
        {listing.status === "SOLD" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/45">
            <span className="rounded-md bg-pf-bg-base/90 px-3 py-1 text-[13px] font-medium text-pf-text-primary">
              Sold
            </span>
          </div>
        ) : null}
        <FavoriteButton
          listingId={listing.id}
          className="absolute right-2 top-2 bg-black/25 text-white backdrop-blur-sm hover:bg-black/40 hover:text-white"
        />
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[16px] font-medium text-pf-accent">
            {formatMoney(listing.price, listing.currency)}
          </p>
          {showStatus ? <StatusBadge status={listing.status} /> : null}
        </div>
        <p className="mt-1 truncate text-[15px] font-medium text-pf-text-primary transition-colors group-hover:text-pf-accent">
          {listing.title}
        </p>
        <p className="mt-0.5 truncate text-[13px] text-pf-text-tertiary">
          {listing.region}
          {listing.district ? ` · ${listing.district}` : ""} · {formatSqm(listing.sizeSqm)}
        </p>
        <p className="mt-1.5 text-[12px] text-pf-text-hint">
          {relativeTime(listing.createdAt)}
        </p>
      </div>
    </Link>
  );
}
