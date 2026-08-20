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

// Advanced Matching: attach hashed customer identifiers so Meta can match the lead
// to a Facebook/Instagram user → much stronger optimization & attribution.
// Values are passed raw here; the Pixel normalizes + SHA-256 hashes them in the
// browser before they leave the device. Phone must be digits incl. country code.
export function identifyUser(data: {
  phone?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}) {
  const id = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const f = fbq();
  if (!id || !f) return;

  const ud: Record<string, string> = {};
  if (data.phone) {
    const digits = data.phone.replace(/\D/g, "");
    if (digits) ud.ph = digits;
  }
  if (data.email) ud.em = data.email.trim().toLowerCase();
  if (data.firstName) ud.fn = data.firstName.trim().toLowerCase();
  if (data.lastName) ud.ln = data.lastName.trim().toLowerCase();
  if (Object.keys(ud).length === 0) return;

  // Re-init with advanced matching so it applies to the events that follow.
  f("init", id, ud);
}

export function trackCustom(event: string, params?: FbqParams) {
  fbq()?.("trackCustom", event, params);
}
