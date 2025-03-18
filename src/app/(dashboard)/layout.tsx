import { AppSidebar } from "@/components/dashboard/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div>
          <SidebarTrigger className="-ml-1" />
        </div>
        <main className='flex flex-1 flex-col gap-4 p-4 pt-0'>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
