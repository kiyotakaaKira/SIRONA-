"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

interface ContinuityCapsuleContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const ContinuityCapsuleContext = createContext<ContinuityCapsuleContextValue | null>(null);

export function ContinuityCapsuleProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <ContinuityCapsuleContext.Provider value={{ isOpen, open, close }}>
      {children}
    </ContinuityCapsuleContext.Provider>
  );
}

export function useContinuityCapsule() {
  const ctx = useContext(ContinuityCapsuleContext);
  if (!ctx) {
    throw new Error("useContinuityCapsule must be used within ContinuityCapsuleProvider");
  }
  return ctx;
}
