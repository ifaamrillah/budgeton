import { PageWrapper } from "@/components/page-wrapper";

import AddAccountButton from "./components/add-account-button";

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
      <div className="flex justify-end gap-4">
        <AddAccountButton />
      </div>
      <div className="bg-red-50">Table</div>
    </PageWrapper>
  );
}
