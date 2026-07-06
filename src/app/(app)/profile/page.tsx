"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LogOut, Moon, ShieldCheck, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserAvatar } from "@/components/shared/avatar";
import { OrbitLoader } from "@/components/shared/orbit-loader";
import { useMe } from "@/hooks/use-me";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { api, isApiError } from "@/lib/api";
import { SOMALIA_REGIONS, regionDotColor } from "@/lib/regions";
import { profileSchema, type ProfileValues } from "@/lib/validators";
import { useAuthStore } from "@/store/auth";
import type { User } from "@/types/api";

export default function ProfilePage() {
  const { ready } = useRequireAuth();
  const { user, mutate } = useMe();
  const setUser = useAuthStore((s) => s.setUser);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const { resolvedTheme, setTheme } = useTheme();

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", region: "" },
  });
  const region = useWatch({ control: form.control, name: "region" });

  useEffect(() => {
    if (user) {
      form.reset({ name: user.name, region: user.region ?? "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (!ready || !user) return <OrbitLoader />;

  const save = form.handleSubmit(async (values) => {
    try {
      const updated = await api.patch<User>("/users/me", {
        name: values.name,
        region: values.region || undefined,
      });
      setUser(updated);
      await mutate();
      toast.success("Profile saved");
    } catch (err) {
      toast.error(isApiError(err) ? err.message : "Couldn't save profile");
    }
  });

  return (
    <div className="mx-auto w-full max-w-[560px] space-y-6">
      <h1 className="text-pf-text-primary">Profile</h1>

      <div className="flex items-center gap-4 rounded-xl border border-pf-border-default bg-pf-bg-surface p-4">
        <UserAvatar name={user.name} size="xl" />
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[16px] font-medium text-pf-text-primary">
            {user.name}
            {user.isPhoneVerified ? (
              <ShieldCheck size={15} strokeWidth={1.75} className="text-pf-success" />
            ) : null}
          </p>
          <p className="mt-0.5 text-[13px] text-pf-text-tertiary">{user.phone}</p>
          <p className="text-[13px] text-pf-text-tertiary">{user.email}</p>
        </div>
      </div>

      <form onSubmit={save} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="name">Display name</Label>
          <Input id="name" {...form.register("name")} />
          {form.formState.errors.name ? (
            <p className="text-[12px] text-pf-danger">
              {form.formState.errors.name.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label>Region</Label>
          <Select
            value={region || undefined}
            onValueChange={(value) => form.setValue("region", value ?? "")}
          >
            <SelectTrigger className="h-9 w-full rounded-lg border text-[14px]">
              <SelectValue placeholder="Where are you based?" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border">
              {SOMALIA_REGIONS.map((r) => (
                <SelectItem key={r} value={r} className="text-[14px]">
                  <span
                    className="mr-1 inline-block size-1.5 rounded-full"
                    style={{ background: regionDotColor(r) }}
                  />
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving…" : "Save changes"}
        </Button>
      </form>

      <div className="flex items-center justify-between rounded-xl border border-pf-border-default bg-pf-bg-surface px-4 py-3">
        <div className="flex items-center gap-2.5 text-[14px] text-pf-text-primary">
          {resolvedTheme === "dark" ? (
            <Moon size={15} strokeWidth={1.75} className="text-pf-text-tertiary" />
          ) : (
            <Sun size={15} strokeWidth={1.75} className="text-pf-text-tertiary" />
          )}
          Dark mode
        </div>
        <Switch
          checked={resolvedTheme === "dark"}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        />
      </div>

      <div className="border-t border-pf-border-subtle pt-4">
        <Button
          variant="destructive"
          onClick={() => {
            clearAuth();
            window.location.assign("/");
          }}
        >
          <LogOut size={14} strokeWidth={1.75} data-icon="inline-start" />
          Sign out
        </Button>
        <p className="mt-2 text-[12px] text-pf-text-hint">
          Signing out clears your session on this device.
        </p>
      </div>
    </div>
  );
}
