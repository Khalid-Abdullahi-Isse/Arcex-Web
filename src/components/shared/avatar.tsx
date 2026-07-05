import { avatarPair, initials } from "@/lib/avatar";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "size-7 text-[12px] rounded-md",
  md: "size-9 text-[13px] rounded-md",
  lg: "size-14 text-[18px] rounded-lg",
  xl: "size-20 text-[25px] rounded-xl",
} as const;

export function UserAvatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const pair = avatarPair(name);
  return (
    <span
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center font-medium",
        SIZES[size],
        className,
      )}
      style={{
        backgroundColor: `var(--pf-avatar-${pair}-bg)`,
        color: `var(--pf-avatar-${pair}-text)`,
      }}
    >
      {initials(name)}
    </span>
  );
}
