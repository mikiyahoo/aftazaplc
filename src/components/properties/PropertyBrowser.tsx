"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getListingFilterSummary } from "@/lib/properties/config";
import { cn } from "@/lib/utils";
import type { PropertyRecord, PropertyRouteFilters } from "@/types/property";
import FloatingListingCTA from "./FloatingListingCTA";
import PropertyCard from "./PropertyCard";
import PropertyFilters from "./PropertyFilters";
import PropertyPreviewPanel from "./PropertyPreviewPanel";
import PropertySidebarFilters from "./PropertySidebarFilters";

interface PropertyBrowserProps {
  properties: PropertyRecord[];
  filters: PropertyRouteFilters;
  initialSelectedSlug?: string;
}

export default function PropertyBrowser({
  properties,
  filters,
  initialSelectedSlug,
}: PropertyBrowserProps) {
  const [selectedSlug, setSelectedSlug] = useState(initialSelectedSlug ?? "");

  useEffect(() => {
    if (!selectedSlug) {
      return;
    }

    const selectedExists = properties.some((property) => property.slug === selectedSlug);
    if (!selectedExists) {
      setSelectedSlug("");
    }
  }, [properties, selectedSlug]);

  const selectedProperty = useMemo(
    () => properties.find((property) => property.slug === selectedSlug) ?? null,
    [properties, selectedSlug]
  );

  const summary = useMemo(() => getListingFilterSummary(filters), [filters]);

  return (
    <div className="container-x pb-32 pt-28 md:pt-36">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--property-action-blue)]">
          Property Browser
        </p>
        <h1 className="mt-4 text-4xl font-display font-black tracking-tight text-slate-900 md:text-6xl">
          Discover Verified Property Opportunities
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          Filter by location, property type, price, and living profile while keeping a live preview open.
        </p>
      </div>

      <PropertyFilters
        actionPath="/properties/listings"
        initialFilters={filters}
        className="relative z-50 mt-6 mb-6 property-fade-up"
      />
      <div
        className={cn("mt-8 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]")}
      >
        <PropertySidebarFilters actionPath="/properties/listings" initialFilters={filters} />

        <section className="min-w-0">
          <div className="property-floating-card property-listings-panel p-5 md:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {properties.length} property{properties.length === 1 ? "" : "ies"} available
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  {summary || "Showing the latest active listings across Addis Ababa."}
                </p>
              </div>

            </div>
          </div>

          {properties.length > 0 ? (
            <div className="mt-6 space-y-5">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  variant="list"
                  condensed={Boolean(selectedProperty) && selectedSlug !== property.slug}
                  expanded={selectedSlug === property.slug}
                  active={selectedSlug === property.slug}
                  onSelect={(selected) =>
                    setSelectedSlug((current) => (current === selected.slug ? "" : selected.slug))
                  }
                />
              ))}
            </div>
          ) : (
            <div className="property-floating-card property-listings-panel mt-6 p-10 text-center">
              <h2 className="text-2xl font-display font-bold text-slate-900">No listings match these filters.</h2>
              <p className="mt-4 text-slate-600">
                Clear the advanced filters or broaden the price range to see more inventory.
              </p>
              <Link
                href="/properties/listings"
                className="property-secondary-btn mt-6 inline-flex items-center px-5 py-3 text-sm font-semibold"
              >
                Reset Filters
              </Link>
            </div>
          )}
        </section>

      </div>

      <PropertyPreviewPanel
        property={selectedProperty}
        onClose={() => setSelectedSlug("")}
      />

      <FloatingListingCTA />
    </div>
  );
}
