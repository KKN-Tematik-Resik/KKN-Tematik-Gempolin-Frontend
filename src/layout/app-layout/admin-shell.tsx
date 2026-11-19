"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppHeader from "@/layout/app-layout/header";
import AppSidebar from "@/layout/app-layout/sidebar";
import type { NavItem } from "@/layout/app-layout/sidebar/types";

export default function AdminShell({
  children,
  customNavItems,
}: {
  children: React.ReactNode;
  customNavItems?: NavItem[];
}) {
  return (
    <SidebarProvider>
      <AppSidebar customNavItems={customNavItems} />
      <SidebarInset>
        <AppHeader />
        <div className="p-4 mx-auto w-full max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
