import React from "react";
import { cn } from "@/lib/utils";

type DeviceType = "phone" | "tablet" | "laptop" | "browser" | "imac";

interface DeviceMockupProps {
  type: DeviceType;
  children: React.ReactNode;
  className?: string;
}

export function DeviceMockup({ type, children, className }: DeviceMockupProps) {
  // 📱 iPhone
  if (type === "phone") {
    return (
      <div className={cn("device-iphone max-w-full mx-auto", className)}>
        <div className="mockup-content">{children}</div>
      </div>
    );
  }

  // 📟 iPad
  if (type === "tablet") {
    return (
      <div className={cn("device-ipad max-w-full mx-auto", className)}>
        <div className="mockup-content">{children}</div>
      </div>
    );
  }

  // 💻 MacBook
  if (type === "laptop") {
    return (
      <div className={cn("relative w-[800px] max-w-full mx-auto", className)}>
        {/* Screen */}
        <div className="device-macbook mx-auto" style={{ width: "100%" }}>
          {/* Camera dot */}
          <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[6px] h-[6px] rounded-full bg-[#333] z-10 shadow-[0_0_0_1.5px_#555]" />
          <div className="mockup-content">{children}</div>
        </div>
        {/* Base / Hinge */}
        <div className="relative mx-auto" style={{ width: "110%", marginLeft: "-5%" }}>
          <div className="h-[4px] sm:h-[6px] bg-gradient-to-b from-[#c0c0c0] to-[#a0a0a0] rounded-b-sm" />
          <div className="h-[8px] sm:h-[16px] bg-gradient-to-b from-[#d1d5db] to-[#9ca3af] rounded-b-[8px] sm:rounded-b-[12px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]">
            <div className="absolute bottom-[2px] sm:bottom-[4px] left-1/2 -translate-x-1/2 w-[30px] sm:w-[60px] h-[3px] sm:h-[4px] bg-[#b0b0b0] rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  // 🖥️ Browser Window
  if (type === "browser") {
    return (
      <div className={cn("device-browser w-full max-w-[900px] mx-auto", className)}>
        <div className="device-browser-header">
          <div className="browser-dots hidden sm:flex">
            <span />
            <span />
            <span />
          </div>
          <div className="browser-address">app.ais.sch.id</div>
        </div>
        <div className="mockup-content">{children}</div>
      </div>
    );
  }

  // Fallback
  return (
    <div className={cn("mockup-container w-full max-w-[800px] mx-auto", className)}>
      <div className="mockup-content w-full h-full rounded-xl shadow-2xl border border-slate-200">
        {children}
      </div>
    </div>
  );
}
