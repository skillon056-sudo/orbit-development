"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  getSession,
  createToken,
  sessionCookieName,
  cookieOptions,
} from "@/lib/auth";
import { saveFile, saveOptionalFile } from "@/lib/storage";
import { slugify, CATEGORY, STATUS } from "@/lib/constants";

async function requireAuth() {
  const s = await getSession();
  if (!s) redirect("/admin/login");
}

// refresh every frontend + admin route after a mutation
function refresh() {
  revalidatePath("/", "layout");
}

// ---- helpers ----
function toList(raw: FormDataEntryValue | null): string {
  // accepts newline- or comma-separated text -> JSON string array
  const text = String(raw || "").trim();
  if (!text) return "[]";
  const items = text
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
  return JSON.stringify(items);
}
function str(fd: FormData, key: string): string {
  return String(fd.get(key) || "").trim();
}
function num(fd: FormData, key: string): number {
  const n = parseInt(String(fd.get(key) || "").replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

// ================= AUTH =================
export async function loginAction(formData: FormData) {
  const username = str(formData, "username");
  const password = str(formData, "password");
  const user = await prisma.adminUser.findUnique({ where: { username } });
  const ok = user && (await bcrypt.compare(password, user.passwordHash));
  if (!ok) redirect("/admin/login?error=1");

  const token = await createToken(username);
  cookies().set(sessionCookieName(), token, cookieOptions());
  redirect("/admin");
}

export async function logoutAction() {
  cookies().delete(sessionCookieName());
  redirect("/admin/login");
}

// ================= TEMPLATES =================
async function readTemplateForm(fd: FormData, existingCover = "", existingShots = "[]") {
  const title = str(fd, "title");
  const slug = slugify(str(fd, "slug") || title);

  // Cover: a pasted image URL wins; otherwise an uploaded file; otherwise keep existing.
  const coverUrl = str(fd, "coverUrl");
  const cover = coverUrl || (await saveOptionalFile(fd.get("cover") as File | null, existingCover, "orbit/covers"));

  // screenshots: keep existing + append uploaded files + append pasted URLs
  const existing = JSON.parse(existingShots || "[]") as string[];
  const files = fd.getAll("screenshots").filter((f): f is File => f instanceof File && f.size > 0);
  const uploaded: string[] = [];
  for (const f of files) uploaded.push(await saveFile(f, "orbit/shots"));
  const shotUrls = str(fd, "screenshotUrls")
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const keep = fd.getAll("keepShots").map(String); // urls admin chose to keep
  const screenshots = JSON.stringify([...existing.filter((u) => keep.includes(u)), ...uploaded, ...shotUrls]);

  const category = str(fd, "category") === CATEGORY.APP ? CATEGORY.APP : CATEGORY.WEBSITE;
  const status = [STATUS.DRAFT, STATUS.PUBLISHED, STATUS.UNPUBLISHED].includes(
    str(fd, "status") as any
  )
    ? str(fd, "status")
    : STATUS.DRAFT;

  return {
    title,
    slug,
    shortDesc: str(fd, "shortDesc"),
    description: str(fd, "description"),
    coverImage: cover,
    screenshots,
    basePrice: num(fd, "basePrice"),
    extraCharges: str(fd, "extraCharges"),
    pricingNotes: str(fd, "pricingNotes"),
    category,
    technologies: toList(fd.get("technologies")),
    techStack: str(fd, "techStack"),
    features: toList(fd.get("features")),
    deliveryInfo: str(fd, "deliveryInfo"),
    supportInfo: str(fd, "supportInfo"),
    status,
    order: num(fd, "order"),
  };
}

export async function createTemplate(formData: FormData) {
  await requireAuth();
  const data = await readTemplateForm(formData);
  if (!data.title || !data.coverImage) redirect("/admin/templates/new?error=missing");

  // ensure unique slug
  let slug = data.slug;
  let n = 1;
  while (await prisma.template.findUnique({ where: { slug } })) slug = `${data.slug}-${++n}`;

  await prisma.template.create({ data: { ...data, slug } });
  refresh();
  redirect("/admin/templates");
}

export async function updateTemplate(id: string, formData: FormData) {
  await requireAuth();
  const current = await prisma.template.findUnique({ where: { id } });
  if (!current) redirect("/admin/templates");
  const data = await readTemplateForm(formData, current.coverImage, current.screenshots);

  // keep slug unique excluding self
  let slug = data.slug;
  let n = 1;
  while (true) {
    const clash = await prisma.template.findUnique({ where: { slug } });
    if (!clash || clash.id === id) break;
    slug = `${data.slug}-${++n}`;
  }

  await prisma.template.update({ where: { id }, data: { ...data, slug } });
  refresh();
  redirect("/admin/templates");
}

export async function deleteTemplate(id: string) {
  await requireAuth();
  await prisma.template.delete({ where: { id } });
  refresh();
}

export async function setTemplateStatus(id: string, status: string) {
  await requireAuth();
  await prisma.template.update({ where: { id }, data: { status } });
  refresh();
}

export async function setTemplateCategory(id: string, category: string) {
  await requireAuth();
  await prisma.template.update({ where: { id }, data: { category } });
  refresh();
}

export async function setTemplateOrder(id: string, order: number) {
  await requireAuth();
  await prisma.template.update({ where: { id }, data: { order } });
  refresh();
}

// ================= CLIENTS =================
export async function createClient(formData: FormData) {
  await requireAuth();
  const name = str(formData, "name");
  const logoUrl = str(formData, "logoUrl");
  const file = formData.get("logo") as File | null;
  const hasFile = file && file.size > 0;
  if (!name || (!logoUrl && !hasFile)) redirect("/admin/clients?error=missing");
  const logo = logoUrl || (await saveFile(file!, "orbit/clients"));
  await prisma.client.create({
    data: { name, logo, order: num(formData, "order"), enabled: true },
  });
  refresh();
  redirect("/admin/clients");
}

export async function updateClient(id: string, formData: FormData) {
  await requireAuth();
  const current = await prisma.client.findUnique({ where: { id } });
  if (!current) redirect("/admin/clients");
  const logoUrl = str(formData, "logoUrl");
  const logo = logoUrl || (await saveOptionalFile(formData.get("logo") as File | null, current.logo, "orbit/clients"));
  await prisma.client.update({
    where: { id },
    data: {
      name: str(formData, "name") || current.name,
      logo,
      order: num(formData, "order"),
      enabled: formData.get("enabled") === "on",
    },
  });
  refresh();
  redirect("/admin/clients");
}

export async function toggleClient(id: string, enabled: boolean) {
  await requireAuth();
  await prisma.client.update({ where: { id }, data: { enabled } });
  refresh();
}

export async function deleteClient(id: string) {
  await requireAuth();
  await prisma.client.delete({ where: { id } });
  refresh();
}

// ================= CONTACT SETTINGS =================
export async function updateContact(formData: FormData) {
  await requireAuth();
  await prisma.contactSettings.upsert({
    where: { id: 1 },
    update: {
      whatsappNumber: str(formData, "whatsappNumber"),
      whatsappSupportLink: str(formData, "whatsappSupportLink"),
      whatsappChannelLink: str(formData, "whatsappChannelLink"),
      telegramUsername: str(formData, "telegramUsername"),
      telegramLink: str(formData, "telegramLink"),
      supportMessage: str(formData, "supportMessage"),
      email: str(formData, "email"),
    },
    create: {
      id: 1,
      whatsappNumber: str(formData, "whatsappNumber"),
      whatsappSupportLink: str(formData, "whatsappSupportLink"),
      whatsappChannelLink: str(formData, "whatsappChannelLink"),
      telegramUsername: str(formData, "telegramUsername"),
      telegramLink: str(formData, "telegramLink"),
      supportMessage: str(formData, "supportMessage"),
      email: str(formData, "email"),
    },
  });
  refresh();
  redirect("/admin/contact?saved=1");
}

// ================= HOMEPAGE SETTINGS =================
export async function updateHomepage(formData: FormData) {
  await requireAuth();
  // features come in as a JSON textarea (advanced) — validate it parses
  let features = str(formData, "features");
  try {
    JSON.parse(features);
  } catch {
    features = "[]";
  }
  await prisma.homepageSettings.upsert({
    where: { id: 1 },
    update: {
      heroTitle: str(formData, "heroTitle"),
      heroSubtitle: str(formData, "heroSubtitle"),
      heroDescription: str(formData, "heroDescription"),
      ctaPrimary: str(formData, "ctaPrimary"),
      ctaSecondary: str(formData, "ctaSecondary"),
      features,
    },
    create: {
      id: 1,
      heroTitle: str(formData, "heroTitle"),
      heroSubtitle: str(formData, "heroSubtitle"),
      heroDescription: str(formData, "heroDescription"),
      ctaPrimary: str(formData, "ctaPrimary"),
      ctaSecondary: str(formData, "ctaSecondary"),
      features,
    },
  });
  refresh();
  redirect("/admin/homepage?saved=1");
}
