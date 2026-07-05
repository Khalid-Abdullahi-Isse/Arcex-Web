export type UserRole = "USER" | "ADMIN";

export type ListingStatus = "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "SOLD";

export type DocumentType = "TITLE_DEED" | "ID_CARD" | "SURVEY_MAP" | "OTHER";

export interface User {
  id: string;
  phone: string;
  email: string;
  name: string;
  role: UserRole;
  region: string | null;
  isPhoneVerified: boolean;
  createdAt: string;
}

export interface ListingImage {
  id: string;
  listingId: string;
  url: string;
  order: number;
}

export interface ListingDocument {
  id: string;
  listingId: string;
  type: DocumentType;
  fileUrl: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
}

export interface Listing {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  region: string;
  district: string | null;
  sizeSqm: number;
  /** Prisma Decimal — serialized as a string, e.g. "42000.00" */
  price: string;
  currency: string;
  latitude: number | null;
  longitude: number | null;
  status: ListingStatus;
  rejectionNote: string | null;
  createdAt: string;
  images?: ListingImage[];
  documents?: ListingDocument[];
  seller?: User;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UploadUrlResponse {
  uploadUrl: string;
  fileUrl: string;
  method: "PUT";
  contentType: string;
}

export interface PendingDocument extends ListingDocument {
  listing: Listing & { seller: User };
}
