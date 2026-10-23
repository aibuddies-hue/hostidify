"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import brandsData from "@/data/brands.json";

interface Brand {
  name: string;
  logo?: string;
  showName?: boolean;
  presentation?: string;
  dark?: boolean;
  width?: number;
  height?: number;
  treatment?: string;
}
const brands: Brand[] = brandsData;

function BrandTile({ brand, duplicate }: { brand: Brand; duplicate: boolean }) {
  return (
    <li className={`client-logo-tile ${brand.dark ? "client-logo-dark" : ""} client-logo-${brand.treatment || brand.presentation || "default"}`}>
      {brand.logo && <Image src={brand.logo} alt={duplicate ? "" : brand.name} width={brand.width || 320} height={brand.height || 160} sizes={brand.treatment === "golden" ? "(max-width: 639px) 320px, 400px" : brand.treatment === "sabrosa" ? "(max-width: 639px) 256px, 320px" : "(max-width: 639px) 124px, 160px"} className="client-logo-image" />}
      {(brand.showName ?? !brand.logo) && <span className="client-logo-name">{brand.name}</span>}
    </li>
  );
}

export function LogoMarquee() {
  const [paused, setPaused] = useState(false);
  if (!brands.length) return null;
  return (
    <section aria-labelledby="brands-heading" className="client-brands section-alt border-y border-white/[0.06]">
      <div className="container-page client-brands-heading">
        <h2 id="brands-heading" className="type-h3 text-white">Trusted by brands we edit for</h2>
        <button type="button" className="client-brands-toggle" aria-label={paused ? "Resume brand logos" : "Pause brand logos"} aria-pressed={paused} onClick={() => setPaused(!paused)}>
          {paused ? <Play size={15} aria-hidden /> : <Pause size={15} aria-hidden />}
        </button>
      </div>
      <div className="client-brands-window" data-paused={paused} tabIndex={0} role="region" aria-label="Client logos; pause to browse" onPointerDown={(event) => { if (event.pointerType === "touch") setPaused(true); }}>
        <div className="client-brands-track">
          <ul className="client-brands-group" aria-label="Brands we edit for">
            {brands.map((brand) => <BrandTile key={brand.name} brand={brand} duplicate={false} />)}
          </ul>
          <ul className="client-brands-group client-brands-copy" aria-hidden="true">
            {brands.map((brand) => <BrandTile key={brand.name} brand={brand} duplicate />)}
          </ul>
        </div>
      </div>
    </section>
  );
}
