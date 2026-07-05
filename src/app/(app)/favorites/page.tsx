"use client";

import { Heart } from "lucide-react";
import { ListingGrid } from "@/components/listings/listing-grid";
import { EmptyState } from "@/components/shared/empty-state";
import { ListingGridSkeleton } from "@/components/shared/skeletons";
import { useFavoriteListings } from "@/hooks/use-favorite-listings";

export default function FavoritesPage() {
  const { listings, isEmpty, isReady, isLoading } = useFavoriteListings();

  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-4">
      <div>
        <h1 className="text-pf-text-primary">Favorites</h1>
        <p className="mt-1 text-[14px] text-pf-text-tertiary">
          Saved on this device — favorites aren&apos;t synced to your account yet.
        </p>
      </div>

      {!isReady || (isLoading && listings.length === 0 && !isEmpty) ? (
        <ListingGridSkeleton count={4} />
      ) : isEmpty || listings.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favorites yet"
          description="Tap the heart on any listing to keep it handy here."
        />
      ) : (
        <ListingGrid listings={listings} />
      )}
    </div>
  );
}
