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

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
