"use client";

import { SOMALIA_REGIONS, regionDotColor } from "@/lib/regions";
import { cn } from "@/lib/utils";

export function RegionChips({
  active,
  onSelect,
}: {
  active: string | undefined;
  onSelect: (region: string | undefined) => void;
}) {
  return (
    <div className="scrollbar-hide -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
      <button
        type="button"
        onClick={() => onSelect(undefined)}
        className={cn(
          "flex h-7 shrink-0 items-center rounded-lg border px-3 text-[13px] font-medium transition-colors duration-150",
          !active
            ? "border-pf-border-accent bg-pf-accent-subtle text-pf-accent"
            : "border-pf-border-default text-pf-text-secondary hover:bg-pf-bg-elevated",
        )}
      >
        All Somalia
      </button>
      {SOMALIA_REGIONS.map((region) => (
        <button
          key={region}
          type="button"
          onClick={() => onSelect(region === active ? undefined : region)}
          className={cn(
            "flex h-7 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-[13px] transition-colors duration-150",
            active === region
              ? "border-pf-border-accent bg-pf-accent-subtle font-medium text-pf-accent"
              : "border-pf-border-default text-pf-text-secondary hover:bg-pf-bg-elevated",
          )}
        >
          <span
            className="size-1.5 rounded-full"
            style={{ background: regionDotColor(region) }}
          />
          {region}
        </button>
      ))}
    </div>
  );
}
