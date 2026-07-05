"use client";

import { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api, isApiError } from "@/lib/api";
import type { Listing } from "@/types/api";

export function RejectDialog({
  listing,
  onDone,
}: {
  listing: Listing;
  onDone: () => Promise<unknown>;
}) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const reject = async () => {
    if (!note.trim()) {
      toast.error("Add a note so the seller knows what to fix");
      return;
    }
    setBusy(true);
    try {
      await api.patch(`/admin/listings/${listing.id}/reject`, {
        rejectionNote: note.trim(),
      });
      await onDone();
      toast.success("Listing rejected");
      setOpen(false);
      setNote("");
    } catch (err) {
      toast.error(isApiError(err) ? err.message : "Couldn't reject listing");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="destructive" size="sm">
            <X size={13} strokeWidth={2} data-icon="inline-start" />
            Reject
          </Button>
        }
      />
      <DialogContent className="border sm:max-w-[440px] sm:rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-[16px] font-medium">
            Reject “{listing.title}”
          </DialogTitle>
          <DialogDescription className="text-[14px]">
            The note is shown to the seller so they can fix the problem and
            resubmit.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label htmlFor="rejection-note">Reason</Label>
          <Textarea
            id="rejection-note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Title deed is unreadable — please upload a clearer scan."
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={busy}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={reject} disabled={busy}>
            {busy ? "Rejecting…" : "Reject listing"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
