"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  CircleUserRound,
  Heart,
  LandPlot,
  LayoutGrid,
  LogIn,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  PlusCircle,
  ShieldCheck,
  FileCheck2,
  ChartNoAxesCombined,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { useMe } from "@/hooks/use-me";
import { SOMALIA_REGIONS, regionDotColor } from "@/lib/regions";
import { useAuthStore } from "@/store/auth";
import { useUiStore } from "@/store/ui";
import { cn } from "@/lib/utils";

const EXPANDED = 228;
const COLLAPSED = 60;
const HOVER_MEDIA = "(hover: hover) and (pointer: fine)";

function subscribeToHoverMedia(onStoreChange: () => void) {
  const query = window.matchMedia(HOVER_MEDIA);
  query.addEventListener("change", onStoreChange);
  return () => query.removeEventListener("change", onStoreChange);
}

const getCanHover = () => window.matchMedia(HOVER_MEDIA).matches;
const getServerCanHover = () => false;

function NavRow({
  href,
  icon,
  label,
  active,
  expanded,
  dot,
  onClick,
}: {
  href: string;
  icon?: React.ReactNode;
  label: string;
  active: boolean;
  expanded: boolean;
  dot?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex h-9 items-center rounded-lg text-[14px] transition-colors duration-150",
        active
          ? "bg-pf-accent/10 font-medium text-pf-accent"
          : "text-pf-text-secondary hover:bg-pf-bg-elevated hover:text-pf-text-primary",
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center">
        {dot ? (
          <span
            className="size-1.5 rounded-full"
            style={{ background: dot, opacity: active ? 1 : 0.7 }}
          />
        ) : (
          icon
        )}
      </span>
      <span
        className="truncate whitespace-nowrap transition-opacity duration-200"
        style={{ opacity: expanded ? 1 : 0 }}
      >
        {label}
      </span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeRegion = pathname === "/" ? searchParams.get("region") : null;

  const { isLoggedIn, isAdmin, isReady } = useMe();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const pinned = useUiStore((s) => s.sidebarPinned);
  const togglePinned = useUiStore((s) => s.togglePinned);

  const [hovered, setHovered] = useState(false);
  const canHover = useSyncExternalStore(
    subscribeToHoverMedia,
    getCanHover,
    getServerCanHover,
  );

  const expanded = pinned || (canHover && hovered);
  const width = expanded ? EXPANDED : COLLAPSED;

  const mainNav = useMemo(() => {
    const items = [
      { href: "/", icon: <LayoutGrid size={16} strokeWidth={1.75} />, label: "Browse", show: true, active: pathname === "/" && !activeRegion },
      { href: "/favorites", icon: <Heart size={16} strokeWidth={1.75} />, label: "Favorites", show: true, active: pathname === "/favorites" },
      { href: "/sell", icon: <PlusCircle size={16} strokeWidth={1.75} />, label: "Post land", show: isLoggedIn, active: pathname.startsWith("/sell") },
      { href: "/my-ads", icon: <LandPlot size={16} strokeWidth={1.75} />, label: "My ads", show: isLoggedIn, active: pathname === "/my-ads" },
      { href: "/profile", icon: <CircleUserRound size={16} strokeWidth={1.75} />, label: "Profile", show: isLoggedIn, active: pathname === "/profile" },
    ];
    return items.filter((item) => item.show);
  }, [pathname, activeRegion, isLoggedIn]);

  return (
    <aside
      className="sticky top-0 z-40 hidden h-screen shrink-0 overflow-hidden border-r border-pf-border-subtle bg-pf-bg-shell lg:block"
      style={{
        width,
        transition: "width 280ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex h-full flex-col px-2.5 py-3" style={{ width: EXPANDED }}>
        <div className="mb-4 flex h-11 items-center">
          <div className="relative h-10 flex-1 overflow-hidden">
            <span
              className={cn(
                "absolute inset-y-0 left-0 w-9 items-center justify-center",
                expanded ? "hidden" : "flex",
              )}
            >
              <Logo size="md" markOnly />
            </span>
            <span
              className={cn(
                "absolute inset-y-0 left-0 items-center",
                expanded ? "flex" : "hidden",
              )}
            >
              <Logo size="md" />
            </span>
          </div>
          <button
            type="button"
            aria-label={pinned ? "Unpin sidebar" : "Pin sidebar"}
            onClick={togglePinned}
            className={cn(
              "ml-auto mr-1 flex size-7 items-center justify-center rounded-md text-pf-text-tertiary transition-opacity duration-200 hover:bg-pf-bg-elevated hover:text-pf-text-primary",
              expanded ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            {pinned ? (
              <PanelLeftClose size={15} strokeWidth={1.75} />
            ) : (
              <PanelLeftOpen size={15} strokeWidth={1.75} />
            )}
          </button>
        </div>

        <nav className="flex flex-col gap-0.5">
          {mainNav.map((item) => (
            <NavRow
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={item.active}
              expanded={expanded}
            />
          ))}
        </nav>

        {isReady && isAdmin ? (
          <>
            <div className="mx-2 my-3 h-px bg-pf-border-subtle" />
            <p
              className="mb-1 px-2 text-[12px] font-medium text-pf-text-hint transition-opacity duration-200"
              style={{ opacity: expanded ? 1 : 0 }}
            >
              Admin
            </p>
            <nav className="flex flex-col gap-0.5">
              <NavRow
                href="/admin"
                icon={<ShieldCheck size={16} strokeWidth={1.75} />}
                label="Pending listings"
                active={pathname === "/admin"}
                expanded={expanded}
              />
              <NavRow
                href="/admin/documents"
                icon={<FileCheck2 size={16} strokeWidth={1.75} />}
                label="Documents"
                active={pathname === "/admin/documents"}
                expanded={expanded}
              />
              <NavRow
                href="/admin/analytics"
                icon={<ChartNoAxesCombined size={16} strokeWidth={1.75} />}
                label="Analytics"
                active={pathname === "/admin/analytics"}
                expanded={expanded}
              />
            </nav>
          </>
        ) : null}

        <div className="mx-2 my-3 h-px bg-pf-border-subtle" />
        <p
          className="mb-1 px-2 text-[12px] font-medium text-pf-text-hint transition-opacity duration-200"
          style={{ opacity: expanded ? 1 : 0 }}
        >
          Regions
        </p>
        <nav className="scrollbar-hide -mx-0.5 flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-0.5 pb-2">
          {SOMALIA_REGIONS.map((region) => (
            <NavRow
              key={region}
              href={`/?region=${encodeURIComponent(region)}`}
              label={region}
              dot={regionDotColor(region)}
              active={activeRegion === region}
              expanded={expanded}
            />
          ))}
        </nav>

        <div className="mt-auto border-t border-pf-border-subtle pt-2">
          {isLoggedIn ? (
            <button
              type="button"
              onClick={() => {
                clearAuth();
                window.location.assign("/");
              }}
              className="flex h-9 w-full items-center rounded-lg text-[14px] text-pf-text-secondary transition-colors duration-150 hover:bg-pf-danger/10 hover:text-pf-danger"
            >
              <span className="flex size-9 shrink-0 items-center justify-center">
                <LogOut size={16} strokeWidth={1.75} />
              </span>
              <span
                className="whitespace-nowrap transition-opacity duration-200"
                style={{ opacity: expanded ? 1 : 0 }}
              >
                Sign out
              </span>
            </button>
          ) : (
            <NavRow
              href="/login"
              icon={<LogIn size={16} strokeWidth={1.75} />}
              label="Sign in"
              active={false}
              expanded={expanded}
            />
          )}
        </div>
      </div>
    </aside>
  );
}
