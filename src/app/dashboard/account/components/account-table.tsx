"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { PlusCircle } from "lucide-react";

import { getAllAccount } from "@/services/account-service";

import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { accountColumns } from "./account-columns";
import { AccountModal } from "./account-modal";

export const AccountTable = () => {
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
    queryKey: ["account", pagination, sorting],
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
        <Button onClick={() => setOpenModal(true)}>
          <PlusCircle /> Add Account
        </Button>
      </div>
      <div>
        <DataTable
          isLoading={isFetching}
          data={data?.data}
          columns={accountColumns}
          totalData={data?.pagination?.totalData}
          pagination={pagination}
          setPagination={setPagination}
          sorting={sorting}
          setSorting={setSorting}
        />
      </div>
      {isOpenModal && (
        <AccountModal isOpen={isOpenModal} setOpen={setOpenModal} />
      )}
    </>
  );
};
