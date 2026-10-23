import Image from "next/image";
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

const brands = brandsData as Brand[];
const rows = [
  brands.filter((_, index) => index % 2 === 0),
  brands.filter((_, index) => index % 2 === 1),
].filter((row) => row.length > 0);

function BrandTile({ brand, duplicate }: { brand: Brand; duplicate: boolean }) {
  return (
    <li className={`client-logo-tile ${brand.dark ? "client-logo-dark" : ""} client-logo-${brand.treatment || brand.presentation || "default"}`}>
      {brand.logo && (
        <Image
          src={brand.logo}
          alt={duplicate ? "" : brand.name}
          width={brand.width || 320}
          height={brand.height || 160}
          sizes={brand.treatment === "golden" ? "(max-width: 639px) 280px, 360px" : brand.treatment === "sabrosa" ? "(max-width: 639px) 220px, 280px" : "(max-width: 639px) 108px, 144px"}
          className="client-logo-image"
        />
      )}
      {(brand.showName ?? !brand.logo) && <span className="client-logo-name">{brand.name}</span>}
    </li>
  );
}

function BrandRow({ row, reverse, index }: { row: Brand[]; reverse: boolean; index: number }) {
  return (
    <div className="client-brands-window" aria-label={`Client logo row ${index + 1}`}>
      <div className={`client-brands-track ${reverse ? "client-brands-track-reverse" : ""}`}>
        <ul className="client-brands-group" aria-label="Brands we edit for">
          {row.map((brand) => <BrandTile key={brand.name} brand={brand} duplicate={false} />)}
        </ul>
        <ul className="client-brands-group client-brands-copy" aria-hidden="true">
          {row.map((brand) => <BrandTile key={brand.name} brand={brand} duplicate />)}
        </ul>
      </div>
    </div>
  );
}

export function LogoMarquee() {
  if (!brands.length) return null;
  return (
    <section aria-labelledby="brands-heading" className="client-brands section-alt border-y border-white/[0.06]">
      <div className="container-page client-brands-heading">
        <h2 id="brands-heading" className="type-h3 text-white">Trusted by brands we edit for</h2>
      </div>
      <div className="client-brands-rows">
        {rows.map((row, index) => <BrandRow key={index} row={row} reverse={index % 2 === 1} index={index} />)}
      </div>
    </section>
  );
}
