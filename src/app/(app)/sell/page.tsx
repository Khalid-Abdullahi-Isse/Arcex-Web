"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Edit3,
  FileText,
  Info,
  Send,
  X,
} from "lucide-react";
import { ListingForm } from "@/components/listings/listing-form";
import { ListingImage } from "@/components/listings/listing-image";
import { DocumentUploader } from "@/components/sell/document-uploader";
import { PhotoManager } from "@/components/sell/photo-manager";
import { WizardStepper } from "@/components/sell/wizard-stepper";
import { Button } from "@/components/ui/button";
import { OrbitLoader } from "@/components/shared/orbit-loader";
import { useListing } from "@/hooks/use-listing";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { api, isApiError } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import type { Listing, ListingDocument } from "@/types/api";
import { listingPayload, type ListingValues } from "@/lib/validators";

const TITLES: Record<number, string> = {
  1: "",
  2: "Create Listing",
  3: "Post",
  4: "Review Listing",
};

function fileNameFromUrl(url: string) {
  const clean = url.split("?")[0] ?? url;
  const name = clean.split("/").pop() || "Uploaded document";
  return decodeURIComponent(name).replace(/^\d+-/, "");
}

function ReviewSection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-pf-border-subtle bg-pf-bg-surface p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[22px] font-semibold text-pf-text-primary">{title}</h2>
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-2 text-[15px] font-medium text-pf-accent"
        >
          <Edit3 size={16} strokeWidth={2} />
          Edit
        </button>
      </div>
      <div className="mt-4 border-t border-pf-border-subtle pt-4">{children}</div>
    </section>
  );
}

function DocumentReviewRow({ document }: { document: ListingDocument }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-pf-border-subtle bg-pf-bg-elevated p-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-pf-bg-surface text-pf-accent">
        <FileText size={22} strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-medium text-pf-text-primary">
          {fileNameFromUrl(document.fileUrl)}
        </p>
        <p className="mt-1 text-[12px] font-semibold text-pf-text-secondary">Uploaded</p>
      </div>
      <CheckCircle2 size={24} strokeWidth={1.75} className="shrink-0 text-pf-success" />
    </div>
  );
}

function ReviewListing({
  listing,
  setStep,
}: {
  listing: Listing;
  setStep: (step: 1 | 2 | 3 | 4) => void;
}) {
  const photos = listing.images?.slice().sort((a, b) => a.order - b.order) ?? [];
  const documents = listing.documents ?? [];

  return (
    <div className="space-y-6">
      <div className="flex gap-4 rounded-xl border border-pf-border-default bg-pf-bg-elevated px-5 py-4">
        <Info size={24} strokeWidth={1.75} className="mt-1 shrink-0 text-pf-accent" />
        <p className="text-[16px] leading-relaxed text-pf-text-secondary">
          Your listing will be reviewed by our team before it goes live. This usually
          takes 24 hours. Please double-check the details below.
        </p>
      </div>

      <ReviewSection title="Details" onEdit={() => setStep(1)}>
        <div className="space-y-4">
          <div>
            <p className="text-[14px] font-medium text-pf-text-secondary">Title</p>
            <p className="mt-1 text-[18px] text-pf-text-primary">{listing.title}</p>
          </div>
          <div>
            <p className="text-[14px] font-medium text-pf-text-secondary">Price</p>
            <p className="mt-1 text-[28px] font-semibold text-pf-accent">
              {formatMoney(listing.price, listing.currency)}
            </p>
          </div>
          <div>
            <p className="text-[14px] font-medium text-pf-text-secondary">Description</p>
            <p className="mt-1 line-clamp-3 text-[15px] leading-relaxed text-pf-text-primary">
              {listing.description}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <p className="text-[14px] font-medium text-pf-text-secondary">
                Property Type
              </p>
              <p className="mt-2 text-[18px] text-pf-text-primary">Land</p>
            </div>
            <div>
              <p className="text-[14px] font-medium text-pf-text-secondary">Size</p>
              <p className="mt-2 text-[18px] text-pf-text-primary">
                {listing.sizeSqm} sqm
              </p>
            </div>
          </div>
        </div>
      </ReviewSection>

      <ReviewSection title="Photos" onEdit={() => setStep(2)}>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {photos.length > 0 ? (
            photos.map((photo) => (
              <ListingImage
                key={photo.id}
                src={photo.url}
                alt=""
                className="size-28 shrink-0 rounded-lg border border-pf-border-subtle"
              />
            ))
          ) : (
            <p className="text-[14px] text-pf-text-hint">No photos added yet.</p>
          )}
        </div>
      </ReviewSection>

      <ReviewSection title="Documents" onEdit={() => setStep(3)}>
        <div className="space-y-3">
          {documents.length > 0 ? (
            documents.map((document) => (
              <DocumentReviewRow key={document.id} document={document} />
            ))
          ) : (
            <p className="text-[14px] text-pf-text-hint">No documents added yet.</p>
          )}
        </div>
      </ReviewSection>
    </div>
  );
}

