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
    label: "Transfer",
    href: "/transfer",
  },
];

export default function TransferPage() {
  return (
    <PageWrapper breadcrumb={breadcrumb} className="space-y-4">
      Transfer Page
    </PageWrapper>
  );
}
