import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-pf-border-default bg-pf-bg-surface p-8 text-center",
        className,
      )}
    >
      <Icon
        size={44}
        strokeWidth={1.25}
        className="mb-4 opacity-20"
        style={{ stroke: "var(--pf-accent-default)" }}
      />
      <p className="text-[17px] font-medium text-pf-text-primary">{title}</p>
      {description ? (
        <p className="mt-1.5 max-w-[320px] text-[14px] text-pf-text-secondary">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
