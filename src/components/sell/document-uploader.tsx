"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { BadgeCheck, Camera, FileText, Loader2, UploadCloud } from "lucide-react";
import { DOCUMENT_TYPE_LABELS } from "@/components/listings/documents-list";
import { isApiError } from "@/lib/api";
import { MAX_UPLOAD_BYTES, uploadDocument } from "@/lib/upload";
import type { DocumentType, ListingDocument } from "@/types/api";

const ROWS: {
  type: DocumentType;
  title: string;
  action: string;
  hint: string;
  icon: typeof FileText;
  uploadIcon: typeof UploadCloud;
}[] = [
  {
    type: "TITLE_DEED",
    title: "Title Deed",
    action: "Tap to upload",
    hint: "JPEG, PNG, or PDF up to 10MB",
    icon: FileText,
    uploadIcon: UploadCloud,
  },
  {
    type: "ID_CARD",
    title: "National ID",
    action: "Take a photo",
    hint: "Front and back required",
    icon: BadgeCheck,
    uploadIcon: Camera,
  },
];

const ACCEPT = "application/pdf,image/jpeg,image/png,image/webp";

function DocumentCard({
  type,
  title,
  action,
  hint,
  icon: Icon,
  uploadIcon: UploadIcon,
  listingId,
  existing,
  onChanged,
}: {
  type: DocumentType;
  title: string;
  action: string;
  hint: string;
  icon: typeof FileText;
  uploadIcon: typeof UploadCloud;
  listingId: string;
  existing: ListingDocument[];
  onChanged: () => Promise<unknown>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const pick = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error(`${file.name} is over 10MB`);
      return;
    }
    setBusy(true);
    try {
      await uploadDocument(listingId, type, file);
      await onChanged();
      toast.success(`${DOCUMENT_TYPE_LABELS[type]} uploaded`);
    } catch (err) {
      toast.error(isApiError(err) ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <section className="rounded-xl border border-pf-border-default bg-pf-bg-surface p-5">
      <div className="flex items-center gap-3">
        <Icon size={24} strokeWidth={1.75} className="text-pf-accent" />
        <h2 className="text-[24px] font-semibold text-pf-text-primary">{title}</h2>
        {existing.length > 0 ? (
          <BadgeCheck size={22} strokeWidth={1.75} className="ml-auto text-pf-success" />
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => pick(e.target.files?.[0])}
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className="mt-5 flex min-h-44 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-pf-border-default bg-pf-bg-base px-4 text-center transition-colors hover:border-pf-border-accent disabled:opacity-50"
      >
        <span className="flex size-16 items-center justify-center rounded-full bg-pf-bg-elevated text-pf-accent">
          {busy ? (
            <Loader2 size={28} className="animate-spin" />
          ) : (
            <UploadIcon size={28} strokeWidth={1.75} />
          )}
        </span>
        <span className="mt-5 text-[20px] font-medium text-pf-accent">
          {existing.length > 0 ? "Add another" : action}
        </span>
        <span className="mt-2 text-[15px] font-medium text-pf-text-secondary">
          {existing.length > 0
            ? `${existing.length} file${existing.length === 1 ? "" : "s"} uploaded`
            : hint}
        </span>
      </button>
    </section>
  );
}

export function DocumentUploader({
  listingId,
  documents,
  onChanged,
}: {
  listingId: string;
  documents: ListingDocument[];
  onChanged: () => Promise<unknown>;
}) {
  return (
    <div className="space-y-7">
      <div className="text-center">
        <h1 className="text-[24px] font-semibold text-pf-text-primary">
          Verify Your Listing
        </h1>
        <p className="mt-3 text-[20px] leading-relaxed text-pf-text-secondary">
          This helps us verify your listing and build trust with buyers on the Somali
          Land Market.
        </p>
      </div>

      <div className="space-y-7">
        {ROWS.map((row) => (
          <DocumentCard
            key={row.type}
            {...row}
            listingId={listingId}
            existing={documents.filter((d) => d.type === row.type)}
            onChanged={onChanged}
          />
        ))}
      </div>
    </div>
  );
}
