/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  uploadMedia, 
  deleteMedia, 
  updateShowcaseApp, 
  deleteShowcaseApp, 
  addFeature, 
  deleteFeature 
} from "../../actions";

interface AppEditClientProps {
  app: any; // Using any to match current Prisma schemas easily
}

export function AppEditClient({ app }: AppEditClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Media Deletion
  const handleDeleteMedia = async (mediaId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus media ini?")) return;
    
    startTransition(async () => {
      try {
        await deleteMedia(mediaId, app.id);
        router.refresh();
      } catch (err: any) {
        alert(err.message || "Gagal menghapus media");
      }
    });
  };

  // Feature Deletion
  const handleDeleteFeature = async (featureId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus fitur ini?")) return;

    startTransition(async () => {
      try {
        await deleteFeature(featureId, app.id);
        router.refresh();
      } catch (err: any) {
        alert(err.message || "Gagal menghapus fitur");
      }
    });
  };

  // App Deletion
  const handleDeleteApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm("PERINGATAN: Apakah Anda yakin ingin menghapus seluruh aplikasi ini beserta semua media dan fiturnya secara permanen? Tindakan ini tidak dapat dibatalkan.")) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteShowcaseApp(app.id);
      } catch (err: any) {
        alert(err.message || "Gagal menghapus aplikasi");
      }
    });
  };

  // Wrap Form Submissions to handle transition loading state if desired, or use native action
  const handleUpdateApp = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await updateShowcaseApp(app.id, formData);
        alert("Detail aplikasi berhasil diperbarui!");
        router.refresh();
      } catch (err: any) {
        alert(err.message || "Gagal memperbarui aplikasi");
      }
    });
  };

  const handleAddFeature = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await addFeature(app.id, formData);
        router.refresh();
      } catch (err: any) {
        alert(err.message || "Gagal menambah fitur");
      }
    });
  };

  const handleUploadMedia = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await uploadMedia(app.id, formData);
        router.refresh();
      } catch (err: any) {
        alert(err.message || "Gagal mengunggah media");
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              app.isPublished ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
            }`}>
              {app.isPublished ? "Published" : "Draft"}
            </span>
            <span className="text-slate-400 text-sm">ID: {app.id}</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mt-1">Kelola Aplikasi: {app.name}</h1>
          <p className="text-slate-500 mt-1">Konfigurasikan informasi aplikasi, media showcase, dan fitur utama.</p>
        </div>
        <div className="flex gap-3">
          <Link href={`/app/${app.slug}`} target="_blank" className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2">
            Lihat Hasil ↗
          </Link>
          <Link href="/admin" className="bg-slate-800 hover:bg-slate-950 text-white px-5 py-2.5 rounded-xl font-bold transition-all">
            Kembali ke Dashboard
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Columns: App Settings and Features */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Card 1: Edit App Info */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <span>📝</span> Detail Aplikasi
            </h2>
            <form action={handleUpdateApp} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Nama Aplikasi *</label>
                  <input 
                    type="text" 
                    name="name" 
                    defaultValue={app.name} 
                    required 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-900 font-medium" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Slug *</label>
                  <input 
                    type="text" 
                    name="slug" 
                    defaultValue={app.slug} 
                    required 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-900 font-medium" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Tagline Singkat</label>
                <input 
                  type="text" 
                  name="tagline" 
                  defaultValue={app.tagline || ""} 
                  placeholder="Deskripsi satu kalimat yang menarik minat pengguna"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-900 font-medium" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Deskripsi Lengkap</label>
                <textarea 
                  name="description" 
                  defaultValue={app.description || ""} 
                  rows={4} 
                  placeholder="Jelaskan tujuan dan fungsi aplikasi secara detail"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-900 font-medium" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Kategori</label>
                  <input 
                    type="text" 
                    name="category" 
                    defaultValue={app.category || ""} 
                    placeholder="Contoh: Productivity, Finance, HRIS"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-900 font-medium" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">URL Aplikasi (Tautan Live)</label>
                  <input 
                    type="url" 
                    name="appUrl" 
                    defaultValue={app.appUrl || ""} 
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-900 font-medium" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Device Default</label>
                  <select 
                    name="defaultDevice" 
                    defaultValue={app.defaultDevice} 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-900 font-medium"
                  >
                    <option value="composition">Komposisi (Laptop+iPad+iPhone)</option>
                    <option value="phone">Smartphone (Portrait)</option>
                    <option value="tablet">Tablet (iPad Landscape)</option>
                    <option value="laptop">Laptop (Macbook style)</option>
                    <option value="browser">Browser Window</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Warna Background Card</label>
                  <select 
                    name="cardBg" 
                    defaultValue={app.cardBg} 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-900 font-medium"
                  >
                    <option value="gradient-blue">Blue Gradient</option>
                    <option value="gradient-purple">Purple Gradient</option>
                    <option value="gradient-emerald">Emerald Gradient</option>
                    <option value="gradient-rose">Rose Gradient</option>
                    <option value="gradient-amber">Amber Gradient</option>
                    <option value="gradient-dark">Dark Minimalist</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <input 
                  type="checkbox" 
                  id="isPublished" 
                  name="isPublished" 
                  defaultChecked={app.isPublished}
                  className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500" 
                />
                <label htmlFor="isPublished" className="ml-3 text-sm font-bold text-slate-700 cursor-pointer select-none">
                  Published (Tampilkan aplikasi ini pada Gallery publik)
                </label>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md"
                >
                  {isPending ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>

          {/* Card 2: Manage Features */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-2">
              <span>✨</span> Fitur Utama Aplikasi
            </h2>
            <p className="text-slate-500 text-sm mb-6">Tambahkan fitur-fitur unggulan yang dimiliki aplikasi Anda untuk memikat pengunjung.</p>
            
            {/* Existing Features List */}
            <div className="space-y-3 mb-6">
              {app.features.length === 0 ? (
                <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400 text-sm">
                  Belum ada fitur utama yang ditambahkan.
                </div>
              ) : (
                app.features.map((f: any) => (
                  <div key={f.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl bg-white w-10 h-10 rounded-lg flex items-center justify-center border border-slate-100 shadow-sm">{f.icon}</span>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{f.title}</h4>
                        {f.desc && <p className="text-slate-500 text-xs">{f.desc}</p>}
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleDeleteFeature(f.id)}
                      disabled={isPending}
                      className="text-xs font-bold text-red-500 hover:text-red-700 px-3 py-1.5 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      Hapus
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add Feature Form */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
              <h3 className="text-sm font-bold text-slate-800 mb-3">Tambah Fitur Baru</h3>
              <form action={handleAddFeature} className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Emoji Icon</label>
                    <input 
                      type="text" 
                      name="icon" 
                      placeholder="✨" 
                      defaultValue="✨"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-center text-slate-900 font-bold" 
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Nama Fitur *</label>
                    <input 
                      type="text" 
                      name="title" 
                      placeholder="Contoh: Real-time Sync" 
                      required
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900 font-medium" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Deskripsi Singkat</label>
                  <input 
                    type="text" 
                    name="desc" 
                    placeholder="Contoh: Data langsung sinkron di seluruh perangkat." 
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900 font-medium" 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full bg-slate-800 hover:bg-slate-950 disabled:bg-slate-600 text-white py-2 rounded-lg font-bold text-sm transition-all"
                >
                  {isPending ? "Menambahkan..." : "+ Tambahkan Fitur"}
                </button>
              </form>
            </div>
          </div>

          {/* Card 3: Danger Zone */}
          <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
            <h2 className="text-lg font-bold text-red-950 mb-1">Danger Zone</h2>
            <p className="text-red-700 text-xs mb-4">Setelah dihapus, seluruh media dan fitur aplikasi ini tidak dapat dikembalikan.</p>
            <form onSubmit={handleDeleteApp}>
              <button 
                type="submit" 
                disabled={isPending}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm"
              >
                {isPending ? "Menghapus..." : "Hapus Aplikasi Permanen"}
              </button>
            </form>
          </div>

        </div>

        {/* Right Columns: Media Management */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card 4: Upload Media */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-6">
            <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
              <span>📤</span> Tambah Media
            </h2>
            <form action={handleUploadMedia} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Tipe Media</label>
                <select name="type" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-none" required>
                  <option value="screenshot">Screenshot (Gambar)</option>
                  <option value="video">Video Singkat</option>
                  <option value="youtube">YouTube Embed URL</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Tampil di Mockup / Layar</label>
                <select name="mockup" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-none" required>
                  <option value="phone">Smartphone (Phone)</option>
                  <option value="tablet">Tablet (iPad Landscape)</option>
                  <option value="laptop">Laptop (Macbook)</option>
                  <option value="browser">Browser Window</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Pilih File (Gambar/Video)</label>
                <input 
                  type="file" 
                  name="file" 
                  accept="image/*,video/*" 
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                />
                <p className="text-[10px] text-slate-400 mt-1">Pilih file untuk media lokal (hingga 100MB).</p>
              </div>

              <div className="flex items-center my-2">
                <div className="flex-1 border-t border-slate-200"></div>
                <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ATAU</div>
                <div className="flex-1 border-t border-slate-200"></div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">URL Eksternal / YouTube</label>
                <input 
                  type="url" 
                  name="url" 
                  placeholder="https://..." 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-none placeholder:text-slate-400" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Keterangan (Caption)</label>
                <input 
                  type="text" 
                  name="caption" 
                  placeholder="Misal: Halaman Login Utama"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-none placeholder:text-slate-400" 
                />
              </div>

              <button 
                type="submit" 
                disabled={isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-3 rounded-xl font-bold transition-all shadow-md mt-4"
              >
                {isPending ? "Mengunggah..." : "Upload & Simpan"}
              </button>
            </form>
          </div>

          {/* Card 5: Current Media List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
              <span>🖼️</span> Media Terupload ({app.media.length})
            </h2>
            {app.media.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400 text-sm">
                Belum ada media yang ditambahkan.
              </div>
            ) : (
              <div className="space-y-4">
                {app.media.map((m: any) => (
                  <div key={m.id} className="relative group border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex items-center p-3 gap-3">
                    <div className="w-20 h-14 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {m.type === "video" ? (
                        <video src={m.url} className="w-full h-full object-cover" muted />
                      ) : m.type === "youtube" ? (
                        <div className="text-center text-[10px] font-bold text-slate-500">YouTube</div>
                      ) : (
                        <img src={m.url} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{m.caption || "Tanpa keterangan"}</p>
                      <p className="text-xs text-slate-400 capitalize">{m.type} &bull; Mockup: {m.mockup || "phone"}</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleDeleteMedia(m.id)}
                      disabled={isPending}
                      className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
