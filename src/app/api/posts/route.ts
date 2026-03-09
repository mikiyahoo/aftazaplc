import { NextResponse } from "next/server";
import { getAdminAccountFromRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

function sanitizeText(value: unknown) {
  if (typeof value !== "string") return "";
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Posts API failed to load posts.", error);
    return NextResponse.json({ error: "Posts database unavailable" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const account = await getAdminAccountFromRequest(request);

  if (!account) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const title = sanitizeText(body.title);
  const excerpt = sanitizeText(body.excerpt);
  const content = sanitizeText(body.content);
  const thumbnailUrl = sanitizeText(body.thumbnailUrl);
  const published = Boolean(body.published);
  const rawSlug = sanitizeText(body.slug || title);
  const slug = normalizeSlug(rawSlug);

  if (!title || !slug || !excerpt || !content || !thumbnailUrl) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    const authorId = account.id.trim();
    if (!authorId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        thumbnailUrl,
        published,
        authorId,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Posts API failed to create post.", error);
    return NextResponse.json({ error: "Posts database unavailable" }, { status: 503 });
  }
}
