import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  size = "md",
  asLink = true,
  className,
}: {
  size?: "sm" | "md" | "lg";
  asLink?: boolean;
  className?: string;
}) {
  const textSize =
    size === "lg" ? "text-[18px]" : size === "md" ? "text-[17px]" : "text-[15px]";

  const mark = (
    <span className={cn("inline-flex items-center gap-1.5", textSize, className)}>
      <span
        className="inline-block size-2 rounded-full"
        style={{ background: "var(--pf-accent-default)" }}
      />
      <span className="font-medium leading-none tracking-tight">
        <span className="text-pf-text-primary">acre</span>
        <span className="text-pf-wordmark">x</span>
      </span>
    </span>
  );

  if (!asLink) return mark;
  return (
    <Link href="/" className="inline-flex items-center outline-none">
      {mark}
    </Link>
  );
}
