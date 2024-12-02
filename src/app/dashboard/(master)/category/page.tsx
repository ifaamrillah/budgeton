import { PageWrapper } from "@/components/page-wrapper";

import { CategoryTable } from "./components/category-table";

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
      <CategoryTable />
    </PageWrapper>
  );
}
