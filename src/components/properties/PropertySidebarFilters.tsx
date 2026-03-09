"use client";

import { useCallback, useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  buildPropertySearchQuery,
  formatCompactBirr,
  LISTING_MAX_PRICE,
  LISTING_MIN_PRICE,
  PROPERTY_VIEW_OPTIONS,
  REAL_ESTATE_TYPE_OPTIONS,
} from "@/lib/properties/config";
import type { PropertyRouteFilters } from "@/types/property";

const RANGE_STEP = 1_000_000;
const BEDROOM_OPTIONS = ["1", "2", "3", "4+"] as const;

interface PropertySidebarFiltersProps {
  actionPath: string;
  initialFilters: PropertyRouteFilters;
}

export default function PropertySidebarFilters({
  actionPath,
  initialFilters,
}: PropertySidebarFiltersProps) {
  const router = useRouter();
  const [realEstateType, setRealEstateType] = useState(initialFilters.realEstateType ?? "");
  const [view, setView] = useState(initialFilters.view ?? "");
  const [bedrooms, setBedrooms] = useState<string>(
    typeof initialFilters.bedrooms === "number"
      ? initialFilters.bedroomsMode === "gte"
        ? "4+"
        : String(initialFilters.bedrooms)
      : ""
  );
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice ?? LISTING_MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice ?? LISTING_MAX_PRICE);

  const minPercent = useMemo(
    () => ((minPrice - LISTING_MIN_PRICE) / (LISTING_MAX_PRICE - LISTING_MIN_PRICE)) * 100,
    [minPrice]
  );
  const maxPercent = useMemo(
    () => ((maxPrice - LISTING_MIN_PRICE) / (LISTING_MAX_PRICE - LISTING_MIN_PRICE)) * 100,
    [maxPrice]
  );

  const applyFilters = useCallback(() => {
    const nextFilters: Partial<PropertyRouteFilters> = {
      ...initialFilters,
      realEstateType,
      minPrice,
      maxPrice,
      priceRange: "",
      view,
      selected: "",
    };

    if (bedrooms) {
      nextFilters.bedrooms = bedrooms === "4+" ? 4 : Number(bedrooms);
      nextFilters.bedroomsMode = bedrooms === "4+" ? "gte" : "exact";
    } else {
      nextFilters.bedrooms = undefined;
      nextFilters.bedroomsMode = undefined;
    }

    const query = buildPropertySearchQuery(nextFilters);
    router.push(query ? `${actionPath}?${query}` : actionPath);
  }, [actionPath, bedrooms, initialFilters, maxPrice, minPrice, realEstateType, router, view]);

  const clearFilters = useCallback(() => {
    const nextFilters: Partial<PropertyRouteFilters> = {
      location: initialFilters.location,
      type: initialFilters.type,
      category: initialFilters.category,
    };

    const query = buildPropertySearchQuery(nextFilters);
    router.push(query ? `${actionPath}?${query}` : actionPath);
  }, [actionPath, initialFilters.category, initialFilters.location, initialFilters.type, router]);

  return (
    <aside className="property-floating-card property-listings-panel property-fade-up h-fit p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Advanced Filters</p>
          <h3 className="mt-2 text-xl font-display font-bold text-slate-900">Refine Search</h3>
        </div>
        <div className="property-chip inline-flex h-11 w-11 items-center justify-center">
          <SlidersHorizontal size={18} className="text-[var(--property-action-blue)]" />
        </div>
      </div>

      <div className="mt-8 space-y-8">
        <section>
          <p className="text-sm font-semibold text-slate-900">Real Estate Type</p>
          <div className="mt-4 grid gap-3">
            {REAL_ESTATE_TYPE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setRealEstateType((current) => (current === option ? "" : option))}
                className="property-sidebar-toggle flex items-center justify-between px-4 py-3 text-left text-sm text-slate-600"
                aria-pressed={realEstateType === option}
              >
                <span>{option}</span>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                    realEstateType === option
                      ? "border-[var(--property-action-blue)] bg-[var(--property-action-blue)]"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-white" />
                </span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Price Range</p>
            <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
              {formatCompactBirr(minPrice)} - {formatCompactBirr(maxPrice)}
            </span>
          </div>

          <div className="relative mt-6 h-8">
            <div className="property-sidebar-range-rail absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2" />
            <div
              className="property-sidebar-range-fill absolute top-1/2 h-1 -translate-y-1/2 bg-[var(--property-action-blue)]"
              style={{
                left: `${minPercent}%`,
                right: `${100 - maxPercent}%`,
              }}
            />
            <input
              type="range"
              min={LISTING_MIN_PRICE}
              max={LISTING_MAX_PRICE}
              step={RANGE_STEP}
              value={minPrice}
              onChange={(event) =>
                setMinPrice(Math.min(Number(event.target.value), maxPrice - RANGE_STEP))
              }
              className="property-range absolute inset-0"
              aria-label="Minimum price"
            />
            <input
              type="range"
              min={LISTING_MIN_PRICE}
              max={LISTING_MAX_PRICE}
              step={RANGE_STEP}
              value={maxPrice}
              onChange={(event) =>
                setMaxPrice(Math.max(Number(event.target.value), minPrice + RANGE_STEP))
              }
              className="property-range absolute inset-0"
              aria-label="Maximum price"
            />
          </div>
        </section>

        <section>
          <p className="text-sm font-semibold text-slate-900">Room Selection</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {BEDROOM_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setBedrooms((current) => (current === option ? "" : option))}
                className="property-chip px-4 py-2 text-sm font-medium"
                data-active={bedrooms === option}
                aria-pressed={bedrooms === option}
              >
                {option}
              </button>
            ))}
          </div>
        </section>

        <section>
          <p className="text-sm font-semibold text-slate-900">View / Environment</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {PROPERTY_VIEW_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setView((current) => (current === option ? "" : option))}
                className="property-chip px-4 py-2 text-sm font-medium"
                data-active={view === option}
                aria-pressed={view === option}
              >
                {option}
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" onClick={applyFilters} className="property-action-btn px-5 py-3 text-sm font-semibold">
          Apply Filters
        </button>
        <button type="button" onClick={clearFilters} className="property-secondary-btn px-5 py-3 text-sm font-semibold">
          Clear All
        </button>
      </div>
    </aside>
  );
}
