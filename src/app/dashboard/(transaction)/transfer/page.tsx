import { PageWrapper } from "@/components/page-wrapper";

import { TransferTable } from "./components/transfer-table";

const breadcrumb = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Transaction",
  },
  {
    label: "Transfer",
    href: "/transfer",
  },
];

export default function TransferPage() {
  return (
    <PageWrapper breadcrumb={breadcrumb} className="space-y-4">
      <TransferTable />
    </PageWrapper>
  );
}
