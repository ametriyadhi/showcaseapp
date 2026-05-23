"use client";

import { useState } from "react";
import { updateWhiteLabelSettings } from "@/actions/settings";

interface SettingsClientProps {
  initialData: {
    siteName: string;
    siteLogoUrl: string;
    heroTagline: string;
    heroDescription: string;
  };
}

export function SettingsClient({ initialData }: SettingsClientProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    // Keep existing URL if no new file is uploaded
    if (!formData.get("siteLogo") || (formData.get("siteLogo") as File).size === 0) {
      formData.append("siteLogoUrl", initialData.siteLogoUrl);
    }

    const res = await updateWhiteLabelSettings(formData);
    setIsSaving(false);

    if (res.success) {
      setMessage({ text: "Pengaturan berhasil disimpan!", type: "success" });
    } else {
      setMessage({ text: "Gagal menyimpan pengaturan: " + res.error, type: "error" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-xl text-sm font-bold ${
            message.type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          }`}
        >
          {message.text}
        </div>
      )}

      <div>
        <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">Identitas Website</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Nama Website / Aplikasi</label>
            <input
              type="text"
              name="siteName"
              defaultValue={initialData.siteName}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              placeholder="Contoh: ais-showcase"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Logo (Upload Gambar)</label>
            <div className="flex items-center gap-4">
              {initialData.siteLogoUrl && (
                <img src={initialData.siteLogoUrl} alt="Logo" className="h-10 w-auto object-contain bg-slate-100 rounded-lg p-1" />
              )}
              <input
                type="file"
                name="siteLogo"
                accept="image/*"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Kosongkan jika tidak ingin mengubah logo saat ini.</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4 mt-8">Konten Halaman Utama (Hero)</h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Tagline (Judul Utama)</label>
            <input
              type="text"
              name="heroTagline"
              defaultValue={initialData.heroTagline}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              placeholder="Kerja Tim Rapi Tanpa Drama."
            />
            <p className="text-xs text-slate-500">Catatan: Untuk membuat baris baru, Anda tidak bisa menggunakan enter di text field ini secara langsung, jadi buatlah dalam 1 kalimat padat.</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Deskripsi Singkat</label>
            <textarea
              name="heroDescription"
              defaultValue={initialData.heroDescription}
              required
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
              placeholder="Deskripsi singkat..."
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30"
        >
          {isSaving ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </div>
    </form>
  );
}
