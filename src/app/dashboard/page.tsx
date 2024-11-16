import { PageWrapper } from "@/components/page-wrapper";

const breadcrumb = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
];

export default function DashboardPage() {
  return <PageWrapper breadcrumb={breadcrumb}>DashboardPage</PageWrapper>;
}
