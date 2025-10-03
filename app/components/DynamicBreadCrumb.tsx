"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"; // adjust as needed
import React from "react";

export default function DynamicBreadcrumb() {
  const pathname = usePathname(); // e.g., "/docs/data-fetching"

  const pathParts = pathname.split("/").filter((part) => part); // Remove empty parts

  const breadcrumbs = pathParts.map((part, index) => {
    const href = "/" + pathParts.slice(0, index + 1).join("/");
    let label = decodeURIComponent(part.replace(/-/g, " ")).replace(
      /\b\w/g,
      (l) => l.toUpperCase()
    );

    // Translate common routes to Bahasa Indonesia
    const translations: Record<string, string> = {
      Dashboard: "Dasbor",
      Ai: "Buat Tujuan",
      Goals: "Daftar Tujuan",
      Calendar: "Kalender",
      Analytics: "Analisis Produktivitas",
      Settings: "Pengaturan",
      Overview: "Ringkasan",
      "Settings Goals": "Pengaturan Tujuan",
    };

    if (translations[label]) {
      label = translations[label];
    }

    return {
      label,
      href,
      isLast: index === pathParts.length - 1,
    };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">KALCER</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
