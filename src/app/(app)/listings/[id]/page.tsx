"use client";

import { use, useState } from "react";
import { Download, MapPin } from "lucide-react";
import { ContactSellerCard } from "@/components/listings/contact-seller-card";
import { DocumentsList } from "@/components/listings/documents-list";
import { FavoriteButton } from "@/components/listings/favorite-button";
import { ImageCarousel } from "@/components/listings/image-carousel";
import { OwnerActions } from "@/components/listings/owner-actions";
import { RejectionBanner } from "@/components/listings/rejection-banner";
import { SpecsGrid } from "@/components/listings/specs-grid";
import { StatusBadge } from "@/components/listings/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { DetailSkeleton } from "@/components/shared/skeletons";
import { useListing } from "@/hooks/use-listing";
import { useMe } from "@/hooks/use-me";
import { formatMoney, relativeTime } from "@/lib/format";
import { isApiError } from "@/lib/api";

export default function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { listing, isLoading, error } = useListing(id);
  const { user } = useMe();
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  if (isLoading && !listing) {
    return (
      <div className="mx-auto w-full max-w-[1100px]">
        <DetailSkeleton />
      </div>
    );
  }

  if (error || !listing) {
    const notFound = isApiError(error) && error.statusCode === 404;
    return (
      <div className="mx-auto w-full max-w-[640px] pt-8">
        <EmptyState
          icon={MapPin}
          title={notFound ? "Listing not found" : "Couldn't load this listing"}
          description={
            notFound
              ? "It may have been removed by the seller."
              : "Check that the backend is running, then retry."
          }
        />
      </div>
    );
  }

  const isOwner = Boolean(user && user.id === listing.sellerId);

  async function downloadInfoSheet() {
    if (!listing) return;
    setIsDownloadingPdf(true);
    try {
      const response = await fetch(`/api/backend/listings/${listing.id}/info-sheet`);
      if (!response.ok) throw new Error("Unable to download PDF");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `acrex-land-${listing.id}-${slugify(listing.title)}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloadingPdf(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-4">
      {isOwner && listing.status === "REJECTED" ? (
        <RejectionBanner note={listing.rejectionNote} />
      ) : null}
      {isOwner ? <OwnerActions listing={listing} /> : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-5">
          <ImageCarousel images={listing.images ?? []} title={listing.title} />

          <section>
            <h2 className="mb-2 text-pf-text-primary">Details</h2>
            <SpecsGrid listing={listing} />
          </section>

          <section>
            <h2 className="mb-2 text-pf-text-primary">Description</h2>
            <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-pf-text-secondary">
              {listing.description}
            </p>
          </section>

          {isOwner ? (
            <section>
              <h2 className="mb-2 text-pf-text-primary">Verification documents</h2>
              <DocumentsList documents={listing.documents ?? []} />
            </section>
          ) : null}
        </div>

        <div className="space-y-3 lg:sticky lg:top-16 lg:self-start">
          <div className="rounded-xl border border-pf-border-default bg-pf-bg-surface p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[19px] font-medium text-pf-accent">
                {formatMoney(listing.price, listing.currency)}
              </p>
              <div className="flex items-center gap-1.5">
                {isOwner || listing.status !== "APPROVED" ? (
                  <StatusBadge status={listing.status} />
                ) : null}
                <FavoriteButton listingId={listing.id} />
              </div>
            </div>
            <h1 className="mt-1.5 text-pf-text-primary">{listing.title}</h1>
            <p className="mt-1 flex items-center gap-1 text-[13px] text-pf-text-tertiary">
              <MapPin size={12} strokeWidth={1.75} />
              {listing.region}
              {listing.district ? ` · ${listing.district}` : ""}
            </p>
            <p className="mt-2 text-[12px] text-pf-text-hint">
              Posted {relativeTime(listing.createdAt)}
            </p>
            {listing.status === "APPROVED" || listing.status === "SOLD" ? (
              <button
                type="button"
                onClick={downloadInfoSheet}
                disabled={isDownloadingPdf}
                className="mt-4 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-pf-border-accent bg-pf-accent-subtle text-[14px] font-medium text-pf-accent transition-colors hover:bg-pf-accent/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Download size={14} strokeWidth={1.75} />
                {isDownloadingPdf ? "Preparing PDF" : "Download PDF"}
              </button>
            ) : null}
          </div>

          {listing.seller && !isOwner ? (
            <ContactSellerCard seller={listing.seller} listing={listing} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "listing"
  );
}
