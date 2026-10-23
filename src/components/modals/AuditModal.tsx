"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import Cal, { getCalApi } from "@calcom/embed-react";
import { ArrowLeft, ArrowRight, Calendar, Send, Sparkles, X } from "lucide-react";
import {
  BUDGETS,
  CURRENT_EDITOR,
  INDUSTRIES,
  MONTHLY_VIDEOS,
  PLANS,
  isQualifiedBudget,
  leadSchema,
  type LeadFormData,
} from "@/lib/lead.schema";
import { site, whatsappLink } from "@/lib/site.config";
import { captureAndStoreUtm, generateEventId, getStoredUtm, trackPixelEvent } from "@/lib/tracking";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { cn } from "@/lib/utils";

const countryCodes = [
  { code: "+91", country: "India" },
  { code: "+971", country: "UAE" },
  { code: "+966", country: "Saudi Arabia" },
  { code: "+974", country: "Qatar" },
  { code: "+968", country: "Oman" },
  { code: "+44", country: "UK" },
  { code: "+1", country: "USA/Canada" },
];

/** Guess the visitor's dialling code from timezone, then locale. Defaults to India. */
function detectCountryCode(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz === "Asia/Dubai") return "+971";
    if (tz === "Asia/Kolkata" || tz === "Asia/Calcutta") return "+91";
    const region = (navigator.language.split("-")[1] || "").toUpperCase();
    if (region === "AE") return "+971";
  } catch {}
  return "+91";
}

const STORAGE_KEY = "host_editify_form";
const stepFields: Record<1 | 2, (keyof LeadFormData)[]> = {
  1: ["name", "whatsapp", "email"],
  2: ["businessName", "industry", "monthlyVideos", "currentEditor"],
};
const stepLabels = { 1: "Contact details", 2: "Your business", 3: "Goals and budget" } as const;

const inputBase =
  "w-full rounded-xl border bg-[#0A0A0F] px-4 py-3 text-[15px] text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#A24BFF]";

function Field({
  label,
  error,
  htmlFor,
  optional,
  children,
}: {
  label: string;
  error?: string;
  htmlFor: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="type-small mb-1.5 block font-semibold text-white">
        {label}
        {optional && <span className="font-normal text-[#A0A0B0]"> (optional)</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-[13px] text-[#FF3D8B]">
          {error}
        </p>
      )}
    </div>
  );
}

