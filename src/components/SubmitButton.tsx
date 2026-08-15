"use client";
import { useFormStatus } from "react-dom";

// Loading state for any server-action form.
export default function SubmitButton({
  children,
  className = "btn btn-primary",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`${className} disabled:opacity-60`}>
      {pending ? "Saving…" : children}
    </button>
  );
}
