"use client";

import { Fragment, ReactNode } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
  breadcrumb: {
    label: string;
    href?: string;
  }[];
}

export function PageWrapper({
  children,
  className,
  breadcrumb,
}: PageWrapperProps) {
  const { open, isMobile } = useSidebar();

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumb.map(({ label, href }, index) => {
                const isLast = breadcrumb.length === index + 1;
                return isLast ? (
                  <BreadcrumbItem key={index}>
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  </BreadcrumbItem>
                ) : (
                  <Fragment key={index}>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink
                        href={href}
                        className={`${!href && "cursor-not-allowed"}`}
                      >
                        {label}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                  </Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <main
        className={cn(
          "p-4",
          open && !isMobile
            ? "w-[calc(100vw-var(--sidebar-width))]"
            : "w-screen",
          className
        )}
      >
        {children}
      </main>
    </>
  );
}
