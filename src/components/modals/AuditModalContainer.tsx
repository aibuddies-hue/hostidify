"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useAuditModal } from "@/context/AuditModalContext";

const AuditModal = dynamic(() => import("./AuditModal").then((module) => module.AuditModal), { ssr: false });

export function AuditModalContainer() {
  const { isOpen, closeAuditModal } = useAuditModal();
  const [hasOpened, setHasOpened] = useState(false);
  useEffect(() => { if (isOpen) setHasOpened(true); }, [isOpen]);
  // Keep progress after first use, but do not download form/calendar code on page load.
  return isOpen || hasOpened ? <AuditModal isOpen={isOpen} onClose={closeAuditModal} /> : null;
}
