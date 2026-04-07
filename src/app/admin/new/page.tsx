"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { redirect } from "next/navigation";
import Button from "@/components/ui/Button";
import { Loader2 } from "lucide-react";
import { markdownToHtml } from "@/lib/markdown";
import { requireAdminAuth } from "@/lib/auth";

type PostFormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnailUrl: string;
  published: boolean;
};

type FormatAction =
  | "h2"
  | "h3"
  | "bold"
  | "italic"
  | "link"
  | "list"
  | "quote"
  | "code";

async function fetchPost(id: string) {
  const res = await fetch(`/api/posts/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export default async function AdminNewPostPage() {
  // Check authentication on the server side
  const authResult = await requireAdminAuth(new Request("http://localhost:3003/admin/new", {
    headers: {
      'x-forwarded-for': '127.0.0.1',
      'user-agent': 'Next.js'
    }
  }));
  
  if (!authResult.authenticated) {
    // Redirect to login page if not authenticated
    redirect("/admin/login");
  }

  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const contentRef = useRef<HTMLTextAreaElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(!!editId);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState<PostFormState>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    thumbnailUrl: "",
    published: false,
  });

  useEffect(() => {
    if (!editId) return;
    (async () => {
      const data = await fetchPost(editId);
      if (!data) {
        setError("Unable to load post");
      } else {
        setForm({
          title: data.title ?? "",
          slug: data.slug ?? "",
          excerpt: data.excerpt ?? "",
          content: data.content ?? "",
          thumbnailUrl: data.thumbnailUrl ?? "",
          published: data.published ?? false,
        });
      }
      setInitializing(false);
    })();
  }, [editId]);

  const canSubmit =
    !loading &&
    form.title.trim().length > 0 &&
    form.excerpt.trim().length > 0 &&
    form.content.trim().length > 0 &&
    (Boolean(file) || form.thumbnailUrl.trim().length > 0);

  const effectiveSlug = useMemo(() => {
    if (form.slug) return form.slug;
    return form.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  }, [form.slug, form.title]);

  const contentPreviewHtml = useMemo(() => markdownToHtml(form.content), [form.content]);
  const thumbnailPreviewUrl = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return form.thumbnailUrl.trim();
  }, [file, form.thumbnailUrl]);

  useEffect(() => {
    return () => {
      if (thumbnailPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreviewUrl);
      }
    };
  }, [thumbnailPreviewUrl]);

  const applyFormatting = (action: FormatAction) => {
    const area = contentRef.current;
    if (!area) return;

    const start = area.selectionStart;
    const end = area.selectionEnd;
    const selected = form.content.slice(start, end) || "text";

    const wrappers: Record<FormatAction, { before: string; after: string; fallback?: string }> = {
      h2: { before: "\n## ", after: "\n", fallback: "Section heading" },
      h3: { before: "\n### ", after: "\n", fallback: "Subheading" },
      bold: { before: "**", after: "**" },
      italic: { before: "*", after: "*" },
      link: { before: "[", after: "](https://example.com)", fallback: "Link text" },
      list: { before: "\n- ", after: "\n", fallback: "List item" },
      quote: { before: "\n> ", after: "\n", fallback: "Quoted insight" },
      code: { before: "\n```\n", after: "\n```\n", fallback: "code snippet" },
    };

    const formatter = wrappers[action];
    const text = form.content;
    const payload = selected === "text" && formatter.fallback ? formatter.fallback : selected;
    const next = `${text.slice(0, start)}${formatter.before}${payload}${formatter.after}${text.slice(end)}`;

    setForm((prev) => ({ ...prev, content: next }));

    setTimeout(() => {
      area.focus();
      const cursor = start + formatter.before.length + payload.length + formatter.after.length;
      area.setSelectionRange(cursor, cursor);
    }, 0);
  };

  const handleSubmit = async (publish: boolean) => {
    setLoading(true);
    setError(null);

    try {
      let thumbnailUrl = form.thumbnailUrl;

      if (file) {
        const uploadData = new FormData();
        uploadData.append("file", file);
        const uploadRes = await fetch("/api/upload-image", {
          method: "POST",
          body: uploadData,
        });
        if (!uploadRes.ok) {
          const uploadJson = await uploadRes.json().catch(() => ({}));
          throw new Error(uploadJson.error || "Thumbnail upload failed");
        }
        const json = await uploadRes.json();
        thumbnailUrl = json.url;
      }

      const payload = {
        title: form.title,
        slug: effectiveSlug,
        excerpt: form.excerpt,
        content: form.content,
        thumbnailUrl,
        published: publish,
      };

      const method = editId ? "PATCH" : "POST";
      const url = editId ? `/api/posts/${editId}` : "/api/posts";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Save failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main data-header-text="light" className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="container-x max-w-5xl">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#c8a34d]">
              {editId ? "Edit Insight" : "New Insight"}
            </p>
            <h1 className="mt-2 text-3xl font-display font-black uppercase tracking-tight">
              {editId ? "Update Institutional Protocol" : "Draft Institutional Protocol"}
            </h1>
          </div>
        </header>

        {initializing ? (
          <div className="flex items-center justify-center py-20 text-sm text-slate-500">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading post...
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
            <section className="space-y-6 bg-white p-8 border border-slate-200 shadow-sm">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full border-b-2 border-slate-100 py-2 focus:border-[#c8a34d] outline-none text-slate-900 placeholder:text-slate-400 text-xl font-display uppercase font-bold transition-colors"
                  placeholder="Structured Absorption Control"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Slug</label>
                  <input
                    type="text"
                    value={effectiveSlug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                    className="w-full bg-slate-50 p-3 text-xs font-mono text-slate-900 placeholder:text-slate-400 outline-none border border-transparent focus:border-[#c8a34d]/30"
                    placeholder="auto-generated-slug"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Publish State</label>
                  <div className="flex items-center gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, published: false }))}
                      className={`px-3 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest ${
                        !form.published
                          ? "bg-slate-900 text-white border-slate-900"
                          : "border-slate-200 text-slate-500"
                      }`}
                    >
                      Draft
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, published: true }))}
                      className={`px-3 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest ${
                        form.published
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "border-slate-200 text-slate-500"
                      }`}
                    >
                      Published
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Excerpt</label>
                <textarea
                  rows={3}
                  value={form.excerpt}
                  onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                  className="w-full bg-slate-50 p-4 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 outline-none border border-transparent focus:border-[#c8a34d]/30 transition-all"
                  placeholder="One paragraph summary for listing views."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Content (Markdown)
                </label>

                <div className="flex flex-wrap gap-2 rounded-md border border-slate-200 p-2 bg-slate-50">
                  <button type="button" onClick={() => applyFormatting("h2")} className="px-2 py-1 text-[10px] font-black uppercase border border-slate-300 bg-white hover:border-[#c8a34d]">H2</button>
                  <button type="button" onClick={() => applyFormatting("h3")} className="px-2 py-1 text-[10px] font-black uppercase border border-slate-300 bg-white hover:border-[#c8a34d]">H3</button>
                  <button type="button" onClick={() => applyFormatting("bold")} className="px-2 py-1 text-[10px] font-black uppercase border border-slate-300 bg-white hover:border-[#c8a34d]">Bold</button>
                  <button type="button" onClick={() => applyFormatting("italic")} className="px-2 py-1 text-[10px] font-black uppercase border border-slate-300 bg-white hover:border-[#c8a34d]">Italic</button>
                  <button type="button" onClick={() => applyFormatting("link")} className="px-2 py-1 text-[10px] font-black uppercase border border-slate-300 bg-white hover:border-[#c8a34d]">Link</button>
                  <button type="button" onClick={() => applyFormatting("list")} className="px-2 py-1 text-[10px] font-black uppercase border border-slate-300 bg-white hover:border-[#c8a34d]">List</button>
                  <button type="button" onClick={() => applyFormatting("quote")} className="px-2 py-1 text-[10px] font-black uppercase border border-slate-300 bg-white hover:border-[#c8a34d]">Quote</button>
                  <button type="button" onClick={() => applyFormatting("code")} className="px-2 py-1 text-[10px] font-black uppercase border border-slate-300 bg-white hover:border-[#c8a34d]">Code</button>
                </div>

                <textarea
                  ref={contentRef}
                  rows={12}
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  className="w-full bg-slate-50 p-4 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 outline-none border border-transparent focus:border-[#c8a34d]/30 font-mono"
                  placeholder="Use markdown. Example: ## Heading, **bold**, *italic*, [link](https://...)"
                />
              </div>

              <div className="space-y-2">
                <label
                  className="text-[10px] font-bold uppercase tracking-widest text-slate-400"
                  htmlFor="thumbnail-file"
                >
                  Thumbnail
                </label>
                <input
                  id="thumbnail-file"
                  type="file"
                  accept="image/*"
                  aria-label="Thumbnail image file"
                  onChange={(e) => {
                    const next = e.target.files?.[0] ?? null;
                    setFile(next);
                  }}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:rounded-md file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-[10px] file:font-black file:uppercase file:tracking-[0.2em] file:text-white hover:file:bg-[#c8a34d]"
                />
                <input
                  type="text"
                  value={form.thumbnailUrl}
                  onChange={(e) => setForm((f) => ({ ...f, thumbnailUrl: e.target.value }))}
                  placeholder="Or paste an existing Cloudinary URL"
                  className="mt-2 w-full bg-slate-50 p-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none border border-transparent focus:border-[#c8a34d]/30"
                />
              </div>

              {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  type="button"
                  onClick={() => handleSubmit(false)}
                  disabled={!canSubmit}
                  className="px-6 py-3 text-[10px] font-black uppercase tracking-[0.25em] bg-slate-900 text-white hover:bg-slate-800"
                >
                  {loading ? "Saving..." : "Save Draft"}
                </Button>
                <Button
                  type="button"
                  onClick={() => handleSubmit(true)}
                  disabled={!canSubmit}
                  className="px-6 py-3 text-[10px] font-black uppercase tracking-[0.25em] bg-[#c8a34d] text-slate-950 hover:bg-[#e4c56a]"
                >
                  {loading ? "Publishing..." : "Publish"}
                </Button>
              </div>
            </section>

            <section className="space-y-4 sticky top-24 h-fit">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>Live Preview</span>
              </div>
              <div className="bg-white border border-slate-200 p-8 shadow-lg space-y-6">
                <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#c8a34d]">Aftaza_Insight</p>
                <h2 className="text-2xl font-display font-black uppercase tracking-tight">{form.title || "Untitled Protocol"}</h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {form.excerpt || "Protocol summary will render here for listing views."}
                </p>
                <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  /insights/{effectiveSlug || "slug-pending"}
                </p>
                {thumbnailPreviewUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbnailPreviewUrl}
                    alt="Thumbnail preview"
                    className="mt-4 h-40 w-full rounded-lg object-cover border border-slate-100"
                  />
                )}
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Content Preview</p>
                  <div
                    className="text-sm leading-relaxed text-slate-700 space-y-3 [&_h2]:text-xl [&_h2]:font-black [&_h2]:uppercase [&_h2]:tracking-tight [&_h3]:text-base [&_h3]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_blockquote]:border-l-2 [&_blockquote]:border-[#c8a34d] [&_blockquote]:pl-3 [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:py-0.5 [&_pre]:bg-slate-900 [&_pre]:text-slate-100 [&_pre]:p-3 [&_pre]:rounded"
                    dangerouslySetInnerHTML={{ __html: contentPreviewHtml }}
                  />
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
