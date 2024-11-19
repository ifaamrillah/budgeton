import { PageWrapper } from "@/components/page-wrapper";

import { IncomeTable } from "./components/income-table";

const breadcrumb = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Transaction",
  },
  {
    label: "Income",
    href: "/income",
  },
];

export default function IncomePage() {
  return (
    <PageWrapper breadcrumb={breadcrumb} className="space-y-4">
      <IncomeTable />
    </PageWrapper>
  );
}
