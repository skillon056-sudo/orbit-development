import type { Metadata } from "next";
import CategoryListing from "@/components/CategoryListing";
import { CATEGORY } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "App Development",
  description: "Premium mobile app templates by Orbit Development.",
};

export default function Page() {
  return <CategoryListing category={CATEGORY.APP} />;
}
