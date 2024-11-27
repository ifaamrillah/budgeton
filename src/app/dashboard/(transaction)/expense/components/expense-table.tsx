"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { PlusCircle } from "lucide-react";

import { getAllExpense } from "@/services/expense-service";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";

import { ExpenseModal } from "./expense-modal";
import { expenseColumns } from "./expense-columns";

export const ExpenseTable = () => {
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "date",
      desc: true,
    },
  ]);

  const { data, isFetching } = useQuery({
    queryKey: ["getAllExpense", pagination, sorting],
    queryFn: () =>
      getAllExpense({
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
          <PlusCircle /> Add Expense
        </Button>
      </div>
      <div>
        <DataTable
          isLoading={isFetching}
          data={data?.data}
          columns={expenseColumns}
          totalData={data?.pagination?.totalData}
          pagination={pagination}
          setPagination={setPagination}
          sorting={sorting}
          setSorting={setSorting}
        />
      </div>
      {isOpenModal && (
        <ExpenseModal isOpen={isOpenModal} setOpen={setOpenModal} />
      )}
    </>
  );
};
