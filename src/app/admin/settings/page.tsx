import { prisma } from "@/lib/db";
import { SettingsClient } from "./settings-client";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settingsDb = await prisma.systemSetting.findMany({
    where: {
      key: {
        in: ["SITE_NAME", "SITE_LOGO_URL", "HERO_TAGLINE", "HERO_DESCRIPTION"],
      },
    },
  });

  const settings = settingsDb.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const initialData = {
    siteName: settings["SITE_NAME"] || "ais-showcase",
    siteLogoUrl: settings["SITE_LOGO_URL"] || "",
    heroTagline: settings["HERO_TAGLINE"] || "Kerja Tim Rapi Tanpa Drama.",
    heroDescription:
      settings["HERO_DESCRIPTION"] ||
      "Kelola tugas, pantau progress, dan buat laporan proyek dalam satu platform — lengkap dengan kurva S dan komunikasi tim yang terhubung.",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Pengaturan White Label</h1>
        <p className="text-slate-500 mt-2">Atur identitas aplikasi dan teks pada halaman utama.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <SettingsClient initialData={initialData} />
      </div>
    </div>
  );
}
