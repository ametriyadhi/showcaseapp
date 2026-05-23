"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function updateWhiteLabelSettings(formData: FormData) {
  try {
    const siteName = formData.get("siteName") as string;
    const heroTagline = formData.get("heroTagline") as string;
    const heroDescription = formData.get("heroDescription") as string;
    let siteLogoUrl = formData.get("siteLogoUrl") as string || "";

    const siteLogo = formData.get("siteLogo") as File;
    if (siteLogo && siteLogo.size > 0) {
      const bytes = await siteLogo.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create uploads directory if not exists
      const uploadDir = join(process.cwd(), "public/uploads");
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const filename = `logo-${Date.now()}.${siteLogo.name.split('.').pop()}`;
      const filepath = join(uploadDir, filename);
      await writeFile(filepath, buffer);
      
      siteLogoUrl = `/uploads/${filename}`;
    }

    const settingsToUpdate = [
      { key: "SITE_NAME", value: siteName },
      { key: "SITE_LOGO_URL", value: siteLogoUrl },
      { key: "HERO_TAGLINE", value: heroTagline },
      { key: "HERO_DESCRIPTION", value: heroDescription },
    ];

    for (const setting of settingsToUpdate) {
      if (setting.value !== undefined && setting.value !== null) {
        await prisma.systemSetting.upsert({
          where: { key: setting.key },
          update: { value: setting.value },
          create: { key: setting.key, value: setting.value },
        });
      }
    }

    revalidatePath("/");
    
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update settings:", error);
    return { success: false, error: error.message };
  }
}
