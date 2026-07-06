import { z } from "zod";

export function normalizePhone(input: string): string {
  const trimmed = input.trim();
  const prefix = trimmed.startsWith("+") ? "+" : "";
  let value = `${prefix}${trimmed.replace(/\D/g, "")}`;
  if (value.startsWith("00")) value = `+${value.slice(2)}`;
  if (/^252\d{9}$/.test(value)) value = `+${value}`;
  if (/^0\d{8,9}$/.test(value)) value = `+252${value.slice(1)}`;
  if (/^\d{9}$/.test(value)) value = `+252${value}`;
  return value;
}

const phoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .transform(normalizePhone);

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  phone: phoneSchema,
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
});

export type RegisterInputValues = z.input<typeof registerSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, "Email or phone is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginValues = z.infer<typeof loginSchema>;

/**
 * Form fields hold strings (what <input> produces); numeric checks run on
 * the parsed value and conversion to numbers happens when building the API
 * payload (see listingPayload).
 */
const requiredNumeric = (message: string, check: (n: number) => boolean) =>
  z
    .string()
    .min(1, message)
    .refine((v) => Number.isFinite(Number(v)) && check(Number(v)), { message });

const optionalNumeric = (message: string, check: (n: number) => boolean) =>
  z
    .string()
    .optional()
    .refine(
      (v) => !v || (Number.isFinite(Number(v)) && check(Number(v))),
      { message },
    );

export const listingSchema = z.object({
  title: z.string().trim().min(4, "Title must be at least 4 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),
  region: z.string().min(1, "Select a region"),
  district: z.string().trim().optional(),
  sizeSqm: requiredNumeric("Size must be at least 1 m²", (n) => n >= 1),
  price: requiredNumeric("Enter a valid price", (n) => n >= 0),
  latitude: optionalNumeric("Latitude must be between -90 and 90", (n) => n >= -90 && n <= 90),
  longitude: optionalNumeric("Longitude must be between -180 and 180", (n) => n >= -180 && n <= 180),
});

export type ListingFormValues = z.infer<typeof listingSchema>;

/** Convert validated form strings into the exact payload the backend expects. */
export function listingPayload(values: ListingFormValues) {
  return {
    title: values.title,
    description: values.description,
    region: values.region,
    district: values.district?.trim() ? values.district.trim() : undefined,
    sizeSqm: Number(values.sizeSqm),
    price: Number(values.price),
    latitude: values.latitude?.trim() ? Number(values.latitude) : undefined,
    longitude: values.longitude?.trim() ? Number(values.longitude) : undefined,
  };
}

export type ListingValues = z.infer<typeof listingSchema>;

export const markSoldSchema = z.object({
  salePrice: requiredNumeric("Sale price must be at least 0.01", (n) => n >= 0.01),
  saleDate: z
    .string()
    .min(1, "Sale date is required")
    .refine((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return Number.isFinite(date.getTime()) && date <= today;
    }, "Sale date cannot be in the future"),
  paymentMethod: z.string().trim().min(2, "Payment method is required"),
  documentReference: z.string().trim().optional(),
  buyerName: z.string().trim().min(2, "Buyer name must be at least 2 characters"),
  buyerPhone: phoneSchema,
  buyerEmail: z
    .string()
    .trim()
    .toLowerCase()
    .optional()
    .refine((value) => !value || z.email().safeParse(value).success, {
      message: "Enter a valid email",
    }),
});

export type MarkSoldInputValues = z.input<typeof markSoldSchema>;
export type MarkSoldValues = z.infer<typeof markSoldSchema>;

export function markSoldPayload(values: MarkSoldValues) {
  return {
    salePrice: Number(values.salePrice),
    saleDate: values.saleDate,
    paymentMethod: values.paymentMethod.trim(),
    documentReference: values.documentReference?.trim() || undefined,
    buyerName: values.buyerName.trim(),
    buyerPhone: values.buyerPhone,
    buyerEmail: values.buyerEmail?.trim() || undefined,
  };
}

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  region: z.string().optional(),
});

export type ProfileValues = z.infer<typeof profileSchema>;

export function passwordStrength(password: string): number {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  return score;
}
