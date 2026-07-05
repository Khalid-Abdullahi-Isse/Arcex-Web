"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { MobileDrawer } from "@/components/layout/mobile-drawer";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { useMe } from "@/hooks/use-me";

export function Navbar() {
  const { isLoggedIn, isReady } = useMe();

  return (
    <header className="sticky top-0 z-30 border-b border-pf-border-subtle bg-pf-bg-shell">
      <div className="flex items-center gap-2 px-4 py-2 md:px-6">
        <div className="flex items-center gap-2 lg:hidden">
          <MobileDrawer />
          <Logo size="md" />
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle />
          {!isReady ? null : isLoggedIn ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="hidden text-pf-text-secondary hover:text-pf-text-primary sm:inline-flex"
                render={
                  <Link href="/sell">
                    <Plus size={14} strokeWidth={2} data-icon="inline-start" />
                    Post land
                  </Link>
                }
              />
              <UserMenu />
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                className="border"
                render={<Link href="/login">Sign in</Link>}
              />
              <Button
                size="sm"
                className="border border-pf-border-accent bg-pf-accent-subtle text-pf-accent hover:bg-pf-accent/15"
                render={<Link href="/register">Sign up</Link>}
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
