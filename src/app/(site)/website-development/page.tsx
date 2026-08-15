import type { Metadata } from "next";
import CategoryListing from "@/components/CategoryListing";
import { CATEGORY } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Website Development",
  description: "Premium website and web app templates by Orbit Development.",
};

export default function Page() {
  return <CategoryListing category={CATEGORY.WEBSITE} />;
}
