"use client";

import { Heart } from "lucide-react";
import { useFavoritesStore } from "@/store/favorites";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  listingId,
  className,
}: {
  listingId: string;
  className?: string;
}) {
  const hasHydrated = useFavoritesStore((s) => s.hasHydrated);
  const isFavorite = useFavoritesStore((s) => s.ids.includes(listingId));
  const toggle = useFavoritesStore((s) => s.toggle);
  const active = hasHydrated && isFavorite;

  return (
    <button
      type="button"
      aria-label={active ? "Remove from favorites" : "Save to favorites"}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(listingId);
      }}
      className={cn(
        "flex size-8 items-center justify-center rounded-lg transition-all duration-150 active:scale-90",
        active
          ? "text-pf-accent"
          : "text-pf-text-hint hover:bg-pf-bg-elevated hover:text-pf-text-secondary",
        className,
      )}
    >
      <Heart
        size={16}
        strokeWidth={1.75}
        fill={active ? "var(--pf-accent-default)" : "none"}
      />
    </button>
  );
}
