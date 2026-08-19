"use client";
import { useEffect } from "react";
import { trackStandard } from "@/lib/pixel";

// Fires a ViewContent event once when a template detail page mounts — powers
// retargeting ("people who viewed this template") and value optimization.
export default function PixelView({
  name,
  category,
  value,
}: {
  name: string;
  category: string;
  value: number;
}) {
  useEffect(() => {
    trackStandard("ViewContent", {
      content_name: name,
      content_category: category,
      content_type: "product",
      value,
      currency: "INR",
    });
  }, [name, category, value]);
  return null;
}
