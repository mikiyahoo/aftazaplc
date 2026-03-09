import type {
  PropertyCategory,
  PropertyFilters,
  PropertyInsightPreview,
  PropertyRouteFilters,
  PropertyType,
  PropertyView,
  RealEstateType,
} from "@/types/property";

export const PROPERTY_LOCATION_OPTIONS = ["Bole", "Kazanchis", "Sarbet", "CMC"] as const;

export const PROPERTY_TYPE_OPTIONS: PropertyType[] = [
  "House",
  "Apartment",
  "Villa",
  "Land",
  "Commercial",
];

export const PROPERTY_CATEGORY_OPTIONS: PropertyCategory[] = [
  "Residential",
  "Commercial",
  "Apartments",
];

export const PROPERTY_VIEW_OPTIONS: PropertyView[] = [
  "City View",
  "Garden View",
  "Courtyard",
  "Street Facing",
];

export const REAL_ESTATE_TYPE_OPTIONS: RealEstateType[] = [
  "Houses",
  "Apartments",
  "Commercial",
  "Land",
];

export interface PriceRangeOption {
  label: string;
  value: string;
  min: number;
  max?: number;
}

export const PROPERTY_PRICE_RANGE_OPTIONS: PriceRangeOption[] = [
  { label: "Br 1M - Br 5M", value: "1-5", min: 1_000_000, max: 5_000_000 },
  { label: "Br 5M - Br 15M", value: "5-15", min: 5_000_000, max: 15_000_000 },
  { label: "Br 15M - Br 25M", value: "15-25", min: 15_000_000, max: 25_000_000 },
  { label: "Br 25M - Br 50M", value: "25-50", min: 25_000_000, max: 50_000_000 },
  { label: "Br 50M+", value: "50-plus", min: 50_000_000 },
];

export const LISTING_MIN_PRICE = 5_000_000;
export const LISTING_MAX_PRICE = 50_000_000;

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isPropertyType(value: string): value is PropertyType {
  return PROPERTY_TYPE_OPTIONS.includes(value as PropertyType);
}

function isPropertyCategory(value: string): value is PropertyCategory {
  return PROPERTY_CATEGORY_OPTIONS.includes(value as PropertyCategory);
}

function isPropertyView(value: string): value is PropertyView {
  return PROPERTY_VIEW_OPTIONS.includes(value as PropertyView);
}

function isRealEstateType(value: string): value is RealEstateType {
  return REAL_ESTATE_TYPE_OPTIONS.includes(value as RealEstateType);
}

function parseNumericValue(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function getPriceRangeOption(value?: string) {
  if (!value) {
    return undefined;
  }

  return PROPERTY_PRICE_RANGE_OPTIONS.find((option) => option.value === value);
}

export function mapRealEstateTypeToPropertyType(realEstateType?: RealEstateType | "") {
  switch (realEstateType) {
    case "Houses":
      return "House" as const;
    case "Apartments":
      return "Apartment" as const;
    case "Commercial":
      return "Commercial" as const;
    case "Land":
      return "Land" as const;
    default:
      return undefined;
  }
}

export function parsePropertySearchParams(
  searchParams: Record<string, string | string[] | undefined>
): PropertyRouteFilters {
  const location = getSingleValue(searchParams.location);
  const type = getSingleValue(searchParams.type);
  const category = getSingleValue(searchParams.category);
  const realEstateType = getSingleValue(searchParams.realEstateType);
  const priceRange = getSingleValue(searchParams.priceRange);
  const bedroomsValue = getSingleValue(searchParams.bedrooms);
  const view = getSingleValue(searchParams.view);
  const selected = getSingleValue(searchParams.selected);
  const explicitMin = parseNumericValue(getSingleValue(searchParams.minPrice));
  const explicitMax = parseNumericValue(getSingleValue(searchParams.maxPrice));
  const range = getPriceRangeOption(priceRange);

  const filters: PropertyRouteFilters = {
    location: location && PROPERTY_LOCATION_OPTIONS.includes(location as (typeof PROPERTY_LOCATION_OPTIONS)[number]) ? location : "",
    type: type && isPropertyType(type) ? type : "",
    category: category && isPropertyCategory(category) ? category : "",
    realEstateType: realEstateType && isRealEstateType(realEstateType) ? realEstateType : "",
    priceRange: range?.value,
    selected: selected ?? "",
    view: view && isPropertyView(view) ? view : "",
  };

  const bedrooms = bedroomsValue === "4+" ? 4 : parseNumericValue(bedroomsValue);
  if (bedrooms) {
    filters.bedrooms = bedrooms;
    filters.bedroomsMode = bedroomsValue === "4+" ? "gte" : "exact";
  }

  if (typeof explicitMin === "number") {
    filters.minPrice = explicitMin;
  } else if (range) {
    filters.minPrice = range.min;
  }

  if (typeof explicitMax === "number") {
    filters.maxPrice = explicitMax;
  } else if (range?.max) {
    filters.maxPrice = range.max;
  }

  return filters;
}

export function buildPropertySearchQuery(filters: Partial<PropertyRouteFilters>) {
  const params = new URLSearchParams();

  const appendValue = (key: string, value?: string | number) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    params.set(key, String(value));
  };

  appendValue("location", filters.location);
  appendValue("type", filters.type);
  appendValue("category", filters.category);
  appendValue("realEstateType", filters.realEstateType);
  appendValue("priceRange", filters.priceRange);
  appendValue("minPrice", filters.minPrice);
  appendValue("maxPrice", filters.maxPrice);
  appendValue("selected", filters.selected);
  appendValue("view", filters.view);

  if (typeof filters.bedrooms === "number") {
    appendValue("bedrooms", filters.bedroomsMode === "gte" ? "4+" : filters.bedrooms);
  }

  return params.toString();
}

export function getListingFilterSummary(filters: PropertyFilters) {
  return [
    filters.location,
    filters.type ?? mapRealEstateTypeToPropertyType(filters.realEstateType),
    filters.view,
    typeof filters.minPrice === "number" || typeof filters.maxPrice === "number"
      ? `${formatBirr(filters.minPrice ?? 0)} - ${formatBirr(filters.maxPrice ?? LISTING_MAX_PRICE)}`
      : "",
  ]
    .filter(Boolean)
    .join(" / ");
}

export function formatBirr(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace("ETB", "Br");
}

export function formatCompactBirr(value: number) {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return `Br ${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`;
  }

  return formatBirr(value);
}

export function formatArea(areaSqm: number) {
  return `${areaSqm.toLocaleString("en-US")} m2`;
}

export function formatInsightDate(post: PropertyInsightPreview) {
  return new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
