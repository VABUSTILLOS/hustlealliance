import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/user";

// Maximum upload size: 5MB
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/**
 * Image upload endpoint for community posts.
 *
 * TODO: Replace this placeholder with Supabase Storage integration:
 *   1. Import `createClient` from `@/lib/supabase/server`
 *   2. Upload the file buffer to a bucket (e.g., "post-images")
 *   3. Generate a public URL using `supabase.storage.from("post-images").getPublicUrl(path)`
 *   4. Return the public URL in the response
 *
 * The current implementation stores the file as a base64 data URL for
 * local development only. This is NOT suitable for production.
 */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type not allowed. Accepted: ${ALLOWED_TYPES.join(", ")}` },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_SIZE / (1024 * 1024)}MB` },
        { status: 400 },
      );
    }

    // Placeholder: convert to base64 data URL for local dev
    // TODO: Replace with Supabase Storage upload
    // const supabase = await createClient();
    // const filePath = `posts/${user.id}/${Date.now()}-${file.name}`;
    // const { data, error } = await supabase.storage
    //   .from("post-images")
    //   .upload(filePath, file, { upsert: false });
    // if (error) return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    // const { data: publicUrl } = supabase.storage
    //   .from("post-images")
    //   .getPublicUrl(data.path);
    // return NextResponse.json({ url: publicUrl.publicUrl });

    // Temporary: base64 fallback for local development
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json({ url: dataUrl }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
