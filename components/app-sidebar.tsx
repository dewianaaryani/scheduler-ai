"use client";
import * as React from "react";
import * as Icons from "lucide-react";
import { usePathname } from "next/navigation";

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Logo } from "@/app/components/logo";

// Data navigasi utama
const data = {
  navMain: [
    {
      title: "Dasbor",
      url: "/dashboard",
      icon: "Home",
      description: "Lihat ringkasan aktivitas Anda hari ini",
    },
    {
      title: "Tujuan",
      icon: "Target",
      description: "Buat tujuan dan kelola tujuan Anda",
      items: [
        {
          title: "Daftar Tujuan",
          url: "/goals",
          icon: "List",
          description: "Lihat semua tujuan yang telah dibuat",
        },
        {
          title: "Buat Tujuan",
          url: "/ai",
          icon: "Plus",
          description: "Buat tujuan baru dengan bantuan AI",
        },
      ],
    },
    {
      title: "Kalender",
      url: "/calendar",
      icon: "Calendar",
      description: "Lihat dan kelola jadwal Anda",
    },
    {
      title: "Analisis Produktivitas",
      url: "/analytics",
      icon: "ChartNoAxesCombined",
      description: "Lihat produktivitas Anda",
    },
  ],
};

function SidebarNavigation() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const [openItems, setOpenItems] = React.useState<string[]>(["Tujuan"]);

  const toggleItem = (title: string) => {
    setOpenItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  return (
    <TooltipProvider delayDuration={300}>
      <SidebarMenu className="gap-2">
        {data.navMain.map((item) => {
          const IconComponent = Icons[
            item.icon as keyof typeof Icons
          ] as React.ElementType;

          // Check if item has subitems (dropdown)
          if ("items" in item && item.items) {
            const isOpen = openItems.includes(item.title);
            const hasActiveChild = item.items.some(
              (subItem) => pathname === subItem.url
            );

            // When sidebar is collapsed, show direct links instead of dropdown
            if (state === "collapsed") {
              return (
                <SidebarMenuItem key={item.title}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        asChild
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
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="font-medium z-[9999] relative"
                      sideOffset={15}
                      align="center"
                      style={{ zIndex: 9999 }}
                    >
                      <div className="flex flex-col max-w-[250px]">
                        <span className="font-semibold">{item.title}</span>
                        <span className="text-xs text-muted-foreground mb-2">
                          {item.description}
                        </span>
                        <div className="pt-2 border-t border-border/50">
                          <span className="text-xs font-medium mb-1 block">
                            Menu tersedia:
                          </span>
                          {item.items.map((subItem, index) => (
                            <div
                              key={index}
                              className="text-xs text-muted-foreground"
                            >
                              • {subItem.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
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
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
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
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="font-medium z-[9999] relative"
                      sideOffset={15}
                      style={{ zIndex: 9999 }}
                    >
                      <div className="flex flex-col max-w-[200px]">
                        <span className="font-semibold">{item.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      </div>
                    </TooltipContent>
                  </Tooltip>
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
                              <a
                                href={subItem.url}
                                className="flex items-center gap-2"
                              >
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    asChild
                    className={`text-zinc-500 font-medium hover:bg-none hover:text-primary hover:border hover:border-primary ${
                      isActive ? "bg-primary text-white font-semibold" : ""
                    }`}
                  >
                    <a
                      href={item.url}
                      className="flex items-center gap-3 px-4 py-5 rounded-md transition duration-200"
                    >
                      {IconComponent && (
                        <IconComponent
                          className="size-4"
                          strokeWidth={isActive ? 3 : 2}
                        />
                      )}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="font-medium z-[9999] relative"
                  sideOffset={15}
                  style={{ zIndex: 9999 }}
                >
                  <div className="flex flex-col max-w-[200px]">
                    <span className="font-semibold">{item.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  </div>
                </TooltipContent>
              </Tooltip>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </TooltipProvider>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      variant="floating"
      {...props}
      collapsible="icon"
      className="py-6 ml-4 z-10"
    >
      {/* Header Sidebar */}
      <SidebarHeader className="">
        <SidebarMenu>
          <SidebarMenuItem>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton size="lg" asChild>
                    <a href="#">
                      <Logo size={32} />
                      <div className="flex flex-col gap-0.8 leading-none">
                        <span className="font-extrabold text-base tracking-widest">
                          KAL<span className="text-primary">CER</span>
                        </span>
                        <span className="text-xs font-semibold">
                          Penjadwalan Cerdas
                        </span>
                      </div>
                    </a>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="font-medium z-[9999] relative"
                  sideOffset={15}
                  style={{ zIndex: 9999 }}
                >
                  <div className="flex flex-col max-w-[200px]">
                    <span className="font-semibold">KALCER</span>
                    <span className="text-xs text-muted-foreground">
                      Aplikasi Penjadwalan Cerdas
                    </span>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
