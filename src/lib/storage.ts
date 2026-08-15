// Image storage abstraction.
// - If CLOUDINARY_URL is set -> upload to Cloudinary (production).
// - Otherwise -> save to /public/uploads (dev fallback).
// ponytail: two backends behind one function; swap by setting an env var, no code change.

import { v2 as cloudinary } from "cloudinary";

const useCloudinary = !!process.env.CLOUDINARY_URL;

export async function saveFile(file: File, folder = "orbit"): Promise<string> {
  const bytes = Buffer.from(await file.arrayBuffer());

  if (useCloudinary) {
    // cloudinary SDK auto-configures from CLOUDINARY_URL env
    return new Promise<string>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder }, (err, result) => {
          if (err || !result) return reject(err || new Error("upload failed"));
          resolve(result.secure_url);
        })
        .end(bytes);
    });
  }

  const fs = await import("fs/promises");
  const path = await import("path");
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  const safe = file.name.replace(/[^a-z0-9.\-_]/gi, "_");
  const name = `${Date.now()}-${safe}`;
  await fs.writeFile(path.join(dir, name), bytes);
  return `/uploads/${name}`;
}

// Returns a saved URL, or the existing value if no new file was chosen.
export async function saveOptionalFile(
  file: File | null,
  existing: string,
  folder = "orbit"
): Promise<string> {
  if (file && file.size > 0) return saveFile(file, folder);
  return existing;
}
