import { AppSidebar } from "@/components/app-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { requireUser } from "@/app/lib/hooks";
import DynamicBreadcrumb from "@/app/components/DynamicBreadCrumb";

async function getData(userId: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      preferences: true,
      image: true,
    },
  });
  if (!data?.preferences) {
    return redirect("/on-boarding");
  }
  return data;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireUser();
  const data = await getData(session.id as string);

  return (
    <TooltipProvider>
      <div className="bg-[#F6F6FA]">
        <SidebarProvider
          style={
            {
              "--sidebar-width": "15rem",
            } as React.CSSProperties
          }
        >
          <AppSidebar />
          <div className="flex flex-col h-screen w-full p-4 overflow-hidden">
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 m-3 px-4 rounded-lg bg-white">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarTrigger className="-ml-1" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="font-medium">
                    <span>Buka atau tutup navigasi samping</span>
                  </TooltipContent>
                </Tooltip>

                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />

                <DynamicBreadcrumb />

                <div className="ml-auto " id="pengaturan-akun">
                  <DropdownMenu>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <Avatar className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
                            <AvatarImage
                              src={data.image || undefined}
                              alt={data.image || undefined}
                            />
                            <AvatarFallback>
                              <User size={16} />
                            </AvatarFallback>
                          </Avatar>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="font-medium">
                        <div className="flex flex-col text-center">
                          <span className="font-semibold">
                            Pengaturan dan keluar akun
                          </span>
                        </div>
                      </TooltipContent>
                    </Tooltip>

                    <DropdownMenuContent side="top" align="end">
                      <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuItem>
                            <Settings />
                            <span>
                              <Link href="/settings">Pengaturan</Link>
                            </span>
                          </DropdownMenuItem>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="font-medium">
                          <span>Atur profil dan preferensi waktu</span>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuItem>
                            <form
                              action={async () => {
                                "use server";
                                await signOut();
                                redirect("/"); // Redirect after successful logout
                              }}
                            >
                              <button className="gap-2 inline-flex">
                                <LogOut />
                                <span>Keluar</span>
                              </button>
                            </form>
                          </DropdownMenuItem>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="font-medium">
                          <span>Keluar dari akun</span>
                        </TooltipContent>
                      </Tooltip>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </header>

              <div className="flex flex-1 h-full w-full flex-col ml-4 pr-7 rounded-lg pt-0 mb-2">
                <main className="flex h-[calc(100vh-130px)] w-full bg-white rounded-lg shadow-md">
                  <div className="w-full h-full overflow-auto p-4">
                    {/* Main content */}
                    {children}
                  </div>
                </main>
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </TooltipProvider>
  );
}
