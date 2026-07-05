export function OrbitLoader({ className }: { className?: string }) {
  return (
    <div className={className ?? "flex min-h-[60vh] items-center justify-center"}>
      <div className="relative size-16">
        <span className="loading-orb loading-orb-1" />
        <span className="loading-orb loading-orb-2" />
        <span className="loading-orb loading-orb-3" />
      </div>
    </div>
  );
}
