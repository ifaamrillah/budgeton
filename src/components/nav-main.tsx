"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  CreditCard,
  Database,
  FolderClosed,
  SquareChartGantt,
  SquareMinus,
  SquarePlus,
} from "lucide-react";
import { LuLayoutDashboard, LuWallet } from "react-icons/lu";

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

import { cn } from "@/lib/utils";

const navList = [
  {
    groupTitle: "Menu",
    menu: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LuLayoutDashboard,
      },
      {
        title: "Transaction",
        icon: LuWallet,
        collapse: true,
        subMenu: [
          {
            title: "Income",
            url: "/dashboard/income",
            icon: SquarePlus,
          },
          {
            title: "Expense",
            url: "/dashboard/expense",
            icon: SquareMinus,
          },
          {
            title: "Transfer",
            url: "/dashboard/transfer",
            icon: SquareChartGantt,
          },
        ],
      },
      {
        title: "Master",
        icon: Database,
        collapse: true,
        subMenu: [
          {
            title: "Account",
            url: "/dashboard/account",
            icon: CreditCard,
          },
          {
            title: "Category",
            url: "/dashboard/category",
            icon: FolderClosed,
          },
        ],
      },
    ],
  },
];

export function NavMain() {
  const pathname = usePathname();

  return (
    <>
      {navList.map(({ groupTitle, menu }) => (
        <SidebarGroup key={groupTitle}>
          <SidebarGroupLabel>{groupTitle}</SidebarGroupLabel>
          <SidebarMenu>
            {menu.map(({ title, url, icon: Icon, subMenu, collapse }) => {
              const isMenuActive = pathname === url;

              return subMenu ? (
                <Collapsible
                  key={title}
                  asChild
                  defaultOpen={collapse}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={title}>
                        {Icon && <Icon />}
                        <span>{title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {subMenu?.map(
                          ({
                            title: subMenuTitle,
                            url: subMenuUrl,
                            icon: SubMenuIcon,
                          }) => {
                            const isSubMenuActive = pathname === subMenuUrl;

                            return (
                              <SidebarMenuSubItem key={subMenuTitle}>
                                <SidebarMenuSubButton asChild>
                                  <Link
                                    href={subMenuUrl}
                                    className={cn(
                                      "py-4",
                                      isSubMenuActive && "font-bold bg-zinc-100"
                                    )}
                                  >
                                    {SubMenuIcon && (
                                      <SubMenuIcon className="text-white" />
                                    )}
                                    <span>{subMenuTitle}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          }
                        )}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={title}>
                  <SidebarMenuButton tooltip={title} asChild>
                    <Link
                      href={url}
                      className={cn(isMenuActive && "font-bold bg-zinc-100")}
                    >
                      {Icon && <Icon />}
                      <span>{title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
