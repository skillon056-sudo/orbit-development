"use server";

import { prisma } from "@/lib/prisma";
import { INTENT, ALL_SLOT_VALUES } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export type ConsultationInput = {
  templateId?: string | null;
  templateTitle: string;
  category: string;
  basePrice: number;
  intent: string;
  whatsappNumber: string; // may include country code + spaces
  preferredDate: string; // YYYY-MM-DD
  preferredTime: string; // HH:MM
  projectMessage?: string;
};

type Result = { ok: true } | { ok: false; error: string };

// Asia/Kolkata "today" as YYYY-MM-DD (en-CA formats as ISO date).
function todayYMD(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

// Public endpoint — validate everything server-side (never trust the client).
export async function createConsultation(input: ConsultationInput): Promise<Result> {
  try {
    const intent =
      input.intent === INTENT.SERIOUS
        ? INTENT.SERIOUS
        : input.intent === INTENT.INFORMATION_ONLY
          ? INTENT.INFORMATION_ONLY
          : "";
    if (!intent) return { ok: false, error: "Please choose whether you're serious or just looking for information." };

    const digits = (input.whatsappNumber || "").replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15)
      return { ok: false, error: "Please enter a valid WhatsApp number with country code." };
    const whatsappNumber = "+" + digits;

    const date = input.preferredDate || "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { ok: false, error: "Please select a valid meeting date." };
    if (date < todayYMD()) return { ok: false, error: "Please select a date that isn't in the past." };

    if (!ALL_SLOT_VALUES.includes(input.preferredTime))
      return { ok: false, error: "Please select a valid meeting time." };

    const templateTitle = (input.templateTitle || "").trim().slice(0, 200);
    if (!templateTitle) return { ok: false, error: "Missing template information." };

    // keep templateId only if it still exists; the title snapshot is preserved regardless
    let templateId: string | null = null;
    if (input.templateId) {
      const exists = await prisma.template.findUnique({
        where: { id: input.templateId },
        select: { id: true },
      });
      templateId = exists ? input.templateId : null;
    }

    await prisma.consultationRequest.create({
      data: {
        templateId,
        templateTitle,
        category: (input.category || "").slice(0, 40),
        basePrice: Number.isFinite(input.basePrice) ? input.basePrice : 0,
        intent,
        whatsappNumber,
        preferredDate: date,
        preferredTime: input.preferredTime,
        projectMessage: (input.projectMessage || "").slice(0, 1000),
        status: "NEW",
      },
    });

    revalidatePath("/admin/leads");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    console.error("createConsultation failed:", e);
    return { ok: false, error: "Something went wrong on our side. Please try again." };
  }
}
