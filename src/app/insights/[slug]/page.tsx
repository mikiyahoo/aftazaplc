import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { markdownToHtml } from "@/lib/markdown";

interface InsightPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: InsightPageProps): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  });

  if (!post || !post.published) {
    return {};
  }

  const url = new URL(`/insights/${post.slug}`, "https://aftazaplc.com");

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      images: [{ url: post.thumbnailUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.thumbnailUrl],
    },
  };
}

export default async function InsightPage({ params }: InsightPageProps) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  });

  if (!post || !post.published) {
    notFound();
  }

  const contentHtml = markdownToHtml(post.content);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: [post.thumbnailUrl],
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Organization",
      name: "AFTAZA PLC",
    },
  };

  return (
    <main data-header-text="light" className="bg-white pt-32 pb-20">
      <div className="container-x max-w-3xl">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />

        <Link
          href="/insights"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-10 hover:text-[#c8a34d] transition-colors"
        >
          Back to Insights
        </Link>

        <span className="text-[#c8a34d] font-mono text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block">
          Aftaza_Insight
        </span>

        <h1 className="text-4xl md:text-5xl font-display font-black uppercase leading-tight mb-6">{post.title}</h1>

        <div className="mb-8 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-slate-400">
          <span>{post.createdAt.toLocaleDateString()}</span>
        </div>

        {post.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.thumbnailUrl}
            alt={post.title}
            className="mb-10 w-full rounded-lg object-cover border border-slate-100 max-h-80"
          />
        ) : (
          <div className="mb-10 w-full h-72 rounded-lg border border-slate-100 bg-slate-100 flex items-center justify-center text-xs text-slate-500 uppercase tracking-widest">
            No Thumbnail
          </div>
        )}

        <article
          className="max-w-none text-slate-800 space-y-4 [&_p]:text-base [&_p]:leading-relaxed [&_h2]:mt-8 [&_h2]:text-3xl [&_h2]:font-black [&_h2]:uppercase [&_h2]:tracking-tight [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-bold [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-1 [&_blockquote]:border-l-4 [&_blockquote]:border-[#c8a34d] [&_blockquote]:pl-4 [&_blockquote]:italic [&_a]:underline [&_a]:underline-offset-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-slate-900 [&_pre]:p-4 [&_pre]:text-slate-100 [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        <section className="mt-16 pt-8 border-t border-slate-100 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
            Ready to operationalize this insight?
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/services/buyer-advisory"
              className="btn-primary text-[10px] font-black uppercase tracking-[0.25em]"
            >
              Buyer Advisory
            </Link>
            <Link
              href="/services/developer-commercialization"
              className="btn-outline text-[10px] font-black uppercase tracking-[0.25em]"
            >
              Developer Commercialization
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
