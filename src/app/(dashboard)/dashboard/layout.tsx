import { AppSidebar } from "@/components/DashboardLayout/app-sidebar";
import { DynamicBreadcrumb } from "@/components/DashboardLayout/DynamicBreadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { IntlProviderClient } from "@/components/common/IntlProviderClient";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <IntlProviderClient>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="h-svh overflow-hidden">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <DynamicBreadcrumb />
            </div>
          </header>
          <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-8">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </IntlProviderClient>
  );
}
