"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SOMALIA_REGIONS, regionDotColor } from "@/lib/regions";
import { listingSchema, type ListingValues } from "@/lib/validators";
import type { Listing } from "@/types/api";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-[12px] text-pf-danger">{message}</p>;
}

export function ListingForm({
  initial,
  submitLabel,
  busyLabel,
  onSubmit,
}: {
  initial?: Listing;
  submitLabel: string;
  busyLabel: string;
  onSubmit: (values: ListingValues) => Promise<void>;
}) {
  const form = useForm<ListingValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: initial
      ? {
          title: initial.title,
          description: initial.description,
          region: initial.region,
          district: initial.district ?? "",
          sizeSqm: String(initial.sizeSqm),
          price: String(Number(initial.price)),
          latitude: initial.latitude != null ? String(initial.latitude) : "",
          longitude: initial.longitude != null ? String(initial.longitude) : "",
        }
      : {
          title: "",
          description: "",
          region: "",
          district: "",
          sizeSqm: "",
          price: "",
          latitude: "",
          longitude: "",
        },
  });

  const region = useWatch({ control: form.control, name: "region" });
  const errors = form.formState.errors;

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(async (values) => onSubmit(values))}
      className="space-y-4"
    >
      <section className="rounded-xl border border-pf-border-subtle bg-pf-bg-surface p-4 shadow-sm">
        <h2 className="text-[19px] font-semibold text-pf-text-primary">
          Property Overview
        </h2>
        <div className="mt-2.5 space-y-3 border-t border-pf-border-subtle pt-3">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g. Modern Villa in Hargeisa"
              className="h-11 text-[16px]"
              {...form.register("title")}
            />
            <FieldError message={errors.title?.message} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={5}
              placeholder="Describe the property's key features, condition, and surroundings..."
              className="min-h-24 text-[16px]"
              {...form.register("description")}
            />
            <FieldError message={errors.description?.message} />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-pf-border-subtle bg-pf-bg-surface p-4 shadow-sm">
        <h2 className="text-[19px] font-semibold text-pf-text-primary">Location</h2>
        <div className="mt-2.5 space-y-3 border-t border-pf-border-subtle pt-3">
          <div className="space-y-1.5">
            <Label>Region</Label>
            <Select
              value={region || undefined}
              onValueChange={(value) =>
                form.setValue("region", value ?? "", { shouldValidate: true })
              }
            >
              <SelectTrigger className="h-11 w-full rounded-lg border text-[16px]">
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border">
                {SOMALIA_REGIONS.map((r) => (
                  <SelectItem key={r} value={r} className="text-[14px]">
                    <span
                      className="mr-1 inline-block size-1.5 rounded-full"
                      style={{ background: regionDotColor(r) }}
                    />
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.region?.message} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="district">District/Neighborhood</Label>
            <Input
              id="district"
              placeholder="e.g. Jigjiga Yar"
              className="h-11 text-[16px]"
              {...form.register("district")}
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-pf-border-subtle bg-pf-bg-surface p-4 shadow-sm">
        <h2 className="text-[19px] font-semibold text-pf-text-primary">Size & Value</h2>
        <div className="mt-2.5 space-y-3 border-t border-pf-border-subtle pt-3">
          <div className="space-y-1.5">
            <Label htmlFor="sizeSqm">Size (sqm)</Label>
            <div className="relative">
              <Input
                id="sizeSqm"
                type="number"
                inputMode="numeric"
                min={1}
                placeholder="0"
                className="h-11 pr-12 text-[16px]"
                {...form.register("sizeSqm")}
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[16px] text-pf-text-secondary">
                m²
              </span>
            </div>
            <FieldError message={errors.sizeSqm?.message} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="price">Price (USD)</Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[16px] text-pf-text-secondary">
                $
              </span>
              <Input
                id="price"
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="0"
                className="h-11 pl-9 text-[16px]"
                {...form.register("price")}
              />
            </div>
            <FieldError message={errors.price?.message} />
          </div>
        </div>
      </section>

      <div className="hidden grid-cols-2 gap-4 sm:grid">
        <div className="space-y-1.5">
          <Label htmlFor="latitude">Latitude (optional)</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            placeholder="9.5584"
            {...form.register("latitude")}
          />
          <FieldError message={errors.latitude?.message} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="longitude">Longitude (optional)</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            placeholder="44.0648"
            {...form.register("longitude")}
          />
          <FieldError message={errors.longitude?.message} />
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="h-11 w-full rounded-lg text-[16px] font-semibold"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? busyLabel : submitLabel}
        <ArrowRight size={18} strokeWidth={2} data-icon="inline-end" />
      </Button>
    </form>
  );
}
