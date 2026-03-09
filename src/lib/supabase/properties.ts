import "server-only";

import { propertySeed } from "@/data/propertySeed";
import { mapRealEstateTypeToPropertyType } from "@/lib/properties/config";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { PropertyFilters, PropertyRecord, PropertyType } from "@/types/property";

const PROPERTY_TABLE = "properties";

function sortByCreatedAtDesc(properties: PropertyRecord[]) {
  return [...properties].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  );
}

function normalizeType(value: unknown): PropertyType {
  const normalized = typeof value === "string" ? value : "";

  switch (normalized) {
    case "House":
    case "Apartment":
    case "Villa":
    case "Land":
    case "Commercial":
      return normalized;
    default:
      return "Apartment";
  }
}

function normalizeProperty(row: Record<string, unknown>): PropertyRecord {
  const location = String(row.location ?? "");
  const neighborhood = String(row.neighborhood ?? location.split(",")[0]?.trim() ?? "Addis Ababa");
  const city = String(row.city ?? "Addis Ababa");
  const gallery = Array.isArray(row.gallery)
    ? row.gallery.map((item) => String(item))
    : Array.isArray(row.images)
      ? row.images.map((item) => String(item))
      : [];

  return {
    id: String(row.id ?? row.slug ?? crypto.randomUUID()),
    slug: String(row.slug ?? ""),
    title: String(row.title ?? row.name ?? "Untitled Property"),
    location,
    neighborhood,
    city,
    type: normalizeType(row.type),
    category:
      row.category === "Residential" || row.category === "Commercial" || row.category === "Apartments"
        ? row.category
        : "Residential",
    price: Number(row.price ?? 0),
    bedrooms: Number(row.bedrooms ?? 0),
    bathrooms: Number(row.bathrooms ?? 0),
    parking: Number(row.parking ?? 0),
    areaSqm: Number(row.area_sqm ?? row.areaSqm ?? 0),
    areaSqft: Number(row.area_sqft ?? row.areaSqft ?? 0),
    shortDescription: String(row.short_description ?? row.shortDescription ?? row.description ?? ""),
    description: String(row.description ?? row.short_description ?? row.shortDescription ?? ""),
    image: String(row.image ?? row.thumbnail ?? "/property/property-1.jpg"),
    heroImage: String(row.hero_image ?? row.heroImage ?? row.image ?? "/property/property-hero.jpg"),
    gallery:
      gallery.length > 0
        ? gallery
        : [String(row.hero_image ?? row.heroImage ?? "/property/property-hero.jpg")],
    viewTags: Array.isArray(row.view_tags)
      ? row.view_tags
          .map((item) => String(item))
          .filter(Boolean) as PropertyRecord["viewTags"]
      : [],
    status: row.status === "inactive" ? "inactive" : "active",
    trustBadges: Array.isArray(row.trust_badges)
      ? row.trust_badges.map((item) => String(item)) as PropertyRecord["trustBadges"]
      : ["Verified Listing"],
    createdAt: String(row.created_at ?? row.createdAt ?? new Date().toISOString()),
  };
}

function matchesFilters(property: PropertyRecord, filters: PropertyFilters) {
  const resolvedType = filters.type || mapRealEstateTypeToPropertyType(filters.realEstateType);

  if (filters.status && property.status !== filters.status) {
    return false;
  }

  if (!filters.status && property.status !== "active") {
    return false;
  }

  if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) {
    return false;
  }

  if (resolvedType && property.type !== resolvedType) {
    return false;
  }

  if (filters.category && property.category !== filters.category) {
    return false;
  }

  if (typeof filters.minPrice === "number" && property.price < filters.minPrice) {
    return false;
  }

  if (typeof filters.maxPrice === "number" && property.price > filters.maxPrice) {
    return false;
  }

  if (typeof filters.bedrooms === "number") {
    if (filters.bedroomsMode === "gte" && property.bedrooms < filters.bedrooms) {
      return false;
    }

    if (filters.bedroomsMode !== "gte" && property.bedrooms !== filters.bedrooms) {
      return false;
    }
  }

  if (filters.view && !property.viewTags.includes(filters.view)) {
    return false;
  }

  return true;
}

function filterSeedProperties(filters: PropertyFilters, limit?: number) {
  const filtered = sortByCreatedAtDesc(propertySeed).filter((property) => matchesFilters(property, filters));
  return typeof limit === "number" ? filtered.slice(0, limit) : filtered;
}

async function querySupabaseProperties(filters: PropertyFilters, limit?: number) {
  const client = getSupabaseServerClient();

  if (!client) {
    return null;
  }

  const executeQuery = async (orderColumn: "createdAt" | "created_at") => {
    let query = client.from(PROPERTY_TABLE).select("*");
    const resolvedType = filters.type || mapRealEstateTypeToPropertyType(filters.realEstateType);

    query = query.eq("status", filters.status ?? "active");

    if (filters.location) {
      query = query.ilike("location", `%${filters.location}%`);
    }

    if (resolvedType) {
      query = query.eq("type", resolvedType);
    }

    if (filters.category) {
      query = query.eq("category", filters.category);
    }

    if (typeof filters.minPrice === "number") {
      query = query.gte("price", filters.minPrice);
    }

    if (typeof filters.maxPrice === "number") {
      query = query.lte("price", filters.maxPrice);
    }

    if (typeof filters.bedrooms === "number") {
      query =
        filters.bedroomsMode === "gte"
          ? query.gte("bedrooms", filters.bedrooms)
          : query.eq("bedrooms", filters.bedrooms);
    }

    if (filters.view) {
      query = query.contains("view_tags", [filters.view]);
    }

    query = query.order(orderColumn, { ascending: false });

    if (typeof limit === "number") {
      query = query.limit(limit);
    }

    return query;
  };

  try {
    let result = await executeQuery("createdAt");

    if (result.error) {
      result = await executeQuery("created_at");
    }

    if (result.error) {
      throw result.error;
    }

    return (result.data ?? []).map((row) => normalizeProperty(row));
  } catch (error) {
    console.error("Property query failed, using local fallback.", error);
    return null;
  }
}

export async function getProperties(filters: PropertyFilters = {}, limit = 24) {
  const supabaseProperties = await querySupabaseProperties(filters, limit);

  if (supabaseProperties) {
    return supabaseProperties;
  }

  return filterSeedProperties(filters, limit);
}

export async function getFeaturedProperties(limit = 6) {
  return getProperties({ status: "active" }, limit);
}

export async function getPropertyBySlug(slug: string) {
  const client = getSupabaseServerClient();

  if (client) {
    try {
      const attempts = await Promise.all([
        client.from(PROPERTY_TABLE).select("*").eq("slug", slug).maybeSingle(),
        client.from(PROPERTY_TABLE).select("*").eq("slug", slug).eq("status", "active").maybeSingle(),
      ]);

      const result = attempts.find((attempt) => !attempt.error && attempt.data);
      if (result?.data) {
        return normalizeProperty(result.data);
      }
    } catch (error) {
      console.error("Property detail query failed, using local fallback.", error);
    }
  }

  return propertySeed.find((property) => property.slug === slug) ?? null;
}

export async function getRelatedProperties(property: PropertyRecord, limit = 3) {
  const related = await getProperties(
    {
      type: property.type,
      status: "active",
    },
    limit + 1
  );

  return related.filter((candidate) => candidate.slug !== property.slug).slice(0, limit);
}
