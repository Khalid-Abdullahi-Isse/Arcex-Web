import type { ListingStatus } from "@/types/api";

const CONFIG: Record<ListingStatus, { label: string; varName: string }> = {
  PENDING_REVIEW: { label: "Under review", varName: "--pf-status-pending" },
  APPROVED: { label: "Approved", varName: "--pf-success-default" },
  REJECTED: { label: "Rejected", varName: "--pf-danger-default" },
  SOLD: { label: "Sold", varName: "--pf-status-sold" },
};

export function StatusBadge({ status }: { status: ListingStatus }) {
  const { label, varName } = CONFIG[status];
  return (
    <span
      className="inline-flex h-5 items-center rounded-md border px-2 text-[12px] font-medium"
      style={{
        color: `var(${varName})`,
        background: `color-mix(in srgb, var(${varName}) 16%, transparent)`,
        borderColor: `color-mix(in srgb, var(${varName}) 45%, transparent)`,
      }}
    >
      {label}
    </span>
  );
}
