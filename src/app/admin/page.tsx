import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function AdminDashboard() {
  // AUTO-SYNC LOGIC: Find AppHub applications that are not yet in Showcase
  const unsyncedApps = await prisma.application.findMany({
    where: { showcaseApp: null },
    include: { category: true }
  });

  if (unsyncedApps.length > 0) {
    for (const app of unsyncedApps) {
      // Create a slug from app name
      const baseSlug = app.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      const uniqueSuffix = Math.random().toString(36).substring(2, 6);
      
      await prisma.showcaseApp.create({
        data: {
          apphubId: app.id,
          name: app.name,
          slug: `${baseSlug}-${uniqueSuffix}`,
          description: app.description,
          category: app.category?.name || "General",
          appUrl: app.url,
          isPublished: false, // Create as Draft
        }
      });
    }
  }

  const showcases = await prisma.showcaseApp.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Kelola Showcase</h1>
          <p className="text-slate-500 mt-1">Atur aplikasi yang tampil di gallery showcase</p>
        </div>
        <Link href="/admin/create" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md inline-block">
          + Tambah Aplikasi
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Aplikasi</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {showcases.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    Belum ada data showcase.
                  </td>
                </tr>
              ) : (
                showcases.map((app) => (
                  <tr key={app.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{app.name}</div>
                      <div className="text-xs text-slate-500">/{app.slug}</div>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-700">{app.category || "-"}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        app.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                      }`}>
                        {app.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/admin/app/${app.id}`} className="text-blue-600 hover:text-blue-800 font-bold text-sm px-3 py-1 bg-blue-50 rounded-lg mr-2 inline-block">
                        Edit
                      </Link>
                      <Link href={`/app/${app.slug}`} target="_blank" className="text-slate-600 hover:text-slate-800 font-bold text-sm px-3 py-1 bg-slate-100 rounded-lg">
                        Lihat
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
