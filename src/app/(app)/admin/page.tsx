"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Check, ExternalLink, Inbox } from "lucide-react";
import { RejectDialog } from "@/components/admin/reject-dialog";
import { ListingImage } from "@/components/listings/listing-image";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/shared/avatar";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { RowSkeleton } from "@/components/shared/skeletons";
import { usePendingListings } from "@/hooks/use-admin";
import { api, isApiError } from "@/lib/api";
import { formatMoney, formatSqm, relativeTime } from "@/lib/format";

export default function AdminPendingListingsPage() {
  const { listings, isLoading, error, mutate } = usePendingListings();

  const approve = async (id: string) => {
    try {
      await api.patch(`/admin/listings/${id}/approve`);
      await mutate();
      toast.success("Listing approved — it's now live");
    } catch (err) {
      toast.error(isApiError(err) ? err.message : "Couldn't approve listing");
    }
  };

  return (
    <div className="mx-auto w-full max-w-[900px] space-y-4">
      <div>
        <h1 className="text-pf-text-primary">Pending listings</h1>
        <p className="mt-1 text-[14px] text-pf-text-tertiary">
          Review title documents before approving — verified listings are the
          whole point of AcreX.
        </p>
      </div>

      {error ? (
        <EmptyState icon={Inbox} title="Couldn't load the queue" description={error.message} />
      ) : isLoading && listings.length === 0 ? (
        <RowSkeleton />
      ) : listings.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="Queue is clear"
          description="New listings land here the moment sellers post them."
        />
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => {
            const cover = listing.images
              ?.slice()
              .sort((a, b) => a.order - b.order)[0];
            const docCount = listing.documents?.length ?? 0;
            return (
              <div
                key={listing.id}
                className="flex flex-col gap-3 rounded-xl border border-pf-border-default bg-pf-bg-surface p-3.5 sm:flex-row sm:items-center"
              >
                <ListingImage
                  src={cover?.url}
                  alt={listing.title}
                  className="size-20 shrink-0 rounded-lg"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/listings/${listing.id}`}
                      className="truncate text-[15px] font-medium text-pf-text-primary hover:text-pf-accent"
                    >
                      {listing.title}
                    </Link>
                    <ExternalLink size={12} className="shrink-0 text-pf-text-hint" />
                  </div>
                  <p className="mt-0.5 text-[13px] text-pf-text-tertiary">
                    {formatMoney(listing.price, listing.currency)} · {listing.region}
                    {listing.district ? ` · ${listing.district}` : ""} ·{" "}
                    {formatSqm(listing.sizeSqm)}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[12px] text-pf-text-hint">
                    {listing.seller ? (
                      <span className="flex items-center gap-1.5">
                        <UserAvatar name={listing.seller.name} size="sm" className="size-5 text-[10px]" />
                        {listing.seller.name}
                      </span>
                    ) : null}
                    <span>·</span>
                    <span
                      className={
                        docCount === 0 ? "font-medium text-pf-pending" : undefined
                      }
                    >
                      {docCount} document{docCount === 1 ? "" : "s"}
                    </span>
                    <span>·</span>
                    <span>{relativeTime(listing.createdAt)}</span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <ConfirmDialog
                    title="Approve this listing?"
                    description="It will appear in public browse immediately."
                    confirmLabel="Approve"
                    onConfirm={() => approve(listing.id)}
                    trigger={
                      <Button
                        size="sm"
                        className="border border-pf-success/40 bg-pf-success/10 text-pf-success hover:bg-pf-success/20"
                      >
                        <Check size={13} strokeWidth={2} data-icon="inline-start" />
                        Approve
                      </Button>
                    }
                  />
                  <RejectDialog listing={listing} onDone={() => mutate()} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
