import { PageWrapper } from "@/components/page-wrapper";

const breadcrumb = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Master",
  },
  {
    label: "Category",
    href: "/category",
  },
];

export default function CategoryPage() {
  return (
    <PageWrapper breadcrumb={breadcrumb} className="space-y-4">
      Category Page
    </PageWrapper>
  );
}
