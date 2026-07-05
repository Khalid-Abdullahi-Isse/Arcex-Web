import { formatSqm } from "@/lib/format";
import type { Listing } from "@/types/api";

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-pf-bg-base/60 px-3 py-2.5">
      <p className="text-[12px] text-pf-text-hint">{label}</p>
      <p className="mt-0.5 text-[14px] font-medium text-pf-text-primary">{value}</p>
    </div>
  );
}

export function SpecsGrid({ listing }: { listing: Listing }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <Spec label="Size" value={formatSqm(listing.sizeSqm)} />
      <Spec label="Region" value={listing.region} />
      <Spec label="District" value={listing.district || "—"} />
      <Spec
        label="Coordinates"
        value={
          listing.latitude != null && listing.longitude != null
            ? `${listing.latitude.toFixed(4)}, ${listing.longitude.toFixed(4)}`
            : "—"
        }
      />
    </div>
  );
}
