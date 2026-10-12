import React from "react";
import Image from "next/image";
import brandsData from "@/data/brands.json";

interface Brand {
  name: string;
  /** Path under public/, e.g. "/logos/bluhawk.png". */
  logo?: string;
  /** Whether to show text name alongside logo. Default true if no logo. */
  showName?: boolean;
}

const brands: Brand[] = brandsData;

function BrandTile({ brand }: { brand: Brand }) {
  const showText = brand.showName ?? !brand.logo;

  return (
    <div className="flex h-[56px] min-w-[130px] shrink-0 items-center justify-center gap-2.5 rounded-[16px] bg-white px-4 py-2 shadow-sm transition-transform hover:scale-[1.03] md:h-[68px] md:min-w-[160px] md:px-5">
      {brand.logo ? (
        <Image
          src={brand.logo}
          alt={brand.name}
          width={120}
          height={44}
          className="max-h-9 w-auto object-contain md:max-h-11"
        />
      ) : null}
      {showText && (
        <span className="text-center text-[13px] font-bold tracking-tight text-[#14141C] md:text-sm whitespace-nowrap">
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

        {/* Desktop: one centred row */}
        <div className="hidden flex-wrap items-center justify-center gap-6 md:flex">
          {brands.map((b) => (
            <BrandTile key={b.name} brand={b} />
          ))}
        </div>
      </div>

      {/* Phone: slow auto-scroll (static, swipeable row when reduced motion is on) */}
      <div className="relative md:hidden">
        <div className="no-scrollbar overflow-hidden motion-reduce:overflow-x-auto">
          <div className="animate-marquee flex w-max motion-reduce:pl-5">
            {[...brands, ...brands].map((b, i) => (
              <div
                key={`${b.name}-${i}`}
                aria-hidden={i >= brands.length}
                className={i >= brands.length ? "pr-4 motion-reduce:hidden" : "pr-4"}
              >
                <BrandTile brand={b} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
