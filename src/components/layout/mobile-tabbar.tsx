"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CircleUserRound,
  Heart,
  LandPlot,
  LayoutGrid,
  LogIn,
  Plus,
} from "lucide-react";
import { useMe } from "@/hooks/use-me";
import { cn } from "@/lib/utils";

function Tab({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 transition-colors duration-150",
        active ? "bg-pf-accent/10 text-pf-accent" : "text-pf-text-hint",
      )}
    >
      <span className={cn("transition-transform duration-150", active && "scale-110")}>
        {icon}
      </span>
      <span className="text-[11px] font-medium">{label}</span>
    </Link>
  );
}

export function MobileTabbar() {
  const pathname = usePathname();
  const { isLoggedIn, isReady } = useMe();

  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-pf-border-subtle bg-pf-bg-shell/80 backdrop-blur-xl lg:hidden">
      <div className="flex items-center gap-1 px-3 py-1.5">
        <Tab
          href="/"
          icon={<LayoutGrid size={19} strokeWidth={pathname === "/" ? 2 : 1.75} />}
          label="Browse"
          active={pathname === "/"}
        />
        <Tab
          href="/favorites"
          icon={<Heart size={19} strokeWidth={pathname === "/favorites" ? 2 : 1.75} />}
          label="Saved"
          active={pathname === "/favorites"}
        />
        <Link
          href={isLoggedIn || !isReady ? "/sell" : "/login?redirect=%2Fsell"}
          aria-label="Post land"
          className="mx-1 flex size-11 shrink-0 -translate-y-2 items-center justify-center rounded-full text-white shadow-lg transition-transform active:scale-90"
          style={{ background: "var(--pf-accent-default)" }}
        >
          <Plus size={20} strokeWidth={2.25} />
        </Link>
        {isLoggedIn ? (
          <>
            <Tab
              href="/my-ads"
              icon={<LandPlot size={19} strokeWidth={pathname === "/my-ads" ? 2 : 1.75} />}
              label="My ads"
              active={pathname === "/my-ads"}
            />
            <Tab
              href="/profile"
              icon={<CircleUserRound size={19} strokeWidth={pathname === "/profile" ? 2 : 1.75} />}
              label="Profile"
              active={pathname === "/profile"}
            />
          </>
        ) : (
          <>
            <Tab
              href="/login"
              icon={<LogIn size={19} strokeWidth={1.75} />}
              label="Sign in"
              active={pathname === "/login"}
            />
            <div className="flex-1" />
          </>
        )}
      </div>
    </nav>
  );
}
