/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";

const CARD_GRADIENTS: Record<string, string> = {
  "gradient-blue":    "from-blue-50 via-blue-100 to-indigo-200",
  "gradient-purple":  "from-purple-50 via-purple-100 to-violet-200",
  "gradient-emerald": "from-emerald-50 via-emerald-100 to-teal-200",
  "gradient-rose":    "from-rose-50 via-rose-100 to-pink-200",
  "gradient-amber":   "from-amber-50 via-orange-100 to-yellow-200",
  "gradient-dark":    "from-slate-800 via-slate-900 to-slate-950",
};

type MediaItem = {
  id: string;
  url: string;
  type: string;
  mockup: string;
  order: number;
};

type ShowcaseApp = {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  slug: string;
  cardBg: string;
  category: string | null;
  defaultDevice: string;
  media: MediaItem[];
};

export function HomeGalleryClient({ 
  showcases,
  initialCategory = "Semua"
}: { 
  showcases: ShowcaseApp[];
  initialCategory?: string;
}) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  // Sync state if initialCategory changes (e.g. back button)
  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    // Update the browser URL without full Next.js page data refetching
    const params = new URLSearchParams(window.location.search);
    if (cat === "Semua") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    const queryStr = params.toString();
    const newUrl = `${window.location.pathname}${queryStr ? `?${queryStr}` : ""}`;
    window.history.pushState(null, "", newUrl);
  };

  // Derive unique categories dynamically
  const categories = useMemo(() => {
    const list = new Set<string>();
    showcases.forEach((app) => {
      if (app.category) {
        list.add(app.category);
      }
    });
    return ["Semua", ...Array.from(list)];
  }, [showcases]);

  // Compute count of active apps for each category
  const counts = useMemo(() => {
    const map: Record<string, number> = { Semua: showcases.length };
    showcases.forEach((app) => {
      if (app.category) {
        map[app.category] = (map[app.category] || 0) + 1;
      }
    });
    return map;
  }, [showcases]);

  // Filter showcases by selected category
  const filteredShowcases = useMemo(() => {
    if (activeCategory === "Semua") return showcases;
    return showcases.filter((app) => app.category === activeCategory);
  }, [showcases, activeCategory]);

  return (
    <div>
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-3 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`group px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
              activeCategory === cat
                ? "bg-slate-900 text-white shadow-lg shadow-slate-900/25 scale-105"
                : "bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300 hover:scale-105 active:scale-95"
            }`}
          >
            <span>{cat}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
              }`}
            >
              {counts[cat] || 0}
            </span>
          </button>
        ))}
      </div>

      {filteredShowcases.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm animate-fade-in">
          <p className="text-4xl mb-4">✨</p>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Belum ada aplikasi dalam kategori ini</h3>
          <p className="text-slate-500">Silakan pilih kategori lain atau login ke admin panel untuk menambahkan konten.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {filteredShowcases.map((app) => {
            const laptopImg  = app.media.find((m: any) => m.mockup === "laptop"  && m.type === "screenshot");
            const tabletImg  = app.media.find((m: any) => m.mockup === "tablet"  && m.type === "screenshot");
            const phoneImg   = app.media.find((m: any) => m.mockup === "phone"   && m.type === "screenshot");
            const browserImg = app.media.find((m: any) => m.mockup === "browser" && m.type === "screenshot");

            const gradClass = CARD_GRADIENTS[app.cardBg] || CARD_GRADIENTS["gradient-blue"];
            const isDark = app.cardBg === "gradient-dark";

            return (
              <div
                key={app.id}
                className={`relative rounded-[2rem] bg-gradient-to-br ${gradClass} border border-black/5 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden group animate-slide-up`}
              >
                {/* Top info bar */}
                <div className="px-8 pt-8 pb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? "bg-white/10 text-white/70" : "bg-black/10 text-black/60"}`}>
                    {app.category || "General"}
                  </span>
                  <h3 className={`text-2xl font-black leading-tight mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                    {app.name}
                  </h3>
                  <p className={`text-sm font-medium line-clamp-2 ${isDark ? "text-white/60" : "text-slate-600"}`}>
                    {app.tagline || app.description}
                  </p>
                </div>

                {/* Device Stage */}
                <div className="relative h-64 sm:h-72 md:h-80 mx-6 mb-0 overflow-visible mt-4">

                  {app.defaultDevice === "composition" && (
                    <>
                      {/* ── LAPTOP (back-center) ── */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[72%] max-w-[360px] z-10 drop-shadow-2xl group-hover:-translate-y-2 transition-transform duration-500">
                        {/* Screen */}
                        <div className="bg-[#111] rounded-t-xl px-[6px] pt-[6px] pb-0 shadow-[inset_0_0_0_1.5px_#444]" style={{aspectRatio:"16/10"}}>
                          <div className="w-full h-full rounded-t-lg overflow-hidden bg-slate-800">
                            {(laptopImg || browserImg) ? (
                              <img src={(laptopImg || browserImg)?.url || ""} alt="Laptop" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-bold">
                                💻
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Hinge + base */}
                        <div className="h-[5px] bg-gradient-to-b from-[#bbb] to-[#999] w-full" />
                        <div className="h-[10px] bg-gradient-to-b from-[#d1d5db] to-[#aaa] rounded-b-lg w-full" />
                      </div>

                      {/* ── iPad (front-right) ── */}
                      <div className="absolute bottom-0 right-[2%] w-[34%] max-w-[160px] z-20 drop-shadow-xl group-hover:-translate-y-1 group-hover:rotate-1 transition-transform duration-500">
                        <div className="bg-[#222] rounded-xl p-[5px] shadow-[inset_0_0_0_1.5px_#555]" style={{aspectRatio:"2266/1488"}}>
                          <div className="w-full h-full rounded-[8px] overflow-hidden bg-slate-700">
                            {tabletImg ? (
                              <img src={tabletImg.url} alt="iPad" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-bold">
                                📟
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* ── iPhone (front-left) ── */}
                      <div className="absolute bottom-0 left-[2%] w-[16%] max-w-[80px] z-20 drop-shadow-xl group-hover:-translate-y-1 group-hover:-rotate-1 transition-transform duration-500">
                        <div className="bg-[#111] rounded-[16px] p-[4px] shadow-[inset_0_0_0_1.5px_#444] relative">
                          {/* Dynamic island */}
                          <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[40%] h-[5px] bg-black rounded-full z-10" />
                          <div className="w-full rounded-[12px] overflow-hidden bg-slate-800" style={{aspectRatio:"1179/2556"}}>
                            {phoneImg ? (
                              <img src={phoneImg.url} alt="iPhone" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-500 text-[8px] font-bold">
                                📱
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {(!app.defaultDevice || app.defaultDevice === "phone") && (
                    <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none group-hover:-translate-y-2 transition-transform duration-500">
                      
                      {/* Back Left Phone */}
                      <div className="absolute bottom-0 left-[15%] sm:left-[20%] w-[28%] max-w-[110px] z-10 drop-shadow-xl -rotate-12 translate-y-6 opacity-60 blur-[1px] group-hover:-rotate-[16deg] group-hover:-translate-x-2 transition-all duration-500">
                        <div className="bg-[#222] rounded-[20px] p-[4px] shadow-[inset_0_0_0_1px_#555] relative">
                          <div className="w-full rounded-[16px] overflow-hidden bg-slate-800" style={{aspectRatio:"1179/2556"}}>
                            {phoneImg ? <img src={phoneImg.url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-800"></div>}
                          </div>
                        </div>
                      </div>

                      {/* Back Right Phone */}
                      <div className="absolute bottom-0 right-[15%] sm:right-[20%] w-[28%] max-w-[110px] z-10 drop-shadow-xl rotate-12 translate-y-6 opacity-60 blur-[1px] group-hover:rotate-[16deg] group-hover:translate-x-2 transition-all duration-500">
                        <div className="bg-[#222] rounded-[20px] p-[4px] shadow-[inset_0_0_0_1px_#555] relative">
                          <div className="w-full rounded-[16px] overflow-hidden bg-slate-800" style={{aspectRatio:"1179/2556"}}>
                            {phoneImg ? <img src={phoneImg.url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-800"></div>}
                          </div>
                        </div>
                      </div>

                      {/* Center Main Phone */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[36%] max-w-[140px] z-20 drop-shadow-2xl">
                        <div className="bg-[#111] rounded-[24px] p-[5px] shadow-[inset_0_0_0_1.5px_#444] relative">
                          {/* Dynamic island */}
                          <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[35%] h-[6px] bg-black rounded-full z-10" />
                          <div className="w-full rounded-[20px] overflow-hidden bg-slate-800" style={{aspectRatio:"1179/2556"}}>
                            {phoneImg ? (
                              <img src={phoneImg.url} alt="iPhone" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-500 text-[10px] font-bold text-center px-1">
                                📱
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {app.defaultDevice === "tablet" && (
                    <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none group-hover:-translate-y-2 transition-transform duration-500 flex justify-center items-end">
                      
                      {/* Accessory: Phone behind tablet (Right side) */}
                      <div className="absolute bottom-0 right-[15%] sm:right-[18%] w-[15%] max-w-[70px] z-10 drop-shadow-xl rotate-12 translate-y-4 opacity-70 blur-[1px] group-hover:rotate-[16deg] group-hover:translate-x-2 transition-all duration-500">
                        <div className="bg-[#111] rounded-[14px] p-[3px] shadow-[inset_0_0_0_1px_#444] relative">
                          <div className="absolute top-[4px] left-1/2 -translate-x-1/2 w-[40%] h-[4px] bg-black rounded-full z-10" />
                          <div className="w-full rounded-[10px] overflow-hidden bg-slate-800" style={{aspectRatio:"1179/2556"}}>
                            {phoneImg ? <img src={phoneImg.url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-800"></div>}
                          </div>
                        </div>
                      </div>

                      {/* Main Tablet */}
                      <div className="relative w-[80%] max-w-[400px] z-20 drop-shadow-2xl">
                        <div className="bg-[#222] rounded-[16px] p-[6px] shadow-[inset_0_0_0_1.5px_#555]">
                          <div className="w-full rounded-[10px] overflow-hidden bg-slate-700" style={{aspectRatio:"2266/1488"}}>
                            {tabletImg ? (
                              <img src={tabletImg.url} alt="iPad" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm font-bold">
                                📟 Belum ada Screenshot
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {(app.defaultDevice === "laptop" || app.defaultDevice === "browser") && (
                    <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none group-hover:-translate-y-2 transition-transform duration-500 flex justify-center items-end">
                      
                      {/* Accessory: iPad behind laptop (Left side) */}
                      <div className="absolute bottom-[2%] left-[2%] sm:left-[8%] w-[25%] max-w-[120px] z-10 drop-shadow-xl -rotate-6 opacity-70 blur-[1px] group-hover:-rotate-12 group-hover:-translate-x-2 transition-all duration-500">
                        <div className="bg-[#222] rounded-[12px] p-[4px] shadow-[inset_0_0_0_1px_#555]">
                          <div className="w-full rounded-[8px] overflow-hidden bg-slate-700" style={{aspectRatio:"2266/1488"}}>
                            {tabletImg ? <img src={tabletImg.url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-800"></div>}
                          </div>
                        </div>
                      </div>

                      {/* Accessory: Phone behind laptop (Right side) */}
                      <div className="absolute bottom-0 right-[5%] sm:right-[12%] w-[12%] max-w-[60px] z-10 drop-shadow-xl rotate-12 translate-y-2 opacity-70 blur-[1px] group-hover:rotate-[16deg] group-hover:translate-x-2 transition-all duration-500">
                        <div className="bg-[#111] rounded-[12px] p-[3px] shadow-[inset_0_0_0_1px_#444] relative">
                          <div className="absolute top-[3px] left-1/2 -translate-x-1/2 w-[40%] h-[3px] bg-black rounded-full z-10" />
                          <div className="w-full rounded-[8px] overflow-hidden bg-slate-800" style={{aspectRatio:"1179/2556"}}>
                            {phoneImg ? <img src={phoneImg.url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-800"></div>}
                          </div>
                        </div>
                      </div>

                      {/* Main Laptop */}
                      <div className="relative w-[90%] max-w-[480px] z-20 drop-shadow-2xl">
                        <div className="bg-[#111] rounded-t-2xl px-[8px] pt-[8px] pb-0 shadow-[inset_0_0_0_1.5px_#444]" style={{aspectRatio:"16/10"}}>
                          <div className="w-full h-full rounded-t-xl overflow-hidden bg-slate-800">
                            {(laptopImg || browserImg) ? (
                              <img src={(laptopImg || browserImg)?.url || ""} alt="Laptop" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm font-bold">
                                💻 Belum ada Screenshot
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="h-[6px] bg-gradient-to-b from-[#bbb] to-[#999] w-full" />
                        <div className="h-[12px] bg-gradient-to-b from-[#d1d5db] to-[#aaa] rounded-b-xl w-full" />
                      </div>

                    </div>
                  )}

                </div>

                {/* Bottom bar with Preview button */}
                <div className={`flex items-center justify-between px-8 py-5 border-t ${isDark ? "border-white/10" : "border-black/5"}`}>
                  <div className="flex gap-2">
                    {[
                      { key: "laptop",  label: "💻", has: !!(laptopImg || browserImg) },
                      { key: "tablet",  label: "📟", has: !!tabletImg },
                      { key: "phone",   label: "📱", has: !!phoneImg },
                    ].map(d => (
                      <span
                        key={d.key}
                        className={`text-sm px-2 py-1 rounded-lg font-bold transition-all ${
                          d.has
                            ? isDark ? "bg-white/15 text-white" : "bg-black/10 text-black/70"
                            : isDark ? "bg-white/5 text-white/20" : "bg-black/5 text-black/20"
                        }`}
                        title={d.has ? "Ada media" : "Belum ada media"}
                      >
                        {d.label}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/app/${app.slug}`}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all shadow-lg hover:shadow-slate-900/30 hover:scale-105 active:scale-95"
                  >
                    Preview
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
