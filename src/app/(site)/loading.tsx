export default function Loading() {
  return (
    <div className="wrap py-24">
      <div className="mx-auto h-8 w-56 animate-pulse rounded-lg bg-white/5" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass h-72 animate-pulse rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
