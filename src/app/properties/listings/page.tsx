import type { Metadata } from "next";
import PropertyBrowser from "@/components/properties/PropertyBrowser";
import { parsePropertySearchParams } from "@/lib/properties/config";
import { getProperties } from "@/lib/supabase/properties";

export const metadata: Metadata = {
  title: "Property Listings",
  description:
    "Browse AFTAZA property listings with split-screen previews, advanced filtering, and direct lead capture.",
};

export const dynamic = "force-dynamic";

interface ListingsPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export default async function PropertyListingsPage({
  searchParams = {},
}: ListingsPageProps) {
  const filters = parsePropertySearchParams(searchParams);
  const properties = await getProperties(filters, 24);

  return (
    <main data-header-surface="light" className="property-shell min-h-screen">
      <PropertyBrowser
        properties={properties}
        filters={filters}
        initialSelectedSlug={filters.selected || undefined}
      />
    </main>
  );
}
