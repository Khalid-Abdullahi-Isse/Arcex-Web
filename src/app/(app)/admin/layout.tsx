"use client";

import { ShieldAlert } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { OrbitLoader } from "@/components/shared/orbit-loader";
import { useMe } from "@/hooks/use-me";
import { useRequireAuth } from "@/hooks/use-require-auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { ready } = useRequireAuth();
  const { user, isAdmin, isLoading } = useMe();

  if (!ready || (isLoading && !user)) return <OrbitLoader />;

  if (!isAdmin) {
    return (
      <div className="mx-auto w-full max-w-[640px] pt-8">
        <EmptyState
          icon={ShieldAlert}
          title="Admin access required"
          description="This area is for the acrex review team. If you should have access, ask an existing admin to upgrade your account."
        />
      </div>
    );
  }

  return <>{children}</>;
}
