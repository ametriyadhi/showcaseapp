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
