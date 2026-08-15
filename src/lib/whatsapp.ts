// Dynamic WhatsApp URL + message generation. Number comes from ContactSettings.

export function waLink(rawNumber: string, message: string): string {
  const digits = (rawNumber || "").replace(/\D/g, "");
  const base = digits ? `https://wa.me/${digits}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function orderMessage(templateTitle: string): string {
  return `Hi, I am interested in the "${templateTitle}" template. Please share the complete details and pricing.`;
}
