import { prisma } from "./db";

export type SystemSettings = {
  appName: string;
  appDescription: string;
  appLogo: string;
  copyrightText: string;
};

export async function getSystemSettings(): Promise<SystemSettings> {
  try {
    const settings = await prisma.systemSetting.findMany();
    const map = new Map(settings.map((s) => [s.key, s.value]));
    
    let appLogo = map.get("appLogo") || "";
    // If the logo is a relative path from AppHub, prepend the AppHub URL
    // so ShowcaseApp can load the image from AppHub's server
    if (appLogo && appLogo.startsWith("/")) {
      const apphubUrl = process.env.NEXT_PUBLIC_APPHUB_URL || "http://localhost:3001";
      // Strip trailing slash from apphubUrl if present
      const baseUrl = apphubUrl.endsWith("/") ? apphubUrl.slice(0, -1) : apphubUrl;
      appLogo = `${baseUrl}${appLogo}`;
    }

    return {
      appName: map.get("appName") || "ShowcaseApp",
      appDescription: map.get("appDescription") || "Portal Aplikasi Internal",
      appLogo,
      copyrightText: map.get("copyrightText") || "© 2026 AppHub — Internal Use Only",
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
