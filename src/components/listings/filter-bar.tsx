"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ListingFilters } from "@/hooks/use-listings";

function RangeInput({
  value,
  placeholder,
  onChange,
  suffix,
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  suffix?: string;
}) {
  return (
    <div className="relative">
      <Input
        type="number"
        inputMode="numeric"
        min={0}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-full pr-8 text-[13px] sm:w-28"
      />
      {suffix ? (
        <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-[12px] text-pf-text-hint">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}

export function FilterBar({
  draft,
  onChange,
  onClear,
  hasActiveFilters,
}: {
  draft: Pick<ListingFilters, "minPrice" | "maxPrice" | "minSizeSqm" | "maxSizeSqm">;
  onChange: (patch: Partial<ListingFilters>) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1.5 text-[13px] font-medium text-pf-text-secondary">
        <SlidersHorizontal size={14} strokeWidth={1.75} />
        Filters
      </span>
      <div className="flex items-center gap-1.5">
        <RangeInput
          value={draft.minPrice ?? ""}
          placeholder="Min price"
          suffix="$"
          onChange={(v) => onChange({ minPrice: v })}
        />
        <span className="text-[12px] text-pf-text-hint">–</span>
        <RangeInput
          value={draft.maxPrice ?? ""}
          placeholder="Max price"
          suffix="$"
          onChange={(v) => onChange({ maxPrice: v })}
        />
      </div>
      <div className="flex items-center gap-1.5">
        <RangeInput
          value={draft.minSizeSqm ?? ""}
          placeholder="Min size"
          suffix="m²"
          onChange={(v) => onChange({ minSizeSqm: v })}
        />
        <span className="text-[12px] text-pf-text-hint">–</span>
        <RangeInput
          value={draft.maxSizeSqm ?? ""}
          placeholder="Max size"
          suffix="m²"
          onChange={(v) => onChange({ maxSizeSqm: v })}
        />
      </div>
      {hasActiveFilters ? (
        <button
          type="button"
          onClick={onClear}
          className="flex h-7 items-center gap-1 rounded-lg px-2 text-[13px] text-pf-text-tertiary transition-colors hover:bg-pf-bg-elevated hover:text-pf-text-primary"
        >
          <X size={13} strokeWidth={1.75} />
          Clear
        </button>
      ) : null}
    </div>
  );
}
