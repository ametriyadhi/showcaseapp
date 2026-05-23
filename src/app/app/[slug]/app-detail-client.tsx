"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { DeviceMockup } from "@/components/device-mockup";

type DeviceType = "phone" | "tablet" | "laptop" | "browser" | "imac";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AppDetailClient({ app }: { app: any }) {
  const [device, setDevice] = useState<DeviceType>(app.defaultDevice as DeviceType);
  const [activeIndex, setActiveIndex] = useState(0);

  // Filter media by matching mockup
  const filteredMedia = useMemo(() => {
    return app.media.filter((m: any) => (m.mockup || "phone") === device);
  }, [app.media, device]);

  const currentMedia = filteredMedia[activeIndex] || null;

  const handleDeviceSwitch = (newDevice: DeviceType) => {
    setDevice(newDevice);
    setActiveIndex(0);
  };

  const goPrev = () => setActiveIndex((i) => (i - 1 + filteredMedia.length) % filteredMedia.length);
  const goNext = () => setActiveIndex((i) => (i + 1) % filteredMedia.length);

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-slate-500 hover:text-slate-900 transition-colors font-medium text-sm flex items-center gap-2">
              ← Kembali ke Gallery
            </Link>
            <div className="w-px h-4 bg-slate-300"></div>
            <h1 className="font-bold text-slate-900">{app.name}</h1>
          </div>
          
          {app.appUrl && (
            <a href={app.appUrl} target="_blank" rel="noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-md shadow-blue-500/20">
              Buka Aplikasi ↗
            </a>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Device Mockup */}
        <div className="lg:col-span-8 flex flex-col items-center">
          {/* Template Switcher */}
          <div className="bg-white p-1.5 rounded-full border border-slate-200 shadow-sm flex gap-1 mb-8">
            {[
              { id: "phone", label: "📱 Phone" },
              { id: "tablet", label: "📟 Tablet" },
              { id: "laptop", label: "💻 Laptop" },
              { id: "browser", label: "🖥️ Browser" },
            ].map((d) => {
              const count = app.media.filter((m: any) => (m.mockup || "phone") === d.id).length;
              return (
                <button
                  key={d.id}
                  onClick={() => handleDeviceSwitch(d.id as DeviceType)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-1.5 ${
                    device === d.id ? "bg-slate-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {d.label}
                  {count > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      device === d.id ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Mockup Display */}
          <div className="relative w-full flex justify-center items-center min-h-[300px] md:min-h-[600px] bg-slate-100 rounded-3xl border border-slate-200 p-4 sm:p-6 md:p-8 shadow-inner overflow-hidden group/display">
            {currentMedia ? (
              <div className="w-full min-w-0 flex justify-center scale-95 md:scale-100 transform transition-transform duration-500">
                <DeviceMockup type={device} className="max-w-full">
                  {currentMedia.type === "screenshot" && (
                    <img src={currentMedia.url} alt="Screenshot" className="w-full h-full object-cover" />
                  )}
                  {currentMedia.type === "video" && (
                    <video 
                      src={currentMedia.url} 
                      poster={currentMedia.thumbnail}
                      controls
                      autoPlay
                      muted
                      loop
                      className="w-full h-full object-cover"
                    />
                  )}
                  {currentMedia.type === "youtube" && (
                    <iframe 
                      src={currentMedia.url} 
                      allow="autoplay; encrypted-media" 
                      allowFullScreen
                      className="w-full h-full bg-black"
                    />
                  )}
                </DeviceMockup>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-4xl mb-3">🖼️</p>
                <p className="text-slate-400 font-bold">Tidak ada media untuk tampilan ini</p>
                <p className="text-slate-400 text-sm mt-1">Upload media dengan mockup &quot;{device}&quot; di admin panel</p>
              </div>
            )}

            {/* Arrow Navigation — only when multiple media */}
            {filteredMedia.length > 1 && (
              <>
                {/* Prev */}
                <button
                  onClick={goPrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all opacity-0 group-hover/display:opacity-100 hover:scale-110 z-20"
                  aria-label="Sebelumnya"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Next */}
                <button
                  onClick={goNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all opacity-0 group-hover/display:opacity-100 hover:scale-110 z-20"
                  aria-label="Selanjutnya"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm opacity-0 group-hover/display:opacity-100 transition-opacity z-20">
                  {activeIndex + 1} / {filteredMedia.length}
                  {currentMedia?.caption && <span className="ml-2 opacity-75">· {currentMedia.caption}</span>}
                </div>
              </>
            )}
          </div>

          {/* Media Thumbnails — only show filtered media */}
          {filteredMedia.length > 1 && (
            <div className="flex gap-4 mt-8 overflow-x-auto pb-4 w-full max-w-2xl justify-center">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {filteredMedia.map((m: any, idx: number) => (
                <button 
                  key={m.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    activeIndex === idx ? "border-blue-500 shadow-lg scale-110 z-10" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  {m.type === "screenshot" ? (
                    <img src={m.url} className="w-full h-full object-cover" alt="Thumb" />
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white text-xs">
                      ▶ Video
                    </div>
                  )}
                  {m.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-1 py-0.5 truncate">
                      {m.caption}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: App Info */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              {app.category || "General"}
            </span>
            <h2 className="text-3xl font-black text-slate-900 mb-4 leading-tight">{app.name}</h2>
            <p className="text-slate-600 text-base leading-relaxed mb-8">{app.description}</p>
            
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-4">Fitur Utama</h3>
            <ul className="space-y-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {app.features.map((f: any) => (
                <li key={f.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0 text-lg border border-slate-100 shadow-sm">
                    {f.icon || "✨"}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{f.title}</h4>
                    {f.desc && <p className="text-slate-500 text-xs mt-0.5">{f.desc}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
