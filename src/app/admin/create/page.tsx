import { createShowcaseApp } from "../actions";
import Link from "next/link";

export default function CreateAppPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Tambah Aplikasi</h1>
          <p className="text-slate-500 mt-1">Tambahkan aplikasi baru ke gallery showcase</p>
        </div>
        <Link href="/admin" className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-5 py-2.5 rounded-xl font-bold transition-all">
          Kembali
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
        <form action={createShowcaseApp} className="space-y-6 max-w-2xl">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nama Aplikasi *</label>
            <input type="text" name="name" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Slug *</label>
            <input type="text" name="slug" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900" placeholder="contoh: aplikasi-hris" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Tagline</label>
            <input type="text" name="tagline" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi</label>
            <textarea name="description" rows={4} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Kategori</label>
              <input type="text" name="category" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">URL Aplikasi</label>
              <input type="url" name="appUrl" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Default Device</label>
              <select name="defaultDevice" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900">
                <option value="phone">Smartphone (Phone)</option>
                <option value="tablet">Tablet (iPad Landscape)</option>
                <option value="laptop">Laptop (Macbook)</option>
                <option value="browser">Browser Window</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Card Background</label>
              <select name="cardBg" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900">
                <option value="gradient-blue">Blue Gradient</option>
                <option value="gradient-purple">Purple Gradient</option>
                <option value="gradient-emerald">Emerald Gradient</option>
                <option value="gradient-rose">Rose Gradient</option>
                <option value="gradient-amber">Amber Gradient</option>
                <option value="gradient-dark">Dark Minimalist</option>
              </select>
            </div>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="isPublished" name="isPublished" className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500" />
            <label htmlFor="isPublished" className="ml-2 text-sm font-medium text-slate-700">Published (Tampilkan ke Publik)</label>
          </div>
          <div className="pt-4 border-t border-slate-100">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md">
              Simpan Aplikasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
