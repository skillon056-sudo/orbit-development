import { prisma } from "./prisma";

// Singleton getters that create-on-first-read so the frontend never crashes on a
// fresh DB. All frontend contact/homepage data flows through these.

export async function getContactSettings() {
  return prisma.contactSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
}

export async function getHomepageSettings() {
  return prisma.homepageSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
}
