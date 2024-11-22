"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { PlusCircle } from "lucide-react";

import { getAllIncome } from "@/services/income";

import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { incomeColumns } from "./income-columns";
import { IncomeModal } from "./income-modal";

export const IncomeTable = () => {
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
    queryKey: ["income", pagination, sorting],
    queryFn: () =>
      getAllIncome({
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

  console.log(data);

  return (
    <>
      <div className="flex justify-end gap-4">
        <Button onClick={() => setOpenModal(true)}>
          <PlusCircle /> Add Income
        </Button>
      </div>
      <div>
        <DataTable
          isLoading={isFetching}
          data={data?.data}
          columns={incomeColumns}
          totalData={data?.pagination?.totalData}
          pagination={pagination}
          setPagination={setPagination}
          sorting={sorting}
          setSorting={setSorting}
        />
      </div>
      {isOpenModal && (
        <IncomeModal isOpen={isOpenModal} setOpen={setOpenModal} />
      )}
    </>
  );
};