function Select({
  id,
  placeholder,
  options,
  invalid,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  placeholder: string;
  options: readonly string[];
  invalid?: boolean;
}) {
  return (
    <select
      id={id}
      className={cn(inputBase, "cursor-pointer", invalid ? "border-[#FF3D8B]" : "border-white/10")}
      {...props}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuditModal({ isOpen, onClose }: AuditModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [countryCode, setCountryCode] = useState("+91");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<{ qualified: boolean; data: LeadFormData } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    trigger,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    // Nothing preselected: every choice starts empty and is required
    defaultValues: {
      name: "",
      whatsapp: "",
      email: "",
      businessName: "",
      socialLink: "",
      contentChallenge: "",
      qualified: false,
    } as Partial<LeadFormData>,
  });

  const formValues = watch();

  // Country code from timezone, restore saved progress, capture UTM
  useEffect(() => {
    setCountryCode(detectCountryCode());
    captureAndStoreUtm();
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<LeadFormData> & { countryCode?: string };
        if (parsed.countryCode) setCountryCode(parsed.countryCode);
        (Object.keys(parsed) as (keyof LeadFormData)[]).forEach((k) => {
          if (k in leadSchema.shape && parsed[k] !== undefined && parsed[k] !== "") {
            setValue(k, parsed[k] as never);
          }
        });
      }
    } catch {}
  }, [setValue]);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...formValues, countryCode }));
    } catch {}
  }, [formValues, countryCode]);

  // Scroll lock, focus trap, Escape
  useEffect(() => {
    if (!isOpen) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimeout = setTimeout(() => {
      modalRef.current?.querySelector<HTMLElement>("input, select, textarea")?.focus();
    }, 50);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !modalRef.current) return;
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(focusTimeout);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKey);
      trigger?.focus({ preventScroll: true });
    };
  }, [isOpen, onClose]);

  // Cal.com embed: on booking, fire Schedule and go to the thank-you page
  useEffect(() => {
    if (!result?.qualified) return;
    (async () => {
      const cal = await getCalApi();
      cal("ui", {
        theme: "dark",
        styles: { branding: { brandColor: "#A24BFF" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
      cal("on", {
        action: "bookingSuccessful",
        callback: () => {
          trackPixelEvent("Schedule", { channel: "cal.com" }, generateEventId());
          window.location.href = "/thank-you";
        },
      });
    })();
  }, [result]);

  if (!isOpen) return null;

  const fullNumber = () => `${countryCode}${(formValues.whatsapp || "").replace(/\D/g, "")}`;

  const handleNextStep = async () => {
    if (step === 3) return;
    const valid = await trigger(stepFields[step]);
    if (!valid) return;
    if (step === 1) {
      const parsed = parsePhoneNumberFromString(fullNumber());
      if (!parsed || !parsed.isValid()) {
        setError("whatsapp", { message: "Please enter a valid WhatsApp number" });
        return;
      }
    }
    setStep((step + 1) as 2 | 3);
  };

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    const qualified = isQualifiedBudget(data.budgetRange);
    const eventId = generateEventId();
    const payload: LeadFormData = {
      ...data,
      whatsapp: `${countryCode} ${data.whatsapp.trim()}`,
      qualified,
      eventId,
      utm: getStoredUtm(),
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || `HTTP ${res.status}`);
      if (body?.warning) console.warn("[lead]", body.warning);
      const confirmedQualified: boolean = typeof body?.qualified === "boolean" ? body.qualified : qualified;

      trackPixelEvent(
        "Lead",
        {
          currency: "USD",
          value: confirmedQualified ? 500 : 0,
          lead_type: confirmedQualified ? "qualified" : "unqualified",
        },
        eventId
      );
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {}
      setResult({ qualified: confirmedQualified, data: payload });
    } catch (err) {
      console.error("Lead submission failed:", err);
      setSubmitError(
        "We couldn't send your details. Please try again" +
          (site.links.whatsapp ? ", or message us on WhatsApp." : `, or email ${site.links.email}.`)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const sampleEditHref = whatsappLink("Hi Host Editify, I'd like to request a free sample edit.");

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-4"
      data-lenis-prevent
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="audit-modal-title"
        className="relative flex max-h-[92svh] w-full flex-col overflow-hidden rounded-t-[24px] border border-white/15 bg-[#14141C] shadow-2xl sm:max-h-[90svh] sm:max-w-xl sm:rounded-[24px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mt-3 mb-1 h-1.5 w-12 shrink-0 rounded-full bg-white/20 sm:hidden" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8">
          {!result ? (
            <>
              <div className="mb-6 pr-10">
                <h3 id="audit-modal-title" className="type-h3 text-white">
                  Claim your free content audit
                </h3>
                <p className="type-small text-muted mt-2">
                  Free {site.callMinutes}-min call. We review your profile before the call and edit
                  your first video free.
                </p>
              </div>

              <div className="mb-6">
                <div className="type-small mb-2 flex items-center justify-between font-semibold">
                  <span className="text-[#A24BFF]">Step {step} of 3</span>
                  <span className="text-[#A0A0B0]">{stepLabels[step]}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/60">
                  <div className="bg-brand-gradient h-full transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }} />
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {step === 1 && (
                  <div className="flex flex-col gap-4">
                    <Field label="Your name" htmlFor="lead-name" error={errors.name?.message}>
                      <input
                        id="lead-name"
                        autoComplete="name"
                        placeholder="Your full name"
                        {...register("name")}
                        className={cn(inputBase, errors.name ? "border-[#FF3D8B]" : "border-white/10")}
                      />
                    </Field>

                    <Field label="WhatsApp number" htmlFor="lead-whatsapp" error={errors.whatsapp?.message}>
                      <div className="flex gap-2">
                        <select
                          aria-label="Country code"
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className={cn(inputBase, "w-auto shrink-0 cursor-pointer border-white/10 px-3")}
                        >
                          {countryCodes.map((c) => (
                            <option key={c.code} value={c.code} aria-label={`${c.country} ${c.code}`}>
                              {c.code}
                            </option>
                          ))}
                        </select>
                        <input
                          id="lead-whatsapp"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel-national"
                          placeholder="Your WhatsApp number"
                          {...register("whatsapp")}
                          className={cn(inputBase, "min-w-0 flex-1", errors.whatsapp ? "border-[#FF3D8B]" : "border-white/10")}
                        />
                      </div>
                    </Field>

                    <Field label="Email" htmlFor="lead-email" error={errors.email?.message}>
                      <input
                        id="lead-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@company.com"
                        {...register("email")}
                        className={cn(inputBase, errors.email ? "border-[#FF3D8B]" : "border-white/10")}
                      />
                    </Field>

                    <Button onClick={handleNextStep} className="mt-2 w-full">
                      Continue
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Button>
                  </div>
                )}

                {step === 2 && (
                  <div className="flex flex-col gap-4">
                    <Field label="Business name" htmlFor="lead-business" error={errors.businessName?.message}>
                      <input
                        id="lead-business"
                        autoComplete="organization"
                        placeholder="Your business name"
                        {...register("businessName")}
                        className={cn(inputBase, errors.businessName ? "border-[#FF3D8B]" : "border-white/10")}
                      />
                    </Field>

                    <Field label="Industry" htmlFor="lead-industry" error={errors.industry?.message}>
                      <Select
                        id="lead-industry"
                        placeholder="Select your industry"
                        options={INDUSTRIES}
                        defaultValue=""
                        invalid={!!errors.industry}
                        {...register("industry")}
                      />
                    </Field>

                    <Field label="Website or Instagram link" htmlFor="lead-social" optional>
                      <input
                        id="lead-social"
                        placeholder="instagram.com/yourbrand"
                        {...register("socialLink")}
                        className={cn(inputBase, "border-white/10")}
                      />
                    </Field>

                    <Field label="Videos you post per month" htmlFor="lead-volume" error={errors.monthlyVideos?.message}>
                      <Select
                        id="lead-volume"
                        placeholder="Select a range"
                        options={MONTHLY_VIDEOS}
                        defaultValue=""
                        invalid={!!errors.monthlyVideos}
                        {...register("monthlyVideos")}
                      />
                    </Field>

                    <Field label="How do you edit now?" htmlFor="lead-editor" error={errors.currentEditor?.message}>
                      <Select
                        id="lead-editor"
                        placeholder="Select one"
                        options={CURRENT_EDITOR}
                        defaultValue=""
                        invalid={!!errors.currentEditor}
                        {...register("currentEditor")}
                      />
                    </Field>

                    <div className="mt-2 flex gap-3">
                      <Button variant="secondary" onClick={() => setStep(1)} className="px-5">
                        <ArrowLeft className="h-4 w-4" aria-hidden />
                        Back
                      </Button>
                      <Button onClick={handleNextStep} className="flex-1">
                        Continue
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="flex flex-col gap-4">
                    <Field label="Biggest content challenge" htmlFor="lead-challenge" optional>
                      <textarea
                        id="lead-challenge"
                        rows={3}
                        placeholder="What's the hardest part of posting consistently?"
                        {...register("contentChallenge")}
                        className={cn(inputBase, "resize-none border-white/10")}
                      />
                    </Field>

                    <Field label="Monthly content budget" htmlFor="lead-budget" error={errors.budgetRange?.message}>
                      <Select
                        id="lead-budget"
                        placeholder="Select a budget range"
                        options={BUDGETS}
                        defaultValue=""
                        invalid={!!errors.budgetRange}
                        {...register("budgetRange")}
                      />
                    </Field>

                    <fieldset>
                      <legend className="type-small mb-1.5 block font-semibold text-white">Preferred plan</legend>
                      <div className="grid grid-cols-3 gap-2">
                        {PLANS.map((p) => {
                          const selected = formValues.preferredPlan === p;
                          return (
                            <button
                              key={p}
                              type="button"
                              role="radio"
                              aria-checked={selected}
                              onClick={() => setValue("preferredPlan", p, { shouldValidate: true })}
                              className={cn(
                                "type-small h-11 cursor-pointer rounded-xl border px-2 font-semibold transition-colors",
                                selected
                                  ? "border-[#A24BFF] bg-[#A24BFF]/15 text-white"
                                  : "border-white/10 bg-[#0A0A0F] text-[#A0A0B0] hover:text-white"
                              )}
                            >
                              {p}
                            </button>
                          );
                        })}
                      </div>
                      {errors.preferredPlan && (
                        <p role="alert" className="mt-1.5 text-[13px] text-[#FF3D8B]">
                          {errors.preferredPlan.message}
                        </p>
                      )}
                    </fieldset>

                    {submitError && (
                      <p role="alert" className="type-small rounded-xl border border-[#FF3D8B]/40 bg-[#FF3D8B]/10 p-3 text-white">
                        {submitError}
                      </p>
                    )}

                    <div className="mt-2 flex gap-3">
                      <Button variant="secondary" onClick={() => setStep(2)} className="px-5">
                        <ArrowLeft className="h-4 w-4" aria-hidden />
                        Back
                      </Button>
                      <Button type="submit" disabled={isSubmitting} className="flex-1">
                        <Send className="h-4 w-4" aria-hidden />
                        {isSubmitting ? "Sending…" : "Book my audit"}
                      </Button>
                    </div>
                  </div>
                )}
              </form>

              {sampleEditHref && (
                <div className="mt-6 border-t border-white/10 pt-5 text-center">
                  <a
                    href={sampleEditHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="type-small font-medium text-[#A24BFF] hover:underline"
                  >
                    Just want to see what we can do? Request a free sample edit →
                  </a>
                </div>
              )}
            </>
          ) : result.qualified ? (
            <div>
              <div className="mb-4 flex items-center gap-3 border-b border-white/10 pr-10 pb-4">
                <div className="icon-tile">
                  <Calendar className="h-6 w-6 text-[#A24BFF]" strokeWidth={1.75} aria-hidden />
                </div>
                <h3 id="audit-modal-title" className="type-h3 text-white">
                  Pick a time for your {site.callMinutes}-minute Google Meet
                </h3>
              </div>
              <div className="min-h-[500px] w-full overflow-hidden rounded-[20px] bg-[#0A0A0F]">
                <Cal
                  calLink={site.links.calcom}
                  style={{ width: "100%", height: "100%", minHeight: "500px", overflow: "scroll" }}
                  config={{
                    name: result.data.name,
                    email: result.data.email,
                    notes: `Industry: ${result.data.industry} | Editing now: ${result.data.currentEditor} | Budget: ${result.data.budgetRange}`,
                    theme: "dark",
                  }}
                />
              </div>
              <a
                href={site.links.calcomUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-white/15 px-5 text-sm font-semibold text-white transition-colors hover:border-[#C59AFF] hover:text-[#E5D5FF]"
              >
                Open the scheduling page in a new tab
              </a>
            </div>
          ) : (
            <UnqualifiedPath name={result.data.name} businessName={result.data.businessName} />
          )}
        </div>
      </div>
    </div>
  );
}

function UnqualifiedPath({ name, businessName }: { name: string; businessName: string }) {
  const href = whatsappLink(
    `Hi Host Editify, I'm ${name} from ${businessName}. I'd like to claim my free ${site.freeFirstVideoMaxSeconds}-second sample edit.`
  );
  const steps = [
    `Upload one raw clip (up to ${site.freeFirstVideoMaxSeconds}s) to Google Drive or WeTransfer`,
    href ? "Send us the link on WhatsApp" : `Email the link to ${site.links.email}`,
    `Get your edited, captioned video back in ${site.deliveryHours} hours`,
  ];

  return (
    <div className="py-2 text-center">
      <div className="icon-tile mx-auto">
        <Sparkles className="h-6 w-6 text-[#A24BFF]" strokeWidth={1.75} aria-hidden />
      </div>
      <h3 id="audit-modal-title" className="type-h3 mt-4 text-white">
        Let&apos;s start with a free sample edit
      </h3>
      <p className="type-small text-muted mx-auto mt-2 max-w-md">
        Thanks, {name}. For budgets under $500 we recommend starting with one free video (up to{" "}
        {site.freeFirstVideoMaxSeconds} seconds) first.
      </p>
      <ol className="card mx-auto mt-6 flex max-w-md flex-col gap-3 !p-5 text-left">
        {steps.map((s, i) => (
          <li key={s} className="type-small flex items-start gap-3 text-white/90">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold">
              {i + 1}
            </span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 text-[15px] font-semibold whitespace-nowrap text-white transition-transform hover:-translate-y-px"
        >
          <WhatsAppIcon className="h-5 w-5" />
          Send clip on WhatsApp
        </a>
      ) : (
        <a
          href={`mailto:${site.links.email}?subject=${encodeURIComponent(`Free sample edit — ${businessName}`)}`}
          className="bg-brand-gradient mt-6 inline-flex h-[52px] items-center justify-center rounded-full px-7 text-[15px] font-semibold whitespace-nowrap text-white"
        >
          Email your clip link
        </a>
      )}
    </div>
  );
}
