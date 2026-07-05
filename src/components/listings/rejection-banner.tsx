import { CircleAlert } from "lucide-react";

export function RejectionBanner({ note }: { note: string | null }) {
  return (
    <div className="flex gap-2.5 rounded-xl border border-pf-danger/40 bg-pf-danger-subtle p-3.5">
      <CircleAlert size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-pf-danger" />
      <div>
        <p className="text-[14px] font-medium text-pf-danger">Listing rejected</p>
        <p className="mt-0.5 text-[13px] leading-relaxed text-pf-text-secondary">
          {note || "The listing didn't pass review."} Edit and save the listing to
          resubmit it for review.
        </p>
      </div>
    </div>
  );
}
