import "server-only";

import { prisma } from "@/lib/prisma";
import type { PropertyInsightPreview } from "@/types/property";

export interface PropertyInsightsFeed {
  featured: PropertyInsightPreview | null;
  recent: PropertyInsightPreview[];
  error: string | null;
}

function toPreview(post: {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnailUrl: string;
  createdAt: Date;
}): PropertyInsightPreview {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    thumbnailUrl: post.thumbnailUrl,
    createdAt: post.createdAt.toISOString(),
  };
}

export async function getPropertyInsightsFeed(): Promise<PropertyInsightsFeed> {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        thumbnailUrl: true,
        createdAt: true,
      },
    });

    const [featured, ...recent] = posts.map(toPreview);

    return {
      featured: featured ?? null,
      recent,
      error: null,
    };
  } catch (error) {
    console.error("Insights query failed for properties section.", error);

    return {
      featured: null,
      recent: [],
      error: "Insights are temporarily unavailable.",
    };
  }
}
