// Single source of truth for business facts shown on the page.
// Only put client-confirmed numbers here (source: .inbox/docs/).

const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");

if (!whatsappNumber && typeof window === "undefined") {
  console.warn(
    "[host-editify] NEXT_PUBLIC_WHATSAPP_NUMBER is not set — WhatsApp buttons and links are hidden."
  );
}

export interface Plan {
  name: string;
  audience: string;
  /** Optional plain label above the list, e.g. "Everything in Growth, plus:" */
  lead?: string;
  features: string[];
  cta: string;
  featured?: boolean;
}

export const site = {
  tagline: "You shoot, We deliver",
  headline: "You film it. We edit it. It's ready in 24 hours.",
  deliveryHours: 24, // short-form, counted from footage + brief received
  deliveryFinePrint:
    "For short-form videos, counted from when your footage and brief land in your Drive folder, Mon–Fri (IST / GST).",
  maxClientsPerMonth: 5,
  spotsLeftThisMonth: null as number | null, // set manually; the "X spots left" part hides when null
  freeFirstVideoMaxSeconds: 40,
  callMinutes: 30,
  revisions: { growth: 2, authority: 4 },
  bonuses: {
    hookBank: true,
  },
  plans: [
    {
      name: "Growth",
      audience: "For founders starting to post consistently",
      features: [
        "15 short-form videos a\u00A0month",
        "AI avatar videos",
        "UGC videos",
        "AI ad videos",
        "Motion graphics",
        "Captions & subtitles",
        "Dedicated editor",
        "2 revisions per video",
        "NDA + encrypted files",
        "Weekly project call",
        "Email support",
      ],
      cta: "Book Growth Audit",
    },
    {
      name: "Authority",
      audience: "For brands scaling content across platforms",
      lead: "Everything in Growth, plus:",
      features: [
        "25 short-form + 4 long-form videos a\u00A0month",
        "Advanced motion graphics",
        "Premium captions",
        "Thumbnail design",
        "Priority delivery",
        "4 revisions per video",
      ],
      cta: "Book Authority Audit",
      featured: true,
    },
  ] as Plan[],
  priceLockPromise: true, // FAQ "Will the price go up?" shows only if true
  founder: {
    name: "Dhanraj Singh",
    role: "Founder, Host Editify",
    years: 4,
    clients: "100+", // from the copy doc: "I've helped 100+ businesses and creators"
  },
  links: {
    calcom: process.env.NEXT_PUBLIC_CALCOM_LINK || "hosteditify-n0dlbr/free-content-audit",
    calcomUrl: "https://cal.com/hosteditify-n0dlbr/free-content-audit",
    // null when not configured: never link to a placeholder number
    whatsapp: whatsappNumber || null,
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@hosteditify.com",
    instagram:
      process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/hosteditify",
    linkedin:
      process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com/company/hosteditify",
  },
};

/** WhatsApp deep link with a prefilled message, or null when no number is configured. */
export function whatsappLink(message?: string): string | null {
  if (!site.links.whatsapp) return null;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${site.links.whatsapp}${text}`;
}
