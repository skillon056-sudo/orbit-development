"use client";
import { waLink, orderMessage } from "@/lib/whatsapp";

// Opens WhatsApp with a pre-filled, template-specific message.
// Number is passed in from ContactSettings (never hardcoded).
export default function OrderButton({
  templateTitle,
  whatsappNumber,
  className = "btn btn-primary",
  label = "ORDER NOW",
}: {
  templateTitle: string;
  whatsappNumber: string;
  className?: string;
  label?: string;
}) {
  const href = waLink(whatsappNumber, orderMessage(templateTitle));
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.8.8.8-2.8-.2-.3A8 8 0 1 1 12 20zm4.6-6c-.3-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.5 6.5 0 0 1-1.9-1.2 7.3 7.3 0 0 1-1.3-1.7c-.1-.2 0-.4.1-.5l.4-.5c.1-.1.1-.3.2-.4a.5.5 0 0 0 0-.5c0-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a.9.9 0 0 0-.7.3A2.8 2.8 0 0 0 6.5 10a4.9 4.9 0 0 0 1 2.6 11 11 0 0 0 4.3 3.8c.6.3 1.1.4 1.5.5a3.5 3.5 0 0 0 1.6.1c.5-.1 1.5-.6 1.7-1.2a2.1 2.1 0 0 0 .1-1.2c0-.1-.2-.2-.5-.3z" />
      </svg>
      {label}
    </a>
  );
}
