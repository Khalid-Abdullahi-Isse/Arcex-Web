"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import { toast } from "sonner";
import { CheckCircle2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { api, isApiError } from "@/lib/api";
import type { Listing } from "@/types/api";

export function OwnerActions({ listing }: { listing: Listing }) {
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const refresh = () =>
    Promise.all([
      mutate(`/listings/${listing.id}`),
      mutate("/users/me/listings"),
    ]);

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-pf-border-default bg-pf-bg-surface p-3">
      <p className="mr-auto text-[13px] font-medium text-pf-text-secondary">
        You own this listing
      </p>
      <Button
        variant="outline"
        size="sm"
        className="border"
        render={
          <Link href={`/listings/${listing.id}/edit`}>
            <Pencil size={13} strokeWidth={1.75} data-icon="inline-start" />
            Edit
          </Link>
        }
      />
      {listing.status !== "SOLD" ? (
        <ConfirmDialog
          title="Mark as sold?"
          description="The listing will be archived and hidden from public browse. This can't be undone from the app."
          confirmLabel="Mark sold"
          onConfirm={async () => {
            try {
              await api.patch(`/listings/${listing.id}/sold`);
              await refresh();
              toast.success("Marked as sold");
            } catch (err) {
              toast.error(isApiError(err) ? err.message : "Couldn't mark as sold");
            }
          }}
          trigger={
            <Button variant="secondary" size="sm">
              <CheckCircle2 size={13} strokeWidth={1.75} data-icon="inline-start" />
              Mark sold
            </Button>
          }
        />
      ) : null}
      <ConfirmDialog
        destructive
        title="Delete this listing?"
        description="This permanently removes the listing along with its photos and documents."
        confirmLabel="Delete"
        onConfirm={async () => {
          try {
            await api.delete(`/listings/${listing.id}`);
            await mutate("/users/me/listings");
            toast.success("Listing deleted");
            router.push("/my-ads");
          } catch (err) {
            toast.error(isApiError(err) ? err.message : "Couldn't delete listing");
          }
        }}
        trigger={
          <Button variant="destructive" size="sm">
            <Trash2 size={13} strokeWidth={1.75} data-icon="inline-start" />
            Delete
          </Button>
        }
      />
    </div>
  );
}
