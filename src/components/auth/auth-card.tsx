import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

export function AuthCard({
  title,
  subtitle,
  error,
  children,
  footer,
  wide = false,
}: {
  title: string;
  subtitle: string;
  error?: string | null;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-pf-border-default bg-pf-bg-surface px-8 py-9",
        wide ? "max-w-[420px]" : "max-w-[400px]",
      )}
    >
      <div className="mb-6 flex justify-center">
        <Logo size="lg" />
      </div>
      <h1 className="text-center text-[21px] font-medium text-pf-text-primary">
        {title}
      </h1>
      <p className="mt-1.5 text-center text-[14px] text-pf-text-tertiary">
        {subtitle}
      </p>
      {error ? (
        <div className="mt-4 rounded-lg border border-pf-danger/40 bg-pf-danger-subtle px-3 py-2.5 text-[13px] text-pf-danger">
          {error}
        </div>
      ) : null}
      <div className="mt-6">{children}</div>
      {footer ? (
        <p className="mt-6 text-center text-[14px] text-pf-text-tertiary">{footer}</p>
      ) : null}
    </div>
  );
}
