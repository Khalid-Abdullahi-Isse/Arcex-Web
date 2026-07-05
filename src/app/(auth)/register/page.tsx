"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { PasswordStrength } from "@/components/auth/password-strength";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api, isApiError } from "@/lib/api";
import { registerSchema, type RegisterValues } from "@/lib/validators";
import { useAuthStore } from "@/store/auth";
import type { AuthTokens, User } from "@/types/api";

export default function RegisterPage() {
  const router = useRouter();
  const setTokens = useAuthStore((s) => s.setTokens);
  const setUser = useAuthStore((s) => s.setUser);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", phone: "", email: "", password: "", role: "USER" },
  });

  const password = useWatch({ control: form.control, name: "password" });
  const role = useWatch({ control: form.control, name: "role" });

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    try {
      const tokens = await api.post<AuthTokens>("/auth/register", values);
      setTokens(tokens.accessToken, tokens.refreshToken);
      const me = await api.get<User>("/users/me");
      setUser(me);
      router.replace("/");
    } catch (err) {
      if (isApiError(err)) {
        const phoneIssue = err.messages.find((m) =>
          m.toLowerCase().includes("phone"),
        );
        if (phoneIssue) {
          form.setError("phone", {
            message: "Enter a valid phone number, e.g. +252611234567",
          });
          return;
        }
        setServerError(err.message);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  });

  return (
    <AuthCard
      wide
      title="Create your account"
      subtitle="List land, or reach sellers directly"
      error={serverError}
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-pf-accent hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" placeholder="Amina Hassan" autoComplete="name" {...form.register("name")} />
          {form.formState.errors.name ? (
            <p className="text-[12px] text-pf-danger">{form.formState.errors.name.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+252 61 xxx xxxx"
            autoComplete="tel"
            {...form.register("phone")}
          />
          <p className="text-[12px] text-pf-text-hint">
            International format — buyers will contact you on this number.
          </p>
          {form.formState.errors.phone ? (
            <p className="text-[12px] text-pf-danger">{form.formState.errors.phone.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <p className="text-[12px] text-pf-danger">{form.formState.errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              className="pr-10"
              {...form.register("password")}
            />
            <button
              type="button"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-pf-text-hint hover:text-pf-text-secondary"
            >
              {showPassword ? (
                <EyeOff size={15} strokeWidth={1.75} />
              ) : (
                <Eye size={15} strokeWidth={1.75} />
              )}
            </button>
          </div>
          <PasswordStrength password={password} />
          {form.formState.errors.password ? (
            <p className="text-[12px] text-pf-danger">{form.formState.errors.password.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label>Account type</Label>
          <Select
            value={role}
            onValueChange={(value) =>
              form.setValue("role", value as RegisterValues["role"], {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger className="h-10 w-full rounded-lg border text-[14px]">
              <SelectValue placeholder="Choose account type" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border">
              <SelectItem value="USER" className="text-[14px]">
                User
              </SelectItem>
              <SelectItem value="ADMIN" className="text-[14px]">
                Admin
              </SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.role ? (
            <p className="text-[12px] text-pf-danger">{form.formState.errors.role.message}</p>
          ) : null}
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthCard>
  );
}
