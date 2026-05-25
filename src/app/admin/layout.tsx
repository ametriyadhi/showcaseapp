import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white min-h-screen p-6 hidden md:block">
        <div className="mb-10">
          <h2 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            AIS Admin
          </h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">Showcase CMS</p>
        </div>
        <nav className="space-y-2">
          <Link href="/admin" className="block px-4 py-2.5 rounded-lg bg-white/10 font-bold text-white">
            Dashboard
          </Link>
          <Link href="/admin/settings" className="block px-4 py-2.5 rounded-lg hover:bg-white/5 font-medium text-slate-300">
            Pengaturan
          </Link>
          <Link href="/admin/users" className="block px-4 py-2.5 rounded-lg hover:bg-white/5 font-medium text-slate-300">
            Kelola User 👥
          </Link>
          <a href={process.env.NEXT_PUBLIC_APPHUB_URL || "https://ais-apphub.ametriyadhi.com"} className="block px-4 py-2.5 rounded-lg hover:bg-white/5 font-medium text-blue-400 mt-4 border border-blue-500/30">
            Kembali ke AppHub ↗
          </a>
          <Link href="/" className="block px-4 py-2.5 rounded-lg hover:bg-white/5 font-medium text-slate-300 mt-2">
            Lihat Website ↗
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white h-16 border-b border-slate-200 px-8 flex items-center justify-end">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-900">{session.user.name}</span>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              {session.user.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>
        <div className="p-8 max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
