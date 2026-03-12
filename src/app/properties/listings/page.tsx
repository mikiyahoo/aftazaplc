import type { Metadata } from "next";
import PropertyFilters from "@/components/properties/PropertyFilters";
import { parsePropertySearchParams } from "@/lib/properties/config";
import { getProperties } from "@/lib/supabase/properties";
import PropertiesList from "./PropertiesList";

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
  // Fetch first page (limit 12, offset 0) for initial server-rendered content
  const initialProperties = await getProperties(filters, 12, 0);

  return (
    <main data-header-surface="light" className="property-shell min-h-screen">
      <PropertyFilters 
        actionPath="/properties/listings" 
        initialFilters={filters} 
        className="mt-6 mb-6 property-fade-up"
      />
      <PropertiesList 
        initialProperties={initialProperties} 
        filters={filters} 
      />
    </main>
  );
}
