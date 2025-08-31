"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";

export default function GoalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  // Ambil id dari URL, misal dari '/goals/123/overview' -> ambil '123'
  const pathParts = pathname.split("/");
  const id = pathParts[2]; // goals / {id} / {tab}

  const tabValue = pathname.includes("/settings-goals")
    ? "settings-goals"
    : "overview";

  const handleTabChange = (value: string) => {
    const targetPath =
      value === "overview" ? `/goals/${id}` : `/goals/${id}/${value}`;
    router.push(targetPath);
  };

  return (
    <div className="container mx-auto max-w-7xl">
      <Tabs value={tabValue} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full justify-start border-b bg-transparent p-0">
          <TabsTrigger
            value="overview"
            className={`px-6 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none ${
              tabValue === "overview" ? "border-b-2 border-primary" : ""
            }`}
          >
            Tinjauan
          </TabsTrigger>

          <TabsTrigger
            value="settings-goals"
            className={`px-6 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none ${
              tabValue === "settings-goals" ? "border-b-2 border-primary" : ""
            }`}
          >
            Pengaturan
          </TabsTrigger>
        </TabsList>

        {/* Content dari masing-masing tab */}
        <div className="p-6">{children}</div>
      </Tabs>
    </div>
  );
}
