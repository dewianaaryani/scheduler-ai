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

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LogOut, Settings } from "lucide-react";
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
    <div className="bg-[#F6F6FA] ">
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
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />

              {/* <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Building Your Application
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb> */}
              <DynamicBreadcrumb />
              <div className="ml-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar>
                      <AvatarImage
                        src={data.image || undefined}
                        alt={data.image || undefined}
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" align="end">
                    <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Settings />
                      <span>
                        <Link href="/settings">Pengaturan</Link>
                      </span>
                    </DropdownMenuItem>
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
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>
            <div className="flex flex-1 h-full w-full flex-col ml-4 pr-7 rounded-lg pt-0 mb-2 ">
              <main className="flex h-[calc(100vh-130px)] overflow-y-auto w-full bg-white p-4 rounded-lg shadow-md ">
                {children}
              </main>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
