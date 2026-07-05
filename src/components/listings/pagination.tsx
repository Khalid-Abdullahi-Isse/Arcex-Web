"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  limit,
  total,
  onPage,
}: {
  page: number;
  limit: number;
  total: number;
  onPage: (page: number) => void;
}) {
  const pageCount = Math.max(1, Math.ceil(total / limit));
  if (pageCount <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, Math.min(page - 2, pageCount - 4));
  for (let p = start; p <= Math.min(pageCount, start + 4); p++) pages.push(p);

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
        aria-label="Previous page"
        className="flex size-8 items-center justify-center rounded-lg text-pf-text-secondary transition-colors hover:bg-pf-bg-elevated disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft size={16} strokeWidth={1.75} />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPage(p)}
          className={cn(
            "flex size-8 items-center justify-center rounded-lg text-[14px] transition-colors",
            p === page
              ? "bg-pf-accent/10 font-medium text-pf-accent"
              : "text-pf-text-secondary hover:bg-pf-bg-elevated",
          )}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        disabled={page >= pageCount}
        onClick={() => onPage(page + 1)}
        aria-label="Next page"
        className="flex size-8 items-center justify-center rounded-lg text-pf-text-secondary transition-colors hover:bg-pf-bg-elevated disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronRight size={16} strokeWidth={1.75} />
      </button>
    </div>
  );
}
