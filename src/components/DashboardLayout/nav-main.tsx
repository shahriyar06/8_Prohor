"use client";

import { useEffect, useState } from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

type NavSubItem = { title: string; url: string };
type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  items?: NavSubItem[];
};
type NavGroups = Record<string, NavItem[]>;

function normalizeUrl(url: string) {
  if (!url) return "#";
  return url.startsWith("/") ? url : `/${url}`;
}

function CollapsibleNavItem({
  item,
  isSubActive,
  pathname,
  router,
}: {
  item: NavItem;
  isSubActive: boolean;
  pathname: string;
  router: ReturnType<typeof useRouter>;
}) {
  const [open, setOpen] = useState(isSubActive);

  useEffect(() => {
    if (isSubActive) setOpen(true);
  }, [isSubActive]);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger className="w-full">
          <SidebarMenuButton
            className="w-full text-md gap-3 hover:cursor-pointer"
            render={<div />}
          >
            {item.icon && <item.icon className="size-5 shrink-0" />}
            <span className="flex-1 text-left">{item.title}</span>
            <ChevronRight className="size-5 shrink-0 transition-transform duration-300 ease-in-out group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent className="overflow-hidden transition-[height] duration-300 ease-in-out h-[var(--collapsible-panel-height)] data-[starting-style]:h-0 data-[ending-style]:h-0">
          <SidebarMenuSub>
            {item.items?.map((subItem) => {
              const subUrl = normalizeUrl(subItem.url);
              const subActive = pathname === subUrl;
              return (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    onClick={() => router.push(subUrl)}
                    className={`text-md cursor-pointer ${
                      subActive ? "text-primary" : "text-foreground"
                    }`}
                  >
                    <span>{subItem.title}</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export function NavMain({ items }: { items: NavGroups }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      {Object.entries(items).map(([groupLabel, groupItems]) => (
        <SidebarGroup key={groupLabel}>
          <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
          <SidebarMenu>
            {groupItems.map((item) => {
              const hasSubItems = !!item.items && item.items.length > 0;
              const url = normalizeUrl(item.url);
              const isActive = pathname === url;
              const isSubActive = !!item.items?.some(
                (sub) => pathname === normalizeUrl(sub.url)
              );

              if (!hasSubItems) {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => router.push(url)}
                      className={`text-md gap-3 ${
                        isActive ? "text-primary" : "text-foreground"
                      } hover:cursor-pointer`}
                    >
                      {item.icon && <item.icon className="size-5 shrink-0" />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              }

              return (
                <CollapsibleNavItem
                  key={item.title}
                  item={item}
                  isSubActive={isSubActive}
                  pathname={pathname}
                  router={router}
                />
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}