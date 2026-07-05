"use client";

import { useState } from "react";
import { MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { UserAvatar } from "@/components/shared/avatar";
import { memberSince, whatsappDigits } from "@/lib/format";
import type { Listing, User } from "@/types/api";

export function ContactSellerCard({
  seller,
  listing,
}: {
  seller: User;
  listing?: Pick<Listing, "title" | "region" | "district">;
}) {
  const [revealed, setRevealed] = useState(false);
  const whatsappText = listing
    ? `Hi ${seller.name}, I saw your AcreX listing "${listing.title}" in ${listing.region}${
        listing.district ? `, ${listing.district}` : ""
      } and would like to know more.`
    : `Hi ${seller.name}, I saw your AcreX listing and would like to know more.`;
  const whatsappHref = `https://wa.me/${whatsappDigits(seller.phone)}?text=${encodeURIComponent(
    whatsappText,
  )}`;

  return (
    <div className="rounded-xl border border-pf-border-default bg-pf-bg-surface p-4">
      <div className="flex items-center gap-3">
        <UserAvatar name={seller.name} size="lg" />
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 truncate text-[15px] font-medium text-pf-text-primary">
            {seller.name}
            {seller.isPhoneVerified ? (
              <ShieldCheck
                size={14}
                strokeWidth={1.75}
                className="shrink-0 text-pf-success"
              />
            ) : null}
          </p>
          <p className="text-[13px] text-pf-text-tertiary">
            Member since {memberSince(seller.createdAt)}
          </p>
        </div>
      </div>

      {revealed ? (
        <div className="mt-4 space-y-2">
          <p className="rounded-lg bg-pf-bg-base/60 px-3 py-2 text-center text-[15px] font-medium tracking-wide text-pf-text-primary">
            {seller.phone}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${seller.phone}`}
              className="flex h-8 items-center justify-center gap-1.5 rounded-lg border border-pf-border-accent bg-pf-accent-subtle text-[14px] font-medium text-pf-accent transition-colors hover:bg-pf-accent/15"
            >
              <Phone size={14} strokeWidth={1.75} />
              Call
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 items-center justify-center gap-1.5 rounded-lg border border-pf-success/40 text-[14px] font-medium text-pf-success transition-colors hover:bg-pf-success/10"
              style={{ background: "var(--pf-success-subtle)" }}
            >
              <MessageCircle size={14} strokeWidth={1.75} />
              WhatsApp
            </a>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="mt-4 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg text-[14px] font-medium text-white transition-all duration-100 active:scale-[0.98]"
          style={{ background: "var(--pf-accent-default)" }}
        >
          <Phone size={14} strokeWidth={1.75} />
          Show contact
        </button>
      )}
    </div>
  );
}
