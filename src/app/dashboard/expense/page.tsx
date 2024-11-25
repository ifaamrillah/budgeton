import { PageWrapper } from "@/components/page-wrapper";

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
      Expense Table
    </PageWrapper>
  );
}