export default function SellPage() {
  const { ready } = useRequireAuth();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [listingId, setListingId] = useState<string | null>(null);
  const { listing, mutate } = useListing(listingId);

  if (!ready) {
    return <OrbitLoader />;
  }

  const createListing = async (values: ListingValues) => {
    try {
      const created = await api.post<Listing>("/listings", listingPayload(values));
      setListingId(created.id);
      setStep(2);
      toast.success("Listing created - now add photos");
    } catch (err) {
      toast.error(isApiError(err) ? err.message : "Couldn't create the listing");
    }
  };

  const goBack = () => {
    if (step === 1) {
      router.back();
      return;
    }
    setStep((step - 1) as 1 | 2 | 3 | 4);
  };

  const submitForReview = () => {
    toast.success("Submitted for review - we'll take it from here");
    router.push("/my-ads?tab=pending");
  };

  const primaryLabel =
    step === 2
      ? "Next: Verify Documents"
      : step === 3
        ? "Next: Review & Submit"
        : "Submit for Review";

  return (
    <div className="min-h-[calc(100vh-2rem)] bg-pf-bg-base">
      <header className="sticky top-0 z-20 border-b border-pf-border-subtle bg-pf-bg-base">
        <div className="mx-auto grid h-14 max-w-[720px] grid-cols-[40px_1fr_40px] items-center px-5">
          <button
            type="button"
            aria-label={step === 4 ? "Back" : "Close"}
            onClick={goBack}
            className="flex size-9 items-center justify-center justify-self-start text-pf-text-secondary"
          >
            {step === 4 ? (
              <ArrowLeft size={24} strokeWidth={1.75} />
            ) : (
              <X size={24} strokeWidth={1.8} />
            )}
          </button>
          {TITLES[step] ? (
            <h1 className="text-center text-[22px] font-semibold text-pf-text-primary">
              {TITLES[step]}
            </h1>
          ) : (
            <span />
          )}
          <span className="size-9 justify-self-end" />
        </div>
        <WizardStepper current={step} />
      </header>

      <main className="mx-auto w-full max-w-[720px] px-5 py-5 pb-28">
        {step === 1 ? (
          <ListingForm
            submitLabel="Next: Add Photos"
            busyLabel="Creating..."
            onSubmit={createListing}
          />
        ) : null}

        {step === 2 && listingId ? (
          <PhotoManager
            listingId={listingId}
            images={listing?.images ?? []}
            onChanged={() => mutate()}
          />
        ) : null}

        {step === 3 && listingId ? (
          <DocumentUploader
            listingId={listingId}
            documents={listing?.documents ?? []}
            onChanged={() => mutate()}
          />
        ) : null}

        {step === 4 && listing ? <ReviewListing listing={listing} setStep={setStep} /> : null}

        {step > 1 && !listing ? <OrbitLoader className="flex justify-center py-10" /> : null}
      </main>

      {step > 1 ? (
        <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-pf-border-subtle bg-pf-bg-base px-6 py-5">
          <div className="mx-auto flex max-w-[720px] gap-4">
            {step === 2 ? (
              <Button
                type="button"
                variant="outline"
                className="h-14 w-28 rounded-lg text-[20px] font-medium"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
            ) : null}
            <Button
              type="button"
              className="h-14 flex-1 rounded-xl text-[18px] font-semibold"
              onClick={() => {
                if (step === 2) setStep(3);
                if (step === 3) setStep(4);
                if (step === 4) submitForReview();
              }}
            >
              {primaryLabel}
              {step === 4 ? (
                <Send size={21} strokeWidth={2} data-icon="inline-end" />
              ) : (
                <ArrowRight size={24} strokeWidth={2} data-icon="inline-end" />
              )}
            </Button>
          </div>
        </footer>
      ) : null}
    </div>
  );
}
