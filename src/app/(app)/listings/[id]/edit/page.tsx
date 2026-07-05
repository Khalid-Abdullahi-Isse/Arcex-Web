"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CircleAlert, MapPin } from "lucide-react";
import { ListingForm } from "@/components/listings/listing-form";
import { DocumentUploader } from "@/components/sell/document-uploader";
import { PhotoManager } from "@/components/sell/photo-manager";
import { EmptyState } from "@/components/shared/empty-state";
import { OrbitLoader } from "@/components/shared/orbit-loader";
import { useListing } from "@/hooks/use-listing";
import { useMe } from "@/hooks/use-me";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { api, isApiError } from "@/lib/api";
import { listingPayload, type ListingValues } from "@/lib/validators";

export default function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { ready } = useRequireAuth();
  const router = useRouter();
  const { listing, isLoading, mutate } = useListing(ready ? id : null);
  const { user } = useMe();

  if (!ready || (isLoading && !listing)) {
    return <OrbitLoader />;
  }

  if (!listing) {
    return (
      <div className="mx-auto w-full max-w-[640px] pt-8">
        <EmptyState icon={MapPin} title="Listing not found" />
      </div>
    );
  }

  if (user && user.id !== listing.sellerId) {
    return (
      <div className="mx-auto w-full max-w-[640px] pt-8">
        <EmptyState
          icon={CircleAlert}
          title="Not your listing"
          description="You can only edit listings you posted."
        />
      </div>
    );
  }

  const save = async (values: ListingValues) => {
    try {
      await api.patch(`/listings/${listing.id}`, listingPayload(values));
      await mutate();
      toast.success("Saved — listing resubmitted for review");
      router.push("/my-ads?tab=pending");
    } catch (err) {
      toast.error(isApiError(err) ? err.message : "Couldn't save changes");
    }
  };

  return (
    <div className="mx-auto w-full max-w-[760px] space-y-6">
      <div>
        <h1 className="text-pf-text-primary">Edit listing</h1>
        <p className="mt-1 text-[14px] text-pf-text-tertiary">{listing.title}</p>
      </div>

      {listing.status !== "PENDING_REVIEW" ? (
        <div className="flex gap-2.5 rounded-xl border border-pf-status-pending/50 bg-pf-pending/10 p-3.5">
          <CircleAlert
            size={16}
            strokeWidth={1.75}
            className="mt-0.5 shrink-0 text-pf-pending"
          />
          <p className="text-[13px] leading-relaxed text-pf-text-secondary">
            Saving detail changes resubmits the listing for review — it will leave
            public browse until an admin approves it again. Photo and document
            changes don&apos;t trigger a re-review.
          </p>
        </div>
      ) : null}

      <section>
        <h2 className="mb-3 text-pf-text-primary">Details</h2>
        <ListingForm
          initial={listing}
          submitLabel="Save changes"
          busyLabel="Saving…"
          onSubmit={save}
        />
      </section>

      <section>
        <h2 className="mb-3 text-pf-text-primary">Photos</h2>
        <PhotoManager
          listingId={listing.id}
          images={listing.images ?? []}
          onChanged={() => mutate()}
        />
      </section>

      <section>
        <h2 className="mb-3 text-pf-text-primary">Documents</h2>
        <DocumentUploader
          listingId={listing.id}
          documents={listing.documents ?? []}
          onChanged={() => mutate()}
        />
      </section>
    </div>
  );
}
