import { BadgeCheck, FileText, ExternalLink } from "lucide-react";
import type { DocumentType, ListingDocument } from "@/types/api";

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  TITLE_DEED: "Title deed",
  ID_CARD: "ID card",
  SURVEY_MAP: "Survey map",
  OTHER: "Other document",
};

export function DocumentsList({ documents }: { documents: ListingDocument[] }) {
  if (documents.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-pf-border-default p-4 text-center text-[13px] text-pf-text-hint">
        No verification documents uploaded yet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center gap-3 rounded-xl border border-pf-border-default bg-pf-bg-surface px-3.5 py-2.5"
        >
          <FileText size={16} strokeWidth={1.75} className="shrink-0 text-pf-text-tertiary" />
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-medium text-pf-text-primary">
              {DOCUMENT_TYPE_LABELS[doc.type]}
            </p>
            <p className="text-[12px] text-pf-text-hint">
              {doc.reviewedAt ? "Reviewed by admin" : "Awaiting review"}
            </p>
          </div>
          {doc.reviewedAt ? (
            <BadgeCheck size={16} strokeWidth={1.75} className="shrink-0 text-pf-success" />
          ) : null}
          <a
            href={doc.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open document"
            className="flex size-7 shrink-0 items-center justify-center rounded-md text-pf-text-tertiary transition-colors hover:bg-pf-bg-elevated hover:text-pf-text-primary"
          >
            <ExternalLink size={14} strokeWidth={1.75} />
          </a>
        </div>
      ))}
    </div>
  );
}
