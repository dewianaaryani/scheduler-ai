"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, MoreVertical, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Payment", path: "/payment" },
  { name: "Analytics", path: "/analytics" },
  { name: "Cards", path: "/cards" },
  { name: "History", path: "/history" },
  { name: "Services", path: "/services" },
  { name: "Settings", path: "/settings" },
];
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-[#F6F6FA]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-50 border-r bg-[#ffffff] p-4">
        <div className="flex justify-center items-center gap-2 pb-8">
          <span className="text-xl font-bold">
            KALA<span className="text-primary">NA</span>
          </span>
        </div>

        <nav className="space-y-2">
          {navItems.map(({ name, path }) => (
            <Link key={path} href={path} passHref>
              <Button
                variant={pathname === path ? "secondary" : "ghost"}
                className={`w-full justify-start gap-2 ${
                  pathname === path ? "bg-primary text-white" : ""
                }`}
              >
                <div className="h-4 w-4" />
                {name}
              </Button>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="pl-64">
        {/* Header */}
        <header className="border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline">+ Add new</Button>
              <Button variant="outline" className="gap-2">
                11 Nov - 11 Dec, 2026
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Avatar>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4 p-4">{children}</div>
      </main>
    </div>
  );
}
