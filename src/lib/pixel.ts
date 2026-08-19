// Meta (Facebook) Pixel event helpers. No-op until NEXT_PUBLIC_META_PIXEL_ID is set
// and the pixel script has loaded (see components/MetaPixel.tsx).
type FbqParams = Record<string, unknown>;

function fbq(): ((...args: unknown[]) => void) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { fbq?: (...args: unknown[]) => void };
  return w.fbq || null;
}

export function trackStandard(event: string, params?: FbqParams) {
  fbq()?.("track", event, params);
}

export function trackCustom(event: string, params?: FbqParams) {
  fbq()?.("trackCustom", event, params);
}
