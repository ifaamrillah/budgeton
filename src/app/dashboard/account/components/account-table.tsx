"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PaginationState, SortingState } from "@tanstack/react-table";

import { getAllAccount } from "@/services/account";

import { DataTable } from "@/components/ui/data-table";
import { accountColumns } from "./account-columns";
import { AddAccountButton } from "./add-account-button";

export const AccountTable = () => {
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

  const { data } = useQuery({
    queryKey: ["get-all-account", pagination, sorting],
    queryFn: () =>
      getAllAccount({
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
        <AddAccountButton />
      </div>
      <div>
        {data?.data.data && (
          <DataTable
            data={data?.data.data}
            columns={accountColumns}
            totalData={data?.data.pagination.totalData}
            pagination={pagination}
            setPagination={setPagination}
            sorting={sorting}
            setSorting={setSorting}
          />
        )}
      </div>
    </>
  );
};
