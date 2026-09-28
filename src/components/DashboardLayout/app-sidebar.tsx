"use client";

import * as React from "react";
import {
  BookOpen,
  LayoutDashboard,
  ShieldCheck,
  UserRoundCheck,
  ListTodo,
  Timer,
  TrendingDown,
  TrendingUp,
  FolderInput,
  FolderOutput,
  FolderMinus,
  FolderPlus,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/8-prohor-logo.png";
import { useTranslations } from "next-intl";
import { useUserStore } from "@/store/userStore";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations("sidebar");
  const { profile } = useUserStore();
  const allowed = profile?.allowedRoutes ?? [];
  const isOrganization = profile?.accountType === "organization";

  function filterItems(items: any[]) {
    return items.filter(
      (item) => allowed.length === 0 || allowed.includes(item.routeKey),
    );
  }

  const data: Record<string, any[]> = {
    [t("groups.main")]: filterItems([
      {
        title: t("items.dashboard"),
        url: "/dashboard",
        icon: LayoutDashboard,
        routeKey: "dashboard",
      },
      {
        title: t("items.task"),
        url: "/dashboard/tasks",
        icon: ListTodo,
        routeKey: "tasks",
      },
      {
        title: t("items.stopwatch"),
        url: "/dashboard/stopwatch",
        icon: Timer,
        routeKey: "stopwatch",
      },
    ]),

    [t("groups.finance")]: filterItems([
      {
        title: t("items.incomeCategory"),
        url: "/dashboard/income-category",
        icon: FolderInput,
        routeKey: "income-category",
      },
      {
        title: t("items.income"),
        url: "/dashboard/income",
        icon: TrendingUp,
        routeKey: "income",
      },
      {
        title: t("items.expenseCategory"),
        url: "/dashboard/expense-category",
        icon: FolderOutput,
        routeKey: "expense-category",
      },
      {
        title: t("items.expense"),
        url: "/dashboard/expense",
        icon: TrendingDown,
        routeKey: "expense",
      },
      {
        title: t("items.liability"),
        url: "/dashboard/liability",
        icon: FolderMinus,
        routeKey: "liability",
      },
      {
        title: t("items.receivable"),
        url: "/dashboard/receivable",
        icon: FolderPlus,
        routeKey: "receivable",
      },
    ]),

    [t("groups.admin")]: filterItems([
      {
        title: t("items.reports"),
        url: "",
        icon: BookOpen,
        routeKey: "reports",
        items: [
          { title: t("items.reportsWeekly"), url: "/dashboard/reports/weekly" },
          {
            title: t("items.reportsMonthly"),
            url: "/dashboard/reports/monthly",
          },
          { title: t("items.reportsYearly"), url: "/dashboard/reports/yearly" },
        ],
      },
      ...(isOrganization
        ? [
            {
              title: t("items.permissions"),
              url: "/dashboard/permissions",
              icon: ShieldCheck,
              routeKey: "permissions",
            },
          ]
        : []),
      ...(isOrganization
        ? [
            {
              title: t("items.userManagement"),
              url: "/dashboard/user-management",
              icon: UserRoundCheck,
              routeKey: "user-management",
            },
          ]
        : []),
    ]),

    [t("groups.settings")]: [
      {
        title: t("items.settings"),
        url: "",
        icon: Settings,
        items: [
          { title: t("items.profile"), url: "/dashboard/settings/profile" },
          // organization item শুধু org account-এই দেখাবে
          ...(isOrganization
            ? [
                {
                  title: t("items.organization"),
                  url: "/dashboard/settings/organization",
                },
              ]
            : []),
          { title: t("items.account"), url: "/dashboard/settings/account" },
          {
            title: t("items.appearance"),
            url: "/dashboard/settings/appearance",
          },
        ],
      },
    ],
  };

  const filteredData = Object.fromEntries(
    Object.entries(data).filter(([, items]) => items.length > 0),
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link
          href="/dashboard"
          className="flex text-center w-[60%] mx-auto items-center justify-center py-1"
        >
          <Image
            src={logo}
            alt="8 Prohor"
            width={60}
            height={60}
            priority
            quality={100}
            className="shrink-0 text-center items-center w-full h-14"
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredData} />
      </SidebarContent>
      <SidebarFooter />
      <SidebarRail />
    </Sidebar>
  );
}
