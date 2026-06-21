"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-white/50 font-medium mb-6 px-6 md:px-10 pt-6">
      <Link href="/" className="hover:text-[#29F0E0] transition-colors flex items-center">
        <Home className="w-4 h-4" />
      </Link>
      {segments.map((segment, index) => {
        const path = `/${segments.slice(0, index + 1).join('/')}`;
        const isLast = index === segments.length - 1;
        const formatted = segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        return (
          <React.Fragment key={path}>
            <ChevronRight className="w-3.5 h-3.5 text-white/20" />
            {isLast ? (
              <span className="text-white">{formatted}</span>
            ) : (
              <Link href={path} className="hover:text-white transition-colors">
                {formatted}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
