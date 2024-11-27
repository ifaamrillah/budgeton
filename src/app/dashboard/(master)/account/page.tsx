import { PageWrapper } from "@/components/page-wrapper";

import { AccountTable } from "./components/account-table";

const breadcrumb = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Account",
    href: "/account",
  },
];

export default function AccountPage() {
  return (
    <PageWrapper breadcrumb={breadcrumb} className="space-y-4">
      <AccountTable />
    </PageWrapper>
  );
}
