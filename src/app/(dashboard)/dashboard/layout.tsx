import { cookies } from "next/headers";
import { IntlProviderClient } from "@/components/common/IntlProviderClient";
import ProfileLoader from "@/components/common/ProfileLoader";
import { AppSidebar } from "@/components/DashboardLayout/app-sidebar";
import { DynamicBreadcrumb } from "@/components/DashboardLayout/DynamicBreadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Avatar from "@/components/DashboardLayout/Avatar";
import { DashboardThemeProvider } from "@/components/providers/DashboardThemeProvider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const initialLocale =
    (cookieStore.get("locale")?.value as "en" | "bn") || "en";

  return (
    <IntlProviderClient initialLocale={initialLocale}>
      <DashboardThemeProvider>
        <ProfileLoader>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="h-svh overflow-hidden">
              <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b">
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                  />
                  <DynamicBreadcrumb />
                </div>
                <div className="px-4">
                  <Avatar />
                </div>
              </header>
              <div className="flex-1 overflow-y-auto no-scrollbar py-2 px-4 md:py-4 md:px-8">
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </ProfileLoader>
      </DashboardThemeProvider>
    </IntlProviderClient>
  );
}
