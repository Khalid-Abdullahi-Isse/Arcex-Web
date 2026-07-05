import { passwordStrength } from "@/lib/validators";

export function PasswordStrength({ password }: { password: string }) {
  const score = passwordStrength(password);

  return (
    <div className="mt-2 flex gap-1.5">
      {[1, 2, 3, 4].map((segment) => (
        <span
          key={segment}
          className="h-[3px] flex-1 rounded-[2px] transition-colors duration-200"
          style={{
            background:
              score >= segment
                ? score >= 4
                  ? "var(--pf-success-default)"
                  : "var(--pf-accent-muted)"
                : "var(--pf-border-default)",
          }}
        />
      ))}
    </div>
  );
}
