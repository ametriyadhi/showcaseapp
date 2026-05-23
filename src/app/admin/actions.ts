"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import fs from "fs/promises";
import path from "path";

export async function createShowcaseApp(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const tagline = formData.get("tagline") as string;
  const category = formData.get("category") as string;
  const appUrl = formData.get("appUrl") as string;
  const defaultDevice = formData.get("defaultDevice") as string;
  const cardBg = formData.get("cardBg") as string;
  const isPublished = formData.get("isPublished") === "on";

  if (!name || !slug) {
    throw new Error("Name and Slug are required");
  }

  await prisma.showcaseApp.create({
    data: {
      name,
      slug,
      description,
      tagline,
      category,
      appUrl,
      defaultDevice: defaultDevice || "phone",
      cardBg: cardBg || "gradient-blue",
      isPublished,
    },
  });

  revalidatePath("/admin");
  redirect("/admin");
}

export async function uploadMedia(appId: string, formData: FormData) {
  const file = formData.get("file") as File | null;
  const type = formData.get("type") as string;
  const mockup = formData.get("mockup") as string;
  const caption = formData.get("caption") as string;
  const urlParams = formData.get("url") as string;
  
  if (!appId) throw new Error("Missing appId");
  
  let mediaUrl = urlParams;

  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split('.').pop() || 'bin';
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
    
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });
    
    await fs.writeFile(path.join(uploadsDir, filename), buffer);
    mediaUrl = `/uploads/${filename}`;
  }

  if (!mediaUrl) throw new Error("No file or URL provided");

  await prisma.showcaseMedia.create({
    data: {
      appId,
      type,
      mockup: mockup || "phone",
      url: mediaUrl,
      caption,
    }
  });

  revalidatePath(`/admin/app/${appId}`);
  revalidatePath(`/app`);
  revalidatePath(`/`);
}

export async function deleteMedia(mediaId: string, appId: string) {
  await prisma.showcaseMedia.delete({
    where: { id: mediaId }
  });
  revalidatePath(`/admin/app/${appId}`);
  revalidatePath(`/app`);
  revalidatePath(`/`);
}

export async function updateShowcaseApp(appId: string, formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const tagline = formData.get("tagline") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const appUrl = formData.get("appUrl") as string;
  const defaultDevice = formData.get("defaultDevice") as string;
  const cardBg = formData.get("cardBg") as string;
  const isPublished = formData.get("isPublished") === "on";

  await prisma.showcaseApp.update({
    where: { id: appId },
    data: { name, slug, tagline, description, category, appUrl, defaultDevice, cardBg, isPublished },
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/app/${appId}`);
  revalidatePath(`/app/${slug}`);
  revalidatePath(`/`);
}

export async function deleteShowcaseApp(appId: string) {
  await prisma.showcaseApp.delete({ where: { id: appId } });
  revalidatePath("/admin");
  redirect("/admin");
}

export async function addFeature(appId: string, formData: FormData) {
  const icon = formData.get("icon") as string;
  const title = formData.get("title") as string;
  const desc = formData.get("desc") as string;

  if (!title) throw new Error("Title wajib diisi");

  await prisma.showcaseFeature.create({
    data: { appId, icon: icon || "✨", title, desc },
  });

  revalidatePath(`/admin/app/${appId}`);
}

export async function deleteFeature(featureId: string, appId: string) {
  await prisma.showcaseFeature.delete({ where: { id: featureId } });
  revalidatePath(`/admin/app/${appId}`);
}
