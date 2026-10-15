"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { captureAndStoreUtm, trackCtaClick, trackFormOpen } from "@/lib/tracking";

interface AuditModalContextType {
  isOpen: boolean;
  openAuditModal: (position?: string) => void;
  closeAuditModal: () => void;
}

const AuditModalContext = createContext<AuditModalContextType>({
  isOpen: false,
  openAuditModal: () => {},
  closeAuditModal: () => {},
});

export function AuditModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => { captureAndStoreUtm(); }, []);

  const openAuditModal = useCallback((position: string = "unknown") => {
    trackCtaClick(position, "Book My Free Content Audit");
    trackFormOpen(position);
    setIsOpen(true);
  }, []);

  const closeAuditModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Also listen for custom window event "open-audit-modal"
  useEffect(() => {
    const handleCustomOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ position?: string }>;
      openAuditModal(customEvent.detail?.position || "unknown");
    };
    window.addEventListener("open-audit-modal", handleCustomOpen);
    return () => window.removeEventListener("open-audit-modal", handleCustomOpen);
  }, [openAuditModal]);

  return (
    <AuditModalContext.Provider value={{ isOpen, openAuditModal, closeAuditModal }}>
      {children}
    </AuditModalContext.Provider>
  );
}

export function useAuditModal() {
  return useContext(AuditModalContext);
}

export function triggerAuditModal(position: string = "unknown") {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-audit-modal", { detail: { position } }));
  }
}
