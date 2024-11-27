import { PageWrapper } from "@/components/page-wrapper";

import { ExpenseTable } from "./components/expense-table";

const breadcrumb = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Transaction",
  },
  {
    label: "Expense",
    href: "/expense",
  },
];

export default function ExpensePage() {
  return (
    <PageWrapper breadcrumb={breadcrumb} className="space-y-4">
      <ExpenseTable />
    </PageWrapper>
  );
}
