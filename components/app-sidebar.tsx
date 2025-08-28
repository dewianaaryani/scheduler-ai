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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Data navigasi utama
const data = {
  navMain: [
    {
      title: "Dasbor",
      url: "/dashboard",
      icon: "Home", // Nama ikon sesuai dengan yang tersedia di lucide-react
    },
    {
      title: "Tujuan",
      icon: "Target",
      items: [
        {
          title: "Daftar Tujuan",
          url: "/goals",
          icon: "List",
        },
        {
          title: "Buat Tujuan",
          url: "/ai",
          icon: "Plus",
        },
      ],
    },
    {
      title: "Kalender",
      url: "/calendar",
      icon: "Calendar",
    },
    {
      title: "Analitik",
      url: "/analytics",
      icon: "ChartNoAxesCombined",
    },
  ],
};

function SidebarNavigation() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const [openItems, setOpenItems] = React.useState<string[]>(["Tujuan"]);

  const toggleItem = (title: string) => {
    setOpenItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  return (
    <SidebarMenu className="gap-2">
      {data.navMain.map((item) => {
        const IconComponent = Icons[
          item.icon as keyof typeof Icons
        ] as React.ElementType;

        // Check if item has subitems (dropdown)
        if ('items' in item && item.items) {
          const isOpen = openItems.includes(item.title);
          const hasActiveChild = item.items.some(subItem => pathname === subItem.url);
          
          // When sidebar is collapsed, show direct links instead of dropdown
          if (state === 'collapsed') {
            // Just show the main icon that links to first subitem when collapsed
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={`text-zinc-500 font-medium hover:bg-none hover:text-primary hover:border hover:border-primary ${
                    hasActiveChild ? "text-primary font-semibold" : ""
                  }`}
                >
                  <a
                    href={item.items[0].url}
                    className="flex items-center gap-3 px-4 py-5 rounded-md transition duration-200"
                  >
                    {IconComponent && (
                      <IconComponent
                        className="size-4"
                        strokeWidth={hasActiveChild ? 3 : 2}
                      />
                    )}
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }
          
          // Normal expanded dropdown
          return (
            <Collapsible
              key={item.title}
              open={isOpen}
              onOpenChange={() => toggleItem(item.title)}
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={`text-zinc-500 font-medium hover:bg-none hover:text-primary hover:border hover:border-primary ${
                      hasActiveChild ? "text-primary font-semibold" : ""
                    }`}
                  >
                    {IconComponent && (
                      <IconComponent
                        className="size-4"
                        strokeWidth={hasActiveChild ? 3 : 2}
                      />
                    )}
                    <span className="flex-1">{item.title}</span>
                    <Icons.ChevronRight
                      className={`size-4 transition-transform ${
                        isOpen ? "rotate-90" : ""
                      }`}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => {
                      const isSubActive = pathname === subItem.url;
                      const SubIconComponent = Icons[
                        subItem.icon as keyof typeof Icons
                      ] as React.ElementType;
                      
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isSubActive}
                            className={`text-zinc-500 font-medium hover:text-primary ${
                              isSubActive ? "text-primary font-semibold" : ""
                            }`}
                          >
                            <a href={subItem.url} className="flex items-center gap-2">
                              {SubIconComponent && (
                                <SubIconComponent className="size-3" />
                              )}
                              {subItem.title}
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        }
        
        // Regular menu item (no dropdown)
        const isActive = pathname === item.url;
        
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
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
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
                    Penjadwalan AI
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
          <SidebarNavigation />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}