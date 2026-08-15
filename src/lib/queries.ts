import { prisma } from "./prisma";
import { STATUS, type Category } from "./constants";

// Frontend data access — only PUBLISHED templates, ordered by admin `order`.
export function getPublishedTemplates(category?: Category) {
  return prisma.template.findMany({
    where: { status: STATUS.PUBLISHED, ...(category ? { category } : {}) },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}

export function getTemplateBySlug(slug: string) {
  return prisma.template.findUnique({ where: { slug } });
}

export function getPublishedSlugs() {
  return prisma.template.findMany({
    where: { status: STATUS.PUBLISHED },
    select: { slug: true },
  });
}

export function getEnabledClients() {
  return prisma.client.findMany({
    where: { enabled: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}
