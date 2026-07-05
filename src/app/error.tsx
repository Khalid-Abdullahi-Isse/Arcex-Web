"use client";

import { CircleAlert } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-pf-bg-base px-4 text-center">
      <CircleAlert size={40} strokeWidth={1.25} className="text-pf-danger opacity-60" />
      <p className="text-[17px] font-medium text-pf-text-primary">
        Something went wrong
      </p>
      <p className="max-w-[340px] text-[14px] text-pf-text-secondary">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-2 flex h-8 items-center rounded-lg border border-pf-border-default px-4 text-[14px] font-medium text-pf-text-secondary transition-colors hover:bg-pf-bg-elevated hover:text-pf-text-primary"
      >
        Try again
      </button>
    </div>
  );
}
