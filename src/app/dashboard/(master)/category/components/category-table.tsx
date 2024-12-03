"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { PlusCircle } from "lucide-react";

import { getAllCategory } from "@/services/category-service";

import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";

import { CategoryModal } from "./category-modal";
import { categoryColumns } from "./category-columns";

export const CategoryTable = () => {
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "createdAt",
      desc: false,
    },
  ]);

  const { data, isFetching } = useQuery({
    queryKey: ["getAllCategory", pagination, sorting],
    queryFn: () =>
      getAllCategory({
        pagination: {
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        },
        sorting: {
          sortBy: sorting[0]?.id,
          sortDesc: sorting[0]?.desc,
        },
      }),
  });

  return (
    <>
      <div className="flex justify-end gap-4">
        <Button onClick={() => setOpenModal(true)}>
          <PlusCircle /> Add Category
        </Button>
      </div>
      <div>
        <DataTable
          isLoading={isFetching}
          data={data?.data}
          columns={categoryColumns}
          totalData={data?.pagination?.totalData}
          pagination={pagination}
          setPagination={setPagination}
          sorting={sorting}
          setSorting={setSorting}
        />
      </div>
      {isOpenModal && (
        <CategoryModal isOpen={isOpenModal} setOpen={setOpenModal} />
      )}
    </>
  );
};
