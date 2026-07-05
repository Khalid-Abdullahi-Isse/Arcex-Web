import { ListingCard } from "@/components/listings/listing-card";
import type { Listing } from "@/types/api";

export function ListingGrid({
  listings,
  showStatus = false,
}: {
  listings: Listing[];
  showStatus?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} showStatus={showStatus} />
      ))}
    </div>
  );
}
