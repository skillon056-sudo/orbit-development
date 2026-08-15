import { prisma } from "./prisma";
import { STATUS, type Category } from "./constants";

type Template = Awaited<ReturnType<typeof prisma.template.findMany>>[number];
type Client = Awaited<ReturnType<typeof prisma.client.findMany>>[number];

// Frontend data access. All wrapped so a DB outage degrades to empty lists
// instead of throwing a server-side exception that white-screens the page.

export async function getPublishedTemplates(category?: Category): Promise<Template[]> {
  try {
    return await prisma.template.findMany({
      where: { status: STATUS.PUBLISHED, ...(category ? { category } : {}) },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
  } catch (e) {
    console.error("getPublishedTemplates failed — check DATABASE_URL:", e);
    return [];
  }
}

export async function getTemplateBySlug(slug: string): Promise<Template | null> {
  try {
    return await prisma.template.findUnique({ where: { slug } });
  } catch (e) {
    console.error("getTemplateBySlug failed:", e);
    return null;
  }
}

export async function getEnabledClients(): Promise<Client[]> {
  try {
    return await prisma.client.findMany({
      where: { enabled: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
  } catch (e) {
    console.error("getEnabledClients failed — check DATABASE_URL:", e);
    return [];
  }
}
