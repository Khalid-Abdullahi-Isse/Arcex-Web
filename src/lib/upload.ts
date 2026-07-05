import { api } from "@/lib/api";
import type {
  DocumentType,
  ListingDocument,
  ListingImage,
  UploadUrlResponse,
} from "@/types/api";

export const IMAGE_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const DOCUMENT_CONTENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const MAX_IMAGES_PER_LISTING = 10;

async function putFile(uploadUrl: string, file: File): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!res.ok) {
    throw new Error(`Upload failed (${res.status})`);
  }
}

export async function uploadImage(
  listingId: string,
  file: File,
  order: number,
): Promise<ListingImage> {
  const { uploadUrl, fileUrl } = await api.post<UploadUrlResponse>(
    `/listings/${listingId}/images/upload-url`,
    { fileName: file.name, contentType: file.type },
  );
  await putFile(uploadUrl, file);
  return api.post<ListingImage>(`/listings/${listingId}/images`, {
    url: fileUrl,
    order,
  });
}

export async function uploadDocument(
  listingId: string,
  type: DocumentType,
  file: File,
): Promise<ListingDocument> {
  const { uploadUrl, fileUrl } = await api.post<UploadUrlResponse>(
    `/listings/${listingId}/documents/upload-url`,
    { type, fileName: file.name, contentType: file.type },
  );
  await putFile(uploadUrl, file);
  return api.post<ListingDocument>(`/listings/${listingId}/documents`, {
    type,
    fileUrl,
  });
}

/**
 * The backend enforces @@unique([listingId, order]) and applies reorder
 * updates sequentially, so writing the final orders directly collides
 * whenever two images swap. Vacate to a high temporary range first, then
 * write the final 0..n-1 sequence.
 */
export async function reorderImages(
  listingId: string,
  imageIdsInOrder: string[],
): Promise<ListingImage[]> {
  await api.patch(`/listings/${listingId}/images/reorder`, {
    images: imageIdsInOrder.map((id, i) => ({ id, order: 1000 + i })),
  });
  return api.patch<ListingImage[]>(`/listings/${listingId}/images/reorder`, {
    images: imageIdsInOrder.map((id, i) => ({ id, order: i })),
  });
}

export function nextImageOrder(existing: { order: number }[]): number {
  return existing.reduce((max, img) => Math.max(max, img.order), -1) + 1;
}
