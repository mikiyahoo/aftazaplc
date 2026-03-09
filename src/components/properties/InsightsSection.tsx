import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { formatInsightDate } from "@/lib/properties/config";
import { cn } from "@/lib/utils";
import type { PropertyInsightPreview } from "@/types/property";
import PropertyImage from "./PropertyImage";

interface InsightsSectionProps {
  featured: PropertyInsightPreview | null;
  recent: PropertyInsightPreview[];
  error?: string | null;
}

function InsightCard({
  post,
  compact = false,
}: {
  post: PropertyInsightPreview;
  compact?: boolean;
}) {
  return (
    <Link
      href={`/insights/${post.slug}`}
      className={cn(
        "property-floating-card property-card-lift group block overflow-hidden",
        compact ? "p-5" : "p-6"
      )}
    >
      {compact ? null : (
        <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-[16px]">
          <PropertyImage
            src={post.thumbnailUrl}
            alt={post.title}
            fallbackLabel={post.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}

      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-[var(--property-action-blue)]">
        <Sparkles size={14} />
        <span>Addis Ababa Market Trends</span>
      </div>
      <h3
        className={cn(
          "mt-4 font-display font-bold tracking-tight text-slate-900",
          compact ? "text-lg" : "text-3xl"
        )}
      >
        {post.title}
      </h3>
      <p className={cn("mt-4 leading-7 text-slate-600", compact ? "text-sm" : "text-base")}>
        {post.excerpt}
      </p>
      <div className="mt-5 flex items-center justify-between text-sm font-medium text-slate-500">
        <span>{formatInsightDate(post)}</span>
        <span className="inline-flex items-center gap-2 text-[var(--property-action-blue)]">
          Read Article
          <ArrowUpRight size={16} />
        </span>
      </div>
    </Link>
  );
}

export default function InsightsSection({
  featured,
  recent,
  error,
}: InsightsSectionProps) {
  return (
    <section data-header-surface="light" className="section-light section-y relative overflow-hidden">
      <div className="section-divider" />
      <div className="grid-pattern" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none" />

      <div className="container-x relative z-10">
        <div className="section-header !max-w-4xl">
          <span className="gold-rule mx-auto" />
          <h2 className="text-center lg:whitespace-nowrap">
            <span>Latest Real Estate <span className="section-title-accent">Insights</span></span>
          </h2>
          <p className="subtitle">
            Transaction insight, market positioning, and buyer guidance from the AFTAZA team.
          </p>
        </div>

        {error ? (
          <div className="property-floating-card mt-12 p-8 text-center text-slate-600">
            {error}
          </div>
        ) : featured ? (
          <div className="mt-12 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <InsightCard post={featured} />
            <div className="grid gap-4">
              {recent.map((post) => (
                <InsightCard key={post.id} post={post} compact />
              ))}
            </div>
          </div>
        ) : (
          <div className="property-floating-card mt-12 p-8 text-center text-slate-600">
            No published insights are available yet.
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/insights"
            className="btn-primary inline-flex items-center gap-2"
          >
            Explore More Articles
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

