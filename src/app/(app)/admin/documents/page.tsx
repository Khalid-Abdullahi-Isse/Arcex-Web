"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Check, ExternalLink, FileText, Inbox, X } from "lucide-react";
import { DOCUMENT_TYPE_LABELS } from "@/components/listings/documents-list";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { RowSkeleton } from "@/components/shared/skeletons";
import { usePendingDocuments } from "@/hooks/use-admin";
import { api, isApiError } from "@/lib/api";
import { relativeTime } from "@/lib/format";

export default function AdminPendingDocumentsPage() {
  const { documents, isLoading, error, mutate } = usePendingDocuments();

  const review = async (documentId: string, approved: boolean) => {
    try {
      await api.patch(`/admin/documents/${documentId}/review`, { approved });
      await mutate();
      toast.success("Marked as reviewed");
    } catch (err) {
      toast.error(isApiError(err) ? err.message : "Couldn't review document");
    }
  };

  return (
    <div className="mx-auto w-full max-w-[900px] space-y-4">
      <div>
        <h1 className="text-pf-text-primary">Document review</h1>
        <p className="mt-1 text-[14px] text-pf-text-tertiary">
          Open each file and confirm it matches the listing. Reviewing only marks
          the document as checked — approve or reject the listing itself from the
          pending queue.
        </p>
      </div>

      {error ? (
        <EmptyState icon={Inbox} title="Couldn't load documents" description={error.message} />
      ) : isLoading && documents.length === 0 ? (
        <RowSkeleton />
      ) : documents.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No documents waiting"
          description="Documents sellers upload appear here until an admin reviews them."
        />
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col gap-3 rounded-xl border border-pf-border-default bg-pf-bg-surface p-3.5 sm:flex-row sm:items-center"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-pf-bg-elevated">
                <FileText size={17} strokeWidth={1.5} className="text-pf-text-tertiary" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-pf-accent/10 px-1.5 py-0.5 text-[12px] font-medium text-pf-accent">
                    {DOCUMENT_TYPE_LABELS[doc.type]}
                  </span>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[13px] font-medium text-pf-text-primary hover:text-pf-accent"
                  >
                    Open file
                    <ExternalLink size={11} strokeWidth={1.75} />
                  </a>
                </div>
                <p className="mt-1 truncate text-[13px] text-pf-text-tertiary">
                  For{" "}
                  <Link
                    href={`/listings/${doc.listing.id}`}
                    className="text-pf-text-secondary underline-offset-2 hover:text-pf-accent hover:underline"
                  >
                    {doc.listing.title}
                  </Link>{" "}
                  · {doc.listing.seller?.name} · {relativeTime(doc.listing.createdAt)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => review(doc.id, true)}
                  className="border border-pf-success/40 bg-pf-success/10 text-pf-success hover:bg-pf-success/20"
                >
                  <Check size={13} strokeWidth={2} data-icon="inline-start" />
                  Looks valid
                </Button>
                <Button size="sm" variant="destructive" onClick={() => review(doc.id, false)}>
                  <X size={13} strokeWidth={2} data-icon="inline-start" />
                  Problem
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
