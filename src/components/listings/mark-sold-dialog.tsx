"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  markSoldPayload,
  markSoldSchema,
  type MarkSoldInputValues,
  type MarkSoldValues,
} from "@/lib/validators";
import { api, isApiError } from "@/lib/api";
import type { Listing } from "@/types/api";
import { toast } from "sonner";

function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-[12px] text-pf-danger">{message}</p>;
}

export function MarkSoldDialog({
  listing,
  onDone,
}: {
  listing: Listing;
  onDone: () => Promise<unknown>;
}) {
  const [open, setOpen] = useState(false);
  const form = useForm<MarkSoldInputValues, unknown, MarkSoldValues>({
    resolver: zodResolver(markSoldSchema),
    defaultValues: {
      salePrice: String(Number(listing.price)),
      saleDate: todayInputValue(),
      paymentMethod: "",
      documentReference: "",
      buyerName: "",
      buyerPhone: "",
      buyerEmail: "",
    },
  });
  const errors = form.formState.errors;

  const submit = form.handleSubmit(async (values) => {
    try {
      await api.patch(`/listings/${listing.id}/sold`, markSoldPayload(values));
      await onDone();
      toast.success("Marked as sold");
      setOpen(false);
      form.reset({
        salePrice: String(Number(listing.price)),
        saleDate: todayInputValue(),
        paymentMethod: "",
        documentReference: "",
        buyerName: "",
        buyerPhone: "",
        buyerEmail: "",
      });
    } catch (err) {
      toast.error(isApiError(err) ? err.message : "Couldn't mark as sold");
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="secondary" size="sm">
            <CheckCircle2 size={13} strokeWidth={1.75} data-icon="inline-start" />
            Mark sold
          </Button>
        }
      />
      <DialogContent className="border sm:max-w-[520px] sm:rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-[16px] font-medium">
            Mark &quot;{listing.title}&quot; as sold
          </DialogTitle>
          <DialogDescription className="text-[14px]">
            Add the sale details so the listing can be archived with a receipt
            record.
          </DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={submit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="sale-price">Sale price</Label>
              <Input
                id="sale-price"
                type="number"
                inputMode="decimal"
                min="0.01"
                step="0.01"
                {...form.register("salePrice")}
              />
              <FieldError message={errors.salePrice?.message} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sale-date">Sale date</Label>
              <Input
                id="sale-date"
                type="date"
                max={todayInputValue()}
                {...form.register("saleDate")}
              />
              <FieldError message={errors.saleDate?.message} />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="payment-method">Payment method</Label>
              <Input
                id="payment-method"
                placeholder="Cash, bank transfer, mobile money"
                {...form.register("paymentMethod")}
              />
              <FieldError message={errors.paymentMethod?.message} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="document-reference">Document reference</Label>
              <Input
                id="document-reference"
                placeholder="Optional"
                {...form.register("documentReference")}
              />
              <FieldError message={errors.documentReference?.message} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="buyer-name">Buyer name</Label>
            <Input id="buyer-name" {...form.register("buyerName")} />
            <FieldError message={errors.buyerName?.message} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="buyer-phone">Buyer phone</Label>
              <Input
                id="buyer-phone"
                inputMode="tel"
                placeholder="+252..."
                {...form.register("buyerPhone")}
              />
              <FieldError message={errors.buyerPhone?.message} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="buyer-email">Buyer email</Label>
              <Input
                id="buyer-email"
                type="email"
                placeholder="Optional"
                {...form.register("buyerEmail")}
              />
              <FieldError message={errors.buyerEmail?.message} />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={form.formState.isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Marking sold..." : "Mark sold"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
