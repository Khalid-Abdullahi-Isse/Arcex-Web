import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export const WIZARD_STEPS = ["Details", "Photos", "Documents", "Review & Submit"];

export function WizardStepper({
  current,
  action,
}: {
  current: number;
  action?: ReactNode;
}) {
  const label = WIZARD_STEPS[current - 1] ?? WIZARD_STEPS[0];
  const progress = `${(current / WIZARD_STEPS.length) * 100}%`;

  return (
    <div className="border-y border-pf-border-subtle bg-pf-bg-surface px-5 py-2">
      <div className="mx-auto w-full max-w-[720px]">
        <div className="mb-1.5 flex items-center justify-between gap-4 text-[14px]">
          <span className="text-pf-text-secondary">Step {current} of 4</span>
          <div className="flex items-center gap-6">
            <span
              className={cn(
                "text-right font-semibold",
                current === 4 ? "text-pf-accent" : "text-pf-text-primary",
              )}
            >
              {label}
            </span>
            {action}
          </div>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-pf-bg-elevated">
          <div
            className="h-full rounded-full bg-pf-accent transition-[width] duration-300"
            style={{ width: progress }}
          />
        </div>
      </div>
    </div>
  );
}
