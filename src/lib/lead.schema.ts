import { z } from "zod";

// Every choice starts empty in the form and must be picked by the visitor.
export const INDUSTRIES = ["Real estate", "Coach or consultant", "Course creator", "E-commerce", "Other"] as const;
export const MONTHLY_VIDEOS = ["0–5", "5–10", "10–20", "20+"] as const;
export const CURRENT_EDITOR = ["Myself", "Freelancer", "In-house editor", "Agency"] as const;
export const BUDGETS = ["Under $500", "$500–$1,000", "$1,000–$2,000", "$2,000+"] as const;
export const PLANS = ["Growth", "Authority", "Not sure"] as const;

const choose = (label: string) => ({
  errorMap: () => ({ message: `Please choose ${label}` }),
});

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  whatsapp: z.string().trim().min(8, "Please enter a valid WhatsApp number").max(24).regex(/^[+\d\s()-]+$/, "Please enter a valid WhatsApp number"),
  email: z.string().trim().email("Please enter a valid email").max(254),
  businessName: z.string().trim().min(1, "Please enter your business name").max(200),
  industry: z.enum(INDUSTRIES, choose("your industry")),
  socialLink: z.string().trim().max(2048).optional(),
  monthlyVideos: z.enum(MONTHLY_VIDEOS, choose("how many videos you post")),
  currentEditor: z.enum(CURRENT_EDITOR, choose("how you edit now")),
  contentChallenge: z.string().trim().max(3000).optional(),
  budgetRange: z.enum(BUDGETS, choose("a budget range")),
  preferredPlan: z.enum(PLANS, choose("a plan")),
  qualified: z.boolean(),
  eventId: z.string().max(128).regex(/^[a-zA-Z0-9_-]+$/).optional(),
  utm: z
    .object({
      utm_source: z.string().max(2048).optional(),
      utm_medium: z.string().max(2048).optional(),
      utm_campaign: z.string().max(2048).optional(),
      utm_content: z.string().max(2048).optional(),
      utm_term: z.string().max(2048).optional(),
      fbclid: z.string().max(2048).optional(),
      fbp: z.string().max(2048).optional(),
      fbc: z.string().max(2048).optional(),
      landing_url: z.string().max(2048).optional(),
      referrer: z.string().max(2048).optional(),
    })
    .optional(),
});

export type LeadFormData = z.infer<typeof leadSchema>;

/** Budget of $500 or more goes to Cal.com; under $500 gets the free sample-edit prompt. */
export const isQualifiedBudget = (budget: LeadFormData["budgetRange"]) => budget !== "Under $500";
