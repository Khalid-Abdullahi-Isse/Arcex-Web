"use client";

import Link from "next/link";
import {
  CircleUserRound,
  LandPlot,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/shared/avatar";
import { useMe } from "@/hooks/use-me";
import { useAuthStore } from "@/store/auth";

export function UserMenu() {
  const { user, isAdmin } = useMe();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label="Account menu"
            className="rounded-md outline-none transition-transform duration-100 focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-95"
          >
            <UserAvatar name={user.name} size="md" />
          </button>
        }
      />
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-52 rounded-xl border border-pf-border-default bg-pf-bg-surface p-1.5 shadow-lg"
      >
        <DropdownMenuLabel className="px-2 py-1.5">
          <p className="truncate text-[14px] font-medium text-pf-text-primary">
            {user.name}
          </p>
          <p className="truncate text-[12px] font-normal text-pf-text-tertiary">
            {user.phone}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-pf-border-subtle" />
        <DropdownMenuItem
          render={
            <Link href="/profile" className="gap-2 text-[14px]">
              <CircleUserRound size={15} strokeWidth={1.75} />
              Profile
            </Link>
          }
        />
        <DropdownMenuItem
          render={
            <Link href="/my-ads" className="gap-2 text-[14px]">
              <LandPlot size={15} strokeWidth={1.75} />
              My ads
            </Link>
          }
        />
        {isAdmin ? (
          <DropdownMenuItem
            render={
              <Link href="/admin" className="gap-2 text-[14px]">
                <ShieldCheck size={15} strokeWidth={1.75} />
                Admin
              </Link>
            }
          />
        ) : null}
        <DropdownMenuSeparator className="bg-pf-border-subtle" />
        <DropdownMenuItem
          variant="destructive"
          className="gap-2 text-[14px]"
          onClick={() => {
            clearAuth();
            window.location.assign("/");
          }}
        >
          <LogOut size={15} strokeWidth={1.75} />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
