import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
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

async function requireAdmin(request: Request) {
  const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET });
  if (!token || (token as any).role !== "admin") {
    return null;
  }
  return token;
}

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const token = await requireAdmin(request);

  if (!token) {
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

  const existing = await prisma.post.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }

  const authorId = ((token as any).sub as string | undefined)?.trim();
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
}
