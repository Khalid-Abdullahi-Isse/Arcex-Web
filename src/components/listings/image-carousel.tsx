"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ListingImage } from "@/components/listings/listing-image";
import type { ListingImage as ListingImageType } from "@/types/api";
import { cn } from "@/lib/utils";

export function ImageCarousel({
  images,
  title,
}: {
  images: ListingImageType[];
  title: string;
}) {
  const sorted = images.slice().sort((a, b) => a.order - b.order);
  const [index, setIndex] = useState(0);
  const count = sorted.length;
  const current = sorted[Math.min(index, count - 1)];

  if (count === 0) {
    return (
      <ListingImage alt={title} className="aspect-[4/3] w-full rounded-xl border border-pf-border-default" />
    );
  }

  return (
    <div className="space-y-2">
      <div className="group relative overflow-hidden rounded-xl border border-pf-border-default">
        <ListingImage
          key={current.id}
          src={current.url}
          alt={`${title} — photo ${index + 1}`}
          className="aspect-[4/3] w-full"
        />
        {count > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => setIndex((i) => (i - 1 + count) % count)}
              className="absolute left-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white opacity-0 backdrop-blur-sm transition-opacity duration-150 hover:bg-black/55 group-hover:opacity-100"
            >
              <ChevronLeft size={17} strokeWidth={2} />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => setIndex((i) => (i + 1) % count)}
              className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white opacity-0 backdrop-blur-sm transition-opacity duration-150 hover:bg-black/55 group-hover:opacity-100"
            >
              <ChevronRight size={17} strokeWidth={2} />
            </button>
            <span className="absolute bottom-2 right-2 rounded-md bg-black/45 px-2 py-0.5 text-[12px] font-medium text-white backdrop-blur-sm">
              {index + 1} / {count}
            </span>
          </>
        ) : null}
      </div>
      {count > 1 ? (
        <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
          {sorted.map((image, i) => (
            <button
              key={image.id}
              type="button"
              aria-label={`Photo ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "shrink-0 overflow-hidden rounded-lg border transition-all duration-150",
                i === index
                  ? "border-pf-accent"
                  : "border-transparent opacity-60 hover:opacity-100",
              )}
            >
              <ListingImage src={image.url} alt="" className="size-16" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
