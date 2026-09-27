"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { usePathname } from "next/navigation";
import { DashboardThemeProvider } from "../providers/DashboardThemeProvider";

export function ConditionalThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  if (!isDashboard) {
    return <>{children}</>;
  }

  return (
    <DashboardThemeProvider
    >
      <div className="dashboard-theme-scope contents">{children}</div>
    </DashboardThemeProvider>
  );
}