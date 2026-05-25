/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { prisma } from "@/lib/db";
import Link from "next/link";
import { HomeGalleryClient } from "./home-gallery-client";

import { getSystemSettings } from "@/lib/settings";

export default async function Home({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const showcases = await prisma.showcaseApp.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
    include: {
      media: {
        orderBy: { order: "asc" },
      },
    },
  });

  const settings = await getSystemSettings();
  const siteName = settings.appName || "ShowcaseApp";
  const siteLogoUrl = settings.appLogo || "";
  
  // AppHub description or default if none
  const heroDescription = settings.appDescription || "Kelola tugas, pantau progress, dan buat laporan proyek dalam satu platform — lengkap dengan kurva S dan komunikasi tim yang terhubung.";

  // Hardcode a default tagline for Showcase if no specific tagline exists in system settings
  const heroTagline = "Pusat Aplikasi Internal Terpadu.";
  const taglineWords = heroTagline.split(" ");
  const taglineFirstPart = taglineWords.slice(0, -2).join(" ");
  const taglineGradientPart = taglineWords.slice(-2).join(" ");

  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-12 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          {siteLogoUrl ? (
            <img src={siteLogoUrl} alt={siteName} className="h-8 max-w-[120px] object-contain" />
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
          )}
          <span className="text-xl font-black text-slate-900 tracking-tight">
            {siteName}<span className="text-blue-600">.</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-blue-500/25">
            Panel Admin →
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f0f9ff] to-white pt-24 pb-2 px-6 flex items-center">
        {/* Decorative blobs/gradients behind */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-cyan-100/50 via-blue-50/20 to-transparent rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-50/50 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column (Text) */}
          <div className="max-w-2xl">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span className="text-sm font-bold text-blue-700 tracking-wide">Zona Aplikasi Internal sekolah</span>
            </div>
            
            {/* Heading */}
            <h1 className="text-6xl lg:text-[5.5rem] font-black text-slate-900 tracking-tight leading-[1.05] mb-6">
              {taglineFirstPart} <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                {taglineGradientPart}
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-lg font-medium">
              {heroDescription}
            </p>
            
            {/* Elements removed per user request */}
          </div>
          
          {/* Right Column (Mockups) */}
          <div className="relative h-[650px] hidden lg:block w-full">
            
            {/* Laptop Mockup (Background) */}
            <div className="absolute top-12 right-0 w-[520px] h-[340px] bg-slate-800 rounded-t-xl rounded-b-sm shadow-2xl border-[8px] border-slate-800 border-b-[16px] z-10 overflow-hidden transform transition-transform duration-500 hover:-translate-y-2">
               <div className="w-full h-full bg-slate-50 flex flex-col relative">
                  {/* Browser Header */}
                  <div className="h-10 bg-slate-200/80 flex items-center px-4 gap-2 border-b border-slate-300">
                     <div className="w-3 h-3 rounded-full bg-rose-400 shadow-sm border border-black/10"></div>
                     <div className="w-3 h-3 rounded-full bg-amber-400 shadow-sm border border-black/10"></div>
                     <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm border border-black/10"></div>
                     <div className="ml-4 flex-1 h-5 bg-white rounded-md shadow-sm border border-slate-200 flex items-center px-3">
                        <div className="w-24 h-2 bg-slate-200 rounded-full"></div>
                     </div>
                  </div>
                  {/* Content */}
                  <div className="flex-1 flex gap-4 p-4">
                     <div className="w-32 bg-white rounded-lg shadow-sm border border-slate-100 p-3 space-y-3">
                        <div className="w-full h-3 bg-slate-200 rounded-full"></div>
                        <div className="w-2/3 h-2 bg-slate-100 rounded-full mt-4"></div>
                        <div className="w-3/4 h-2 bg-slate-100 rounded-full"></div>
                        <div className="w-1/2 h-2 bg-slate-100 rounded-full"></div>
                        <div className="w-2/3 h-2 bg-slate-100 rounded-full mt-4"></div>
                        <div className="w-3/4 h-2 bg-slate-100 rounded-full"></div>
                     </div>
                     <div className="flex-1 space-y-4">
                        <div className="h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-inner p-4 text-white">
                           <div className="w-24 h-4 bg-white/20 rounded-full mb-3"></div>
                           <div className="w-48 h-3 bg-white/20 rounded-full mb-1.5"></div>
                           <div className="w-32 h-3 bg-white/20 rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="h-24 bg-white rounded-xl shadow-sm border border-slate-100 p-3 flex flex-col justify-between">
                              <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <div className="w-16 h-3 bg-slate-200 rounded-full"></div>
                           </div>
                           <div className="h-24 bg-white rounded-xl shadow-sm border border-slate-100 p-3 flex flex-col justify-between">
                              <div className="w-8 h-8 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                              </div>
                              <div className="w-16 h-3 bg-slate-200 rounded-full"></div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               {/* Laptop Base Lip */}
               <div className="absolute bottom-0 w-full h-1.5 bg-slate-400 z-20 shadow-inner"></div>
            </div>

            {/* iPad Mockup (Middle Left) */}
            <div className="absolute top-52 right-72 w-[260px] h-[360px] bg-slate-50 rounded-[1.5rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.25)] border-[12px] border-slate-900 z-20 overflow-hidden ring-1 ring-black/10 transform transition-transform duration-500 hover:-translate-y-2">
               <div className="w-full h-full flex flex-col">
                  {/* iPad Header */}
                  <div className="pt-4 pb-2 px-4 bg-white border-b border-slate-100 flex items-center justify-between">
                     <div className="w-24 h-3 bg-slate-200 rounded-full"></div>
                     <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                       <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                     </div>
                  </div>
                  <div className="flex-1 p-4 space-y-3 overflow-hidden">
                     <div className="h-24 bg-indigo-50 rounded-xl border border-indigo-100 p-3 flex flex-col justify-center">
                        <div className="w-12 h-3 bg-indigo-200 rounded-full mb-3"></div>
                        <div className="w-full h-2 bg-indigo-100 rounded-full mb-1.5"></div>
                        <div className="w-2/3 h-2 bg-indigo-100 rounded-full"></div>
                     </div>
                     <div className="flex gap-3">
                        <div className="flex-1 h-20 bg-white rounded-xl shadow-sm border border-slate-100 p-2">
                           <div className="w-6 h-6 bg-slate-100 rounded-md mb-2"></div>
                           <div className="w-12 h-2 bg-slate-200 rounded-full"></div>
                        </div>
                        <div className="flex-1 h-20 bg-white rounded-xl shadow-sm border border-slate-100 p-2">
                           <div className="w-6 h-6 bg-slate-100 rounded-md mb-2"></div>
                           <div className="w-12 h-2 bg-slate-200 rounded-full"></div>
                        </div>
                     </div>
                     <div className="h-20 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center px-4 gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                           <div className="w-full h-2 bg-slate-200 rounded-full"></div>
                           <div className="w-1/2 h-2 bg-slate-100 rounded-full"></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* iPhone Mockup (Front Right) */}
            <div className="absolute top-44 right-12 w-[160px] h-[340px] bg-white rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] border-[8px] border-slate-900 z-30 overflow-hidden transform transition-transform duration-500 hover:-translate-y-2 ring-[4px] ring-black/5">
               {/* Dynamic Island */}
               <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-4 bg-slate-900 rounded-full z-40 flex items-center justify-between px-1">
                 <div className="w-1.5 h-1.5 bg-slate-800 rounded-full"></div>
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
               </div>
               {/* Screen */}
               <div className="w-full h-full bg-slate-50 flex flex-col pt-8">
                  <div className="px-3 pb-3 flex-1 overflow-hidden">
                     <div className="h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl mb-3 shadow-md shadow-emerald-500/20 p-3 flex flex-col justify-center">
                        <div className="w-10 h-2 bg-white/40 rounded-full mb-3"></div>
                        <div className="w-full h-2 bg-white/40 rounded-full mb-1.5"></div>
                        <div className="w-3/4 h-2 bg-white/40 rounded-full"></div>
                     </div>
                     <div className="space-y-2">
                        {[1,2,3].map(i => (
                           <div key={i} className="h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center px-2 gap-2">
                              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <div className="flex-1 space-y-1.5">
                                 <div className="w-full h-1.5 bg-slate-200 rounded-full"></div>
                                 <div className="w-2/3 h-1.5 bg-slate-100 rounded-full"></div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                  {/* Bottom nav */}
                  <div className="h-12 bg-white border-t border-slate-100 flex items-center justify-around px-2 pb-1 shadow-[0_-5px_10px_rgba(0,0,0,0.02)]">
                     <div className="w-5 h-5 bg-blue-500 rounded-md shadow-sm"></div>
                     <div className="w-5 h-5 bg-slate-200 rounded-md"></div>
                     <div className="w-5 h-5 bg-slate-200 rounded-md"></div>
                  </div>
               </div>
            </div>

            {/* Floating Elements / Icons */}
            <div className="absolute top-16 right-[480px] w-12 h-12 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] flex items-center justify-center text-blue-500 z-40 animate-[bounce_4s_infinite]">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
               </svg>
            </div>
            <div className="absolute bottom-20 right-8 w-12 h-12 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] flex items-center justify-center text-emerald-500 z-40 animate-[bounce_5s_infinite_1s]">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
            </div>
            <div className="absolute top-1/2 right-[540px] w-10 h-10 bg-white rounded-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] flex items-center justify-center text-rose-500 z-40 animate-[bounce_6s_infinite_0.5s]">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
               </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="pt-2 pb-20 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-slate-900">Gallery Aplikasi</h2>
          <span className="text-slate-500 text-sm font-medium">{showcases.length} Aplikasi</span>
        </div>

        <HomeGalleryClient showcases={showcases} initialCategory={searchParams?.category} />
      </section>
    </main>
  );
}
