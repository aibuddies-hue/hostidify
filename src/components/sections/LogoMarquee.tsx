import React from "react";
import Image from "next/image";
import brandsData from "@/data/brands.json";

interface Brand {
  name: string;
  /** Path under public/, e.g. "/logos/bluhawk.png". */
  logo?: string;
  /** Whether to show text name alongside logo. Default true if no logo. */
  showName?: boolean;
  presentation?: string;
  dark?: boolean;
  width?: number;
  height?: number;
}

const brands: Brand[] = brandsData;

function BrandTile({ brand }: { brand: Brand }) {
  const showText = brand.showName ?? !brand.logo;

  return (
    <div className={`brand-tile ${brand.dark ? "brand-tile-dark" : ""}`}>
      {brand.logo ? (
        <Image
          src={brand.logo}
          alt={brand.name}
          width={brand.width || (brand.presentation === "square" ? 164 : 160)}
          height={brand.height || (brand.presentation === "square" ? 164 : 70)}
          sizes="(max-width: 767px) 160px, 176px"
          className={brand.presentation === "square" ? "brand-logo-square" : brand.presentation === "portrait" ? "brand-logo-portrait" : brand.presentation === "symbol" ? "brand-logo-symbol" : showText ? "brand-logo-with-name" : "brand-logo"}
        />
      ) : null}
      {showText && (
        <span className="text-center text-[13px] font-bold tracking-tight text-[#263843] whitespace-nowrap">
          {brand.name}
        </span>
      )}
    </div>
  );
}

export function LogoMarquee() {
  if (brands.length === 0) return null;

  return (
    <section aria-labelledby="brands-heading" className="section-alt overflow-hidden border-y border-white/[0.06] py-12 md:py-16">
      <div className="container-page">
        <h2 id="brands-heading" className="type-h3 mb-8 text-center text-white">
          Trusted by brands we edit for
        </h2>

        {/* Every brand stays visible: two columns on phones, six on wide screens. */}
        <div className="brand-grid">
          {brands.map((b) => (
            <BrandTile key={b.name} brand={b} />
          ))}
        </div>
      </div>
    </section>
  );
}
