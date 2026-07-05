import Link from "next/link";
import { Logo } from "@/components/layout/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-pf-bg-base px-4 text-center">
      <Logo size="lg" />
      <p className="text-[72px] font-medium leading-none text-pf-text-primary">404</p>
      <p className="max-w-[340px] text-[14px] text-pf-text-secondary">
        This plot doesn&apos;t exist — or it was sold and taken off the map.
      </p>
      <Link
        href="/"
        className="mt-2 flex h-8 items-center rounded-lg border border-pf-border-accent bg-pf-accent-subtle px-4 text-[14px] font-medium text-pf-accent transition-colors hover:bg-pf-accent/15"
      >
        Back to browse
      </Link>
    </div>
  );
}
