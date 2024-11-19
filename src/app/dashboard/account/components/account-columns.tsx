"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Settings, SquarePen, Trash2 } from "lucide-react";
import { Account } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { deleteAccountById } from "@/services/account";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmModal } from "@/components/ui/confirm-modal";

import { AccountModal } from "./account-modal";

export const accountColumns: ColumnDef<Account>[] = [
  {
    accessorKey: "id",
    header: "No",
    cell: ({ row }) => row.index + 1,
    meta: {
      className: "w-[40px]",
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
  },
  {
    accessorKey: "startingBalance",
    header: "Starting balance",
    meta: {
      className: "w-[200px]",
    },
    cell: ({ row }) => {
      const startingBalance = parseFloat(row.getValue("startingBalance"));
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(startingBalance);
      return formatted;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: {
      className: "w-[100px]",
    },
    cell: ({ row }) => (
      <Badge
        className="rounded-full shadow-none"
        variant={row.getValue("status") ? "success" : "destructive"}
      >
        {row.getValue("status") ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Action",
    meta: {
      className: "w-[60px]",
    },
    cell: ({ row }) => <ActionButton id={row.getValue("id")} />,
  },
];

const ActionButton = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();
  const [isModalEditOpen, setModalEditOpen] = useState<boolean>(false);
  const [isModalDeleteOpen, setModalDeleteOpen] = useState<boolean>(false);

  const { mutate: mutateDeleteAccount, isPending: isPendingDeleteAccount } =
    useMutation({
      mutationFn: (id: string) => deleteAccountById(id),
      onSuccess: () => {
        toast.success("Delete account successfully.");
      },
      onError: (err: AxiosError<{ message: string }>) => {
        toast.error(err?.response?.data?.message || "Delete account failed.");
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["account"] });
        setModalDeleteOpen(false);
      },
    });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Open menu</span>
            <Settings className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => setModalEditOpen(true)}
            className="cursor-pointer"
          >
            <SquarePen className="size-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setModalDeleteOpen(true)}
            className="text-red-500 cursor-pointer"
          >
            <Trash2 className="size-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isModalEditOpen && (
        <AccountModal
          id={id}
          isOpen={isModalEditOpen}
          setOpen={setModalEditOpen}
        />
      )}

      {isModalDeleteOpen && (
        <ConfirmModal
          isOpen={isModalDeleteOpen}
          setOpen={setModalDeleteOpen}
          isLoading={isPendingDeleteAccount}
          title="Are you sure you want to delete it?"
          description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
          confirmBtnLabel="Delete"
          confirmBtnClassName={buttonVariants({ variant: "destructive" })}
          onConfirm={() => mutateDeleteAccount(id)}
        />
      )}
    </>
  );
};
