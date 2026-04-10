const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded bg-zinc-200 ${className ?? ""}`} />
);

export default Skeleton;
