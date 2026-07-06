"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CircleUserRound,
  Heart,
  LandPlot,
  LayoutGrid,
  LogIn,
  LogOut,
  Menu,
  PlusCircle,
  ShieldCheck,
  FileCheck2,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/layout/logo";
import { useMe } from "@/hooks/use-me";
import { SOMALIA_REGIONS, regionDotColor } from "@/lib/regions";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";

function DrawerLink({
  href,
  icon,
  label,
  active,
  dot,
  onNavigate,
}: {
  href: string;
  icon?: React.ReactNode;
  label: string;
  active?: boolean;
  dot?: string;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex h-9 items-center gap-2.5 rounded-lg px-2 text-[14px] transition-colors",
        active
          ? "bg-pf-accent/10 font-medium text-pf-accent"
          : "text-pf-text-secondary hover:bg-pf-bg-elevated hover:text-pf-text-primary",
      )}
    >
      {dot ? (
        <span className="ml-1 size-1.5 rounded-full" style={{ background: dot }} />
      ) : (
        icon
      )}
      {label}
    </Link>
  );
}

export function MobileDrawer() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { isLoggedIn, isAdmin } = useMe();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <button
            type="button"
            aria-label="Open menu"
            className="flex size-8 items-center justify-center rounded-lg text-pf-text-secondary hover:bg-pf-bg-elevated lg:hidden"
          >
            <Menu size={18} strokeWidth={1.75} />
          </button>
        }
      />
      <SheetContent
        side="left"
        className="w-[270px] border-r border-pf-border-subtle bg-pf-bg-shell p-3 [&>button]:hidden"
      >
        <SheetHeader className="p-0 pb-3">
          <SheetTitle>
            <Logo size="md" asLink={false} />
          </SheetTitle>
        </SheetHeader>
        <div className="scrollbar-hide flex h-full flex-col gap-0.5 overflow-y-auto pb-6">
          <DrawerLink href="/" icon={<LayoutGrid size={16} strokeWidth={1.75} />} label="Browse" active={pathname === "/"} onNavigate={close} />
          <DrawerLink href="/favorites" icon={<Heart size={16} strokeWidth={1.75} />} label="Favorites" active={pathname === "/favorites"} onNavigate={close} />
          {isLoggedIn ? (
            <>
              <DrawerLink href="/sell" icon={<PlusCircle size={16} strokeWidth={1.75} />} label="Post land" active={pathname.startsWith("/sell")} onNavigate={close} />
              <DrawerLink href="/my-ads" icon={<LandPlot size={16} strokeWidth={1.75} />} label="My ads" active={pathname === "/my-ads"} onNavigate={close} />
              <DrawerLink href="/profile" icon={<CircleUserRound size={16} strokeWidth={1.75} />} label="Profile" active={pathname === "/profile"} onNavigate={close} />
            </>
          ) : null}
          {isAdmin ? (
            <>
              <div className="mx-1 my-2 h-px bg-pf-border-subtle" />
              <p className="mb-1 px-2 text-[12px] font-medium text-pf-text-hint">Admin</p>
              <DrawerLink href="/admin" icon={<ShieldCheck size={16} strokeWidth={1.75} />} label="Pending listings" active={pathname === "/admin"} onNavigate={close} />
              <DrawerLink href="/admin/documents" icon={<FileCheck2 size={16} strokeWidth={1.75} />} label="Documents" active={pathname === "/admin/documents"} onNavigate={close} />
            </>
          ) : null}
          <div className="mx-1 my-2 h-px bg-pf-border-subtle" />
          <p className="mb-1 px-2 text-[12px] font-medium text-pf-text-hint">Regions</p>
          {SOMALIA_REGIONS.map((region) => (
            <DrawerLink
              key={region}
              href={`/?region=${encodeURIComponent(region)}`}
              label={region}
              dot={regionDotColor(region)}
              onNavigate={close}
            />
          ))}
          <div className="mx-1 my-2 h-px bg-pf-border-subtle" />
          {isLoggedIn ? (
            <button
              type="button"
              onClick={() => {
                close();
                clearAuth();
                window.location.assign("/");
              }}
              className="flex h-9 items-center gap-2.5 rounded-lg px-2 text-left text-[14px] text-pf-text-secondary hover:bg-pf-danger/10 hover:text-pf-danger"
            >
              <LogOut size={16} strokeWidth={1.75} />
              Sign out
            </button>
          ) : (
            <DrawerLink href="/login" icon={<LogIn size={16} strokeWidth={1.75} />} label="Sign in" onNavigate={close} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
