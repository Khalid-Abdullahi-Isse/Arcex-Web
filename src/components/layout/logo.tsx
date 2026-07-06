import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({
  size = "md",
  asLink = true,
  markOnly = false,
  className,
}: {
  size?: "sm" | "md" | "lg";
  asLink?: boolean;
  markOnly?: boolean;
  className?: string;
}) {
  const logoSize = {
    sm: { width: 104, height: 33, className: "h-[33px] w-[104px]" },
    md: { width: 124, height: 39, className: "h-[39px] w-[124px]" },
    lg: { width: 152, height: 48, className: "h-[48px] w-[152px]" },
  }[size];

  const iconSize = {
    sm: { width: 28, height: 28, className: "size-[28px]" },
    md: { width: 32, height: 32, className: "size-[32px]" },
    lg: { width: 42, height: 42, className: "size-[42px]" },
  }[size];

  const mark = (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src={markOnly ? "/acrex-icon.svg" : "/acrex-logo.svg"}
        alt="AcreX"
        width={markOnly ? iconSize.width : logoSize.width}
        height={markOnly ? iconSize.height : logoSize.height}
        priority
        className={markOnly ? iconSize.className : logoSize.className}
      />
    </span>
  );

  if (!asLink) return mark;
  return (
    <Link href="/" className="inline-flex items-center outline-none" aria-label="AcreX home">
      {mark}
    </Link>
  );
}
