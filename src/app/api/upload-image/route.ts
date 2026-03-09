import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";
import { getAdminAccountFromRequest } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const account = await getAdminAccountFromRequest(request);

  if (!account) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return NextResponse.json(
      { error: "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET." },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Image too large. Max size is 5MB." }, { status: 400 });
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "aftaza-blog" }, (error, result) => {
          if (error || !result) {
            return reject(error);
          }
          resolve(result);
        })
        .end(buffer);
    });

    return NextResponse.json({ url: uploadResult.secure_url });
  } catch (error) {
    console.error("Cloudinary upload error", error);
    const message =
      typeof error === "object" && error !== null && "message" in error
        ? String((error as { message?: unknown }).message)
        : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
