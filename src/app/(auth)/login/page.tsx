"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, isApiError } from "@/lib/api";
import { loginSchema, normalizePhone, type LoginValues } from "@/lib/validators";
import { useAuthStore } from "@/store/auth";
import type { AuthTokens, User } from "@/types/api";

function safeRedirect(target: string | null): string {
  if (target && target.startsWith("/") && !target.startsWith("//")) return target;
  return "/";
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setTokens = useAuthStore((s) => s.setTokens);
  const setUser = useAuthStore((s) => s.setUser);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    const identifier = values.identifier.trim();
    const payload = identifier.includes("@")
      ? { email: identifier.toLowerCase(), password: values.password }
      : { phone: normalizePhone(identifier), password: values.password };

    try {
      const tokens = await api.post<AuthTokens>("/auth/login", payload);
      setTokens(tokens.accessToken, tokens.refreshToken);
      const me = await api.get<User>("/users/me");
      setUser(me);
      router.replace(safeRedirect(searchParams.get("redirect")));
    } catch (err) {
      if (isApiError(err) && (err.statusCode === 401 || err.statusCode === 400)) {
        setServerError("Invalid email, phone, or password.");
      } else if (isApiError(err)) {
        setServerError(err.message);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  });

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to manage your land listings"
      error={serverError}
      footer={
        <>
          New to acrex?{" "}
          <Link href="/register" className="font-medium text-pf-accent hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="identifier">Email or phone</Label>
          <Input
            id="identifier"
            placeholder="you@example.com or +252 61 xxx xxxx"
            autoComplete="username"
            {...form.register("identifier")}
          />
          {form.formState.errors.identifier ? (
            <p className="text-[12px] text-pf-danger">
              {form.formState.errors.identifier.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
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
          {form.formState.errors.password ? (
            <p className="text-[12px] text-pf-danger">
              {form.formState.errors.password.message}
            </p>
          ) : null}
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
