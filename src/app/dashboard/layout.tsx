import { ReactNode } from "react";
import { currentUser } from "@clerk/nextjs/server";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const name = user ? `${user.firstName} ${user.lastName}` : "User Not Found";
  const email = user
    ? user.emailAddresses[0].emailAddress
    : "usernotfound@mail.com";
  const avatar = user ? user.imageUrl : "";
  const fallback =
    user && user.firstName && user.lastName
      ? `${user.firstName.charAt(0).toUpperCase()}${user.lastName
          .charAt(0)
          .toUpperCase()}`
      : "US";

  return (
    <SidebarProvider>
      <AppSidebar
        name={name}
        email={email}
        avatar={avatar}
        fallback={fallback}
      />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
