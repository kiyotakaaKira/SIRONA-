"use client";
import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";

interface Canvas3DBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // Static fallback gradient if WebGL fails
      return (
        <div className="w-full h-full min-h-[400px] rounded-3xl bg-gradient-to-tr from-[#05070A] to-[#1A2332] border border-white/5 flex items-center justify-center shadow-[inset_0_0_100px_rgba(41,240,224,0.05)]">
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#29F0E0]/20 to-[#2E6FFF]/20 blur-xl animate-pulse" />
        </div>
      );
    }
    return this.props.children;
  }
}

export function Canvas3DBoundary({ children }: Canvas3DBoundaryProps) {
  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="w-full h-full min-h-[400px] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#29F0E0] animate-spin opacity-50" />
        </div>
      }>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
