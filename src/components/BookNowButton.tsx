"use client";
import { useState } from "react";
import BookingModal, { type BookingTemplate } from "./BookingModal";

// Replaces the old direct-to-WhatsApp order button: opens the consultation flow.
export default function BookNowButton({
  template,
  whatsappNumber,
  className = "btn btn-primary",
  label = "ORDER NOW",
}: {
  template: BookingTemplate;
  whatsappNumber: string;
  className?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {label}
      </button>
      {open && <BookingModal template={template} whatsappNumber={whatsappNumber} onClose={() => setOpen(false)} />}
    </>
  );
}
