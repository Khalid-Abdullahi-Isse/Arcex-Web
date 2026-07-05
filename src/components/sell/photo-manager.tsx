"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Info, Loader2, Plus, X } from "lucide-react";
import { ListingImage } from "@/components/listings/listing-image";
import { api, isApiError } from "@/lib/api";
import {
  MAX_IMAGES_PER_LISTING,
  MAX_UPLOAD_BYTES,
  nextImageOrder,
  reorderImages,
  uploadImage,
} from "@/lib/upload";
import type { ListingImage as ListingImageType } from "@/types/api";

export function PhotoManager({
  listingId,
  images,
  onChanged,
}: {
  listingId: string;
  images: ListingImageType[];
  onChanged: () => Promise<unknown>;
}) {
  const sorted = images.slice().sort((a, b) => a.order - b.order);
  const [uploading, setUploading] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const onDrop = useCallback(
    async (accepted: File[]) => {
      const room = MAX_IMAGES_PER_LISTING - sorted.length;
      if (accepted.length > room) {
        toast.error(
          room <= 0
            ? `Maximum ${MAX_IMAGES_PER_LISTING} photos per listing`
            : `Only ${room} more photo${room === 1 ? "" : "s"} allowed`,
        );
        accepted = accepted.slice(0, Math.max(0, room));
      }
      if (accepted.length === 0) return;

      let order = nextImageOrder(sorted);
      for (const file of accepted) {
        setUploading((u) => [...u, file.name]);
        try {
          await uploadImage(listingId, file, order);
          order += 1;
          await onChanged();
        } catch (err) {
          toast.error(
            isApiError(err)
              ? `${file.name}: ${err.message}`
              : `${file.name}: upload failed`,
          );
        } finally {
          setUploading((u) => u.filter((name) => name !== file.name));
        }
      }
    },
    [listingId, sorted, onChanged],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    maxSize: MAX_UPLOAD_BYTES,
    onDropRejected: (rejections) => {
      for (const rejection of rejections) {
        const reason = rejection.errors[0]?.code;
        toast.error(
          reason === "file-too-large"
            ? `${rejection.file.name} is over 10MB`
            : `${rejection.file.name}: use JPEG, PNG or WebP`,
        );
      }
    },
  });

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= sorted.length) return;
    const ids = sorted.map((img) => img.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    setBusy(true);
    try {
      await reorderImages(listingId, ids);
      await onChanged();
    } catch (err) {
      toast.error(isApiError(err) ? err.message : "Couldn't reorder photos");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (imageId: string) => {
    setBusy(true);
    try {
      await api.delete(`/listings/${listingId}/images/${imageId}`);
      await onChanged();
      const remaining = sorted.filter((img) => img.id !== imageId);
      if (remaining.length > 0) {
        await reorderImages(
          listingId,
          remaining.map((img) => img.id),
        );
        await onChanged();
      }
    } catch (err) {
      toast.error(isApiError(err) ? err.message : "Couldn't remove photo");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-semibold text-pf-text-primary">Add Photos</h1>
        <p className="mt-4 text-[20px] leading-relaxed text-pf-text-secondary">
          Upload at least 3 photos to show the boundaries and condition of the land.
          Long-press any photo to drag and reorder.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {sorted.map((image, index) => (
          <div
            key={image.id}
            className="group relative aspect-square overflow-hidden rounded-lg border border-pf-border-default"
          >
            <ListingImage src={image.url} alt="" className="size-full" />
            {index === 0 ? (
              <span className="absolute left-1.5 top-1.5 rounded-md bg-pf-accent px-2 py-1 text-[12px] font-bold uppercase text-white">
                Cover
              </span>
            ) : null}
            <button
              type="button"
              aria-label="Remove photo"
              disabled={busy}
              onClick={() => remove(image.id)}
              className="absolute right-1.5 top-1.5 flex size-8 items-center justify-center rounded-full bg-pf-bg-surface text-pf-text-secondary shadow-sm transition-colors hover:text-pf-danger disabled:opacity-40"
            >
              <X size={17} strokeWidth={2} />
            </button>
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-gradient-to-t from-black/60 to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                aria-label="Move left"
                disabled={busy || index === 0}
                onClick={() => move(index, -1)}
                className="flex size-6 items-center justify-center rounded-md bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 disabled:opacity-40"
              >
                <ArrowLeft size={12} strokeWidth={2} />
              </button>
              <button
                type="button"
                aria-label="Move right"
                disabled={busy || index === sorted.length - 1}
                onClick={() => move(index, 1)}
                className="flex size-6 items-center justify-center rounded-md bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 disabled:opacity-40"
              >
                <ArrowRight size={12} strokeWidth={2} />
              </button>
            </div>
          </div>
        ))}

        {sorted.length < MAX_IMAGES_PER_LISTING ? (
          <div
            {...getRootProps()}
            className={`flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-2 text-center transition-colors ${
              isDragActive
                ? "border-pf-accent bg-pf-accent-subtle"
                : "border-pf-border-default bg-pf-bg-elevated hover:border-pf-accent/50"
            }`}
          >
            <input {...getInputProps()} />
            <span className="flex size-14 items-center justify-center rounded-full bg-pf-bg-surface text-pf-accent shadow-sm">
              <Plus size={28} strokeWidth={1.75} />
            </span>
            <span className="mt-3 text-[15px] font-medium text-pf-text-secondary">
              {isDragActive ? "Drop" : "Add Photo"}
            </span>
          </div>
        ) : null}
      </div>

      {uploading.length > 0 ? (
        <div className="space-y-1.5">
          {uploading.map((name) => (
            <div
              key={name}
              className="flex items-center gap-2 rounded-lg border border-pf-border-default bg-pf-bg-surface px-3 py-2 text-[13px] text-pf-text-secondary"
            >
              <Loader2 size={13} className="animate-spin text-pf-accent" />
              Uploading {name}...
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex gap-3 rounded-xl border border-pf-border-default bg-pf-bg-elevated px-4 py-4">
        <Info size={22} strokeWidth={1.75} className="mt-0.5 shrink-0 text-pf-accent" />
        <p className="text-[15px] leading-relaxed text-pf-text-secondary">
          Listings with 5 or more clear photos receive 3x more inquiries. Ensure
          property boundaries are visible.
        </p>
      </div>
    </div>
  );
}
