import { prisma } from "./db";

export type SystemSettings = {
  appName: string;
  appDescription: string;
  appLogo: string;
  copyrightText: string;
  heroTagline: string;
};

export async function getSystemSettings(): Promise<SystemSettings> {
  try {
    const settings = await prisma.systemSetting.findMany();
    const map = new Map(settings.map((s) => [s.key, s.value]));
    
    return {
      appName: map.get("SITE_NAME") || "ShowcaseApp",
      appDescription: map.get("HERO_DESCRIPTION") || "Portal Aplikasi Internal",
      appLogo: map.get("SITE_LOGO_URL") || "",
      copyrightText: "© 2026 ShowcaseApp — Internal Use Only",
      heroTagline: map.get("HERO_TAGLINE") || "Pusat Aplikasi Internal",
    };
  } catch (err) {
    console.error("Failed to fetch system settings, using defaults:", err);
    return {
      appName: "ShowcaseApp",
      appDescription: "Portal Aplikasi Internal",
      appLogo: "",
      copyrightText: "© 2026 AppHub — Internal Use Only",
    };
  }
}
