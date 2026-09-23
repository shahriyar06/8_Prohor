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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations("sidebar");

  const data = {
    [t("groups.main")]: [
      { title: t("items.dashboard"), url: "/dashboard", icon: LayoutDashboard },
      { title: t("items.task"), url: "/dashboard/tasks", icon: ListTodo },
      { title: t("items.stopwatch"), url: "/dashboard/stopwatch", icon: Timer },
    ],
    [t("groups.finance")]: [
      {
        title: t("items.incomeCategory"),
        url: "/dashboard/income-category",
        icon: FolderInput,
      },
      { title: t("items.income"), url: "/dashboard/income", icon: TrendingUp },
      {
        title: t("items.expenseCategory"),
        url: "/dashboard/expense-category",
        icon: FolderOutput,
      },
      {
        title: t("items.expense"),
        url: "/dashboard/expense",
        icon: TrendingDown,
      },
      {
        title: t("items.liability"),
        url: "/dashboard/liability",
        icon: FolderMinus,
      },
      {
        title: t("items.receivable"),
        url: "/dashboard/receivable",
        icon: FolderPlus,
      },
    ],
    [t("groups.admin")]: [
      {
        title: t("items.reports"),
        url: "",
        icon: BookOpen,
        items: [
          { title: t("items.reportsWeekly"), url: "/dashboard/reports/weekly" },
          {
            title: t("items.reportsMonthly"),
            url: "/dashboard/reports/monthly",
          },
          { title: t("items.reportsYearly"), url: "/dashboard/reports/yearly" },
        ],
      },
      {
        title: t("items.permissions"),
        url: "/dashboard/permissions",
        icon: ShieldCheck,
      },
      {
        title: t("items.userManagement"),
        url: "/dashboard/user-management",
        icon: UserRoundCheck,
      },
    ],
    [t("groups.settings")]: [
      {
        title: t("items.settings"),
        url: "",
        icon: Settings,
        items: [
          { title: t("items.profile"), url: "/dashboard/settings/profile" },
          { title: t("items.organization"), url: "/dashboard/settings/organization" },
          { title: t("items.account"), url: "/dashboard/settings/account" },
          {
            title: t("items.appearance"),
            url: "/dashboard/settings/appearance",
          },
        ],
      },
    ],
  };
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
          {/* <span className="font-semibold text-sm group-data-[collapsible=icon]:hidden">
            8 Prohor
          </span> */}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data} />
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
