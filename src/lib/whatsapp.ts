// Dynamic WhatsApp URL + message generation. Number comes from ContactSettings.

export function waLink(rawNumber: string, message: string): string {
  const digits = (rawNumber || "").replace(/\D/g, "");
  const base = digits ? `https://wa.me/${digits}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function orderMessage(templateTitle: string): string {
  return `Hi, I am interested in the "${templateTitle}" template. Please share the complete details and pricing.`;
}

// Follow-up message the CLIENT can send to the admin/support number after booking,
// pre-filled with their full consultation request.
export function consultationMessage(lead: {
  templateTitle: string;
  category: string;
  intentLabel: string;
  whatsappNumber: string;
  dateLabel: string;
  timeLabel: string;
  projectMessage?: string;
}): string {
  return [
    "Hello Orbit Development,",
    "",
    "New Consultation Request",
    "",
    `Template: ${lead.templateTitle}`,
    `Category: ${lead.category}`,
    `Interest: ${lead.intentLabel}`,
    `WhatsApp: ${lead.whatsappNumber}`,
    `Preferred Date: ${lead.dateLabel}`,
    `Preferred Time: ${lead.timeLabel}`,
    lead.projectMessage ? `\nProject Details:\n${lead.projectMessage}` : "",
    "",
    "Please follow up with me regarding the meeting.",
  ]
    .filter((l) => l !== undefined)
    .join("\n");
}
