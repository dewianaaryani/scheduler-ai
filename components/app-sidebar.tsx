"use client";
import * as React from "react";
import * as Icons from "lucide-react";
import { usePathname } from "next/navigation"; // Gunakan usePathname dari Next.js

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Data navigasi utama
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: "Home", // Nama ikon sesuai dengan yang tersedia di lucide-react
    },
    {
      title: "Scheduler",
      url: "/scheduler",
      icon: "Bot",
    },
    {
      title: "Goals",
      url: "/goals",
      icon: "ListPlusIcon",
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: "Calendar",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname(); // Ambil path yang sedang aktif

  return (
    <Sidebar
      variant="floating"
      {...props}
      collapsible="icon"
      className="py-6 ml-4"
    >
      {/* Header Sidebar */}
      <SidebarHeader className="">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                {/* Logo dengan ikon */}
                <div className="bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Icons.ClockFading className="size-4" /> {/* Ikon utama */}
                </div>
                {/* Nama Aplikasi */}
                <div className="flex flex-col gap-0.8 leading-none">
                  <span className="font-extrabold text-base tracking-widest">
                    KALA<span className="text-primary">NA</span>
                  </span>
                  <span className="text-xs font-semibold">
                    AI Generate Schedule
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Konten Sidebar */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {data.navMain.map((item) => {
              const isActive = pathname === item.url;
              // Mengambil ikon berdasarkan nama string
              const IconComponent = Icons[
                item.icon as keyof typeof Icons
              ] as React.ElementType;

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={` text-zinc-500 font-medium hover:bg-none hover:text-primary hover:border hover:border-primary ${
                      isActive ? "bg-primary text-white font-semibold" : ""
                    }`}
                  >
                    <a
                      href={item.url}
                      className="flex items-center gap-3 px-4 py-5 rounded-md transition duration-200"
                    >
                      {/* Render ikon hanya jika ditemukan */}
                      {IconComponent && (
                        <IconComponent
                          className="size-4"
                          strokeWidth={isActive ? 3 : 2}
                        />
                      )}
                      {item.title}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
