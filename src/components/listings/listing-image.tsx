"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Plain <img> on purpose: listing photos are a mix of proxied relative
 * paths (/api/backend/uploads/...) and absolute seed URLs.
 */
export function ListingImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-pf-bg-elevated",
          className,
        )}
      >
        <MapPin size={28} strokeWidth={1.25} className="text-pf-text-hint" />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-pf-bg-elevated", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={cn(
          "size-full object-cover",
          loaded ? "img-fade-in" : "opacity-0",
        )}
      />
    </div>
  );
}
