import { prisma } from "./prisma";

// Singleton getters that create-on-first-read so the frontend never crashes on a
// fresh DB. If the DB is unreachable (bad/missing DATABASE_URL, cold Neon, etc.)
// we return safe defaults so the site degrades gracefully instead of throwing a
// server-side exception.

const DEFAULT_CONTACT = {
  id: 1,
  whatsappNumber: "",
  whatsappSupportLink: "",
  whatsappChannelLink: "",
  telegramUsername: "",
  telegramLink: "",
  supportMessage: "",
  email: "",
  updatedAt: new Date(),
};

const DEFAULT_HOMEPAGE = {
  id: 1,
  heroTitle: "BUILDING DIGITAL WORLDS",
  heroSubtitle: "ORBIT DEVELOPMENT",
  heroDescription:
    "We design and ship premium websites, mobile apps and custom software — engineered for speed, scale and a cinematic user experience.",
  ctaPrimary: "EXPLORE OUR WORK",
  ctaSecondary: "CONTACT US",
  features: "[]",
  updatedAt: new Date(),
};

export async function getContactSettings() {
  try {
    return await prisma.contactSettings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
  } catch (e) {
    console.error("getContactSettings failed — check DATABASE_URL:", e);
    return DEFAULT_CONTACT;
  }
}

export async function getHomepageSettings() {
  try {
    return await prisma.homepageSettings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
  } catch (e) {
    console.error("getHomepageSettings failed — check DATABASE_URL:", e);
    return DEFAULT_HOMEPAGE;
  }
}
