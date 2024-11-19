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
    label: "Income",
    href: "/income",
  },
];

export default function IncomePage() {
  return (
    <PageWrapper breadcrumb={breadcrumb} className="space-y-4">
      IncomePage
    </PageWrapper>
  );
}
