export const CATEGORY = {
  WEBSITE: "WEBSITE",
  APP: "APP",
} as const;
export type Category = keyof typeof CATEGORY;

export const CATEGORY_META: Record<Category, { label: string; slug: string; blurb: string }> = {
  WEBSITE: {
    label: "Website Development",
    slug: "website-development",
    blurb: "Fast, responsive, SEO-ready websites and web apps built on modern stacks.",
  },
  APP: {
    label: "App Development",
    slug: "app-development",
    blurb: "Native and cross-platform mobile apps with smooth, polished experiences.",
  },
};

export const STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  UNPUBLISHED: "UNPUBLISHED",
} as const;
export type Status = keyof typeof STATUS;

// Safe JSON helpers — DB stores arrays as JSON strings.
export function parseList(json: string | null | undefined): string[] {
  if (!json) return [];
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function parseFeatures(
  json: string | null | undefined
): { title: string; desc: string; icon?: string }[] {
  if (!json) return [];
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function formatPrice(rupees: number): string {
  return "₹" + new Intl.NumberFormat("en-IN").format(rupees);
}

// ---------- Consultation / leads ----------
export const INTENT = {
  SERIOUS: "SERIOUS",
  INFORMATION_ONLY: "INFORMATION_ONLY",
} as const;
export type Intent = keyof typeof INTENT;

export const INTENT_META: Record<Intent, { label: string; short: string; desc: string }> = {
  SERIOUS: {
    label: "I'm Serious",
    short: "Serious",
    desc: "I'm interested in purchasing/developing this solution and would like to discuss the project.",
  },
  INFORMATION_ONLY: {
    label: "Just for Information",
    short: "Info only",
    desc: "I'm exploring options and would like more information before making a decision.",
  },
};

export const LEAD_STATUS = {
  NEW: "NEW",
  CONTACTED: "CONTACTED",
  MEETING_SCHEDULED: "MEETING_SCHEDULED",
  IN_PROGRESS: "IN_PROGRESS",
  CONVERTED: "CONVERTED",
  NOT_INTERESTED: "NOT_INTERESTED",
  CLOSED: "CLOSED",
} as const;
export type LeadStatus = keyof typeof LEAD_STATUS;

export const LEAD_STATUS_META: Record<LeadStatus, { label: string; badge: string }> = {
  NEW: { label: "New", badge: "text-blue-300 border-blue-500/40 bg-blue-500/10" },
  CONTACTED: { label: "Contacted", badge: "text-indigo-300 border-indigo-500/40 bg-indigo-500/10" },
  MEETING_SCHEDULED: { label: "Meeting Scheduled", badge: "text-cyan-300 border-cyan-500/40 bg-cyan-500/10" },
  IN_PROGRESS: { label: "In Progress", badge: "text-amber-300 border-amber-500/40 bg-amber-500/10" },
  CONVERTED: { label: "Converted", badge: "text-emerald-300 border-emerald-500/40 bg-emerald-500/10" },
  NOT_INTERESTED: { label: "Not Interested", badge: "text-white/50 border-line bg-white/5" },
  CLOSED: { label: "Closed", badge: "text-white/45 border-line bg-white/5" },
};

// Fixed slots for now. ponytail: hardcoded slots; admin-configurable availability later.
export const TIME_SLOTS: { group: string; slots: { value: string; label: string }[] }[] = [
  {
    group: "Morning",
    slots: ["10:00", "10:30", "11:00", "11:30"].map((v) => ({ value: v, label: to12h(v) })),
  },
  {
    group: "Afternoon",
    slots: ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00"].map((v) => ({ value: v, label: to12h(v) })),
  },
  {
    group: "Evening",
    slots: ["16:00", "16:30", "17:00", "17:30", "18:00"].map((v) => ({ value: v, label: to12h(v) })),
  },
];

export const ALL_SLOT_VALUES = TIME_SLOTS.flatMap((g) => g.slots.map((s) => s.value));

export function to12h(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

// "2026-08-25" -> "25 Aug 2026"
export function formatDateLabel(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  if (!y || !m || !d) return ymd;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d} ${months[m - 1]} ${y}`;
}

// business timezone for display of submission timestamps
export const BUSINESS_TZ = "Asia/Kolkata";
export function formatSubmitted(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: BUSINESS_TZ,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
