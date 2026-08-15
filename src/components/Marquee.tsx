import Image from "next/image";

type ClientLogo = { id: string; name: string; logo: string };

// Seamless infinite marquee: render the list twice, translate track -50%.
// Pauses on hover (CSS), respects reduced-motion, keeps logo proportions.
export default function Marquee({ clients }: { clients: ClientLogo[] }) {
  if (clients.length === 0) return null;
  const loop = [...clients, ...clients];

  return (
    <div className="marquee-mask overflow-hidden py-2">
      <div className="marquee-track gap-6">
        {loop.map((c, i) => (
          <div
            key={`${c.id}-${i}`}
            className="glass flex h-24 w-44 shrink-0 items-center justify-center rounded-xl px-6"
            title={c.name}
          >
            <Image
              src={c.logo}
              alt={c.name}
              width={140}
              height={70}
              className="max-h-14 w-auto object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
