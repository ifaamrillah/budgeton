"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Settings, SquarePen, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { deleteExpenseById } from "@/services/expense-service";

import {
  ActionColumn,
  AmountColumn,
  DateColumn,
  DescriptionColumn,
  NameColumn,
  NoColumn,
} from "@/components/table-columns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";

import { ExpenseModal } from "./expense-modal";

export const expenseColumns: ColumnDef<unknown>[] = [
  NoColumn({
    accessorKey: "id",
    header: "No",
  }),
  DateColumn({
    accessorKey: "date",
    header: "Date",
    enableSorting: true,
    dateFormat: "d MMM yyyy",
    width: 100,
  }),
  DescriptionColumn({
    accessorKey: "description",
    header: "Description",
    widthAuto: true,
  }),
  AmountColumn({
    accessorKey: "amount",
    header: "Amount",
    enableSorting: true,
  }),
  NameColumn({
    accessorKey: "account.name",
    header: "Account",
  }),
  ActionColumn({
    accessorKey: "actions",
    header: "Action",
    cell: ({ row }) => <ActionButton id={row.getValue("id")} />,
  }),
];

const ActionButton = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();
  const [isModalEditOpen, setModalEditOpen] = useState<boolean>(false);
  const [isModalDeleteOpen, setModalDeleteOpen] = useState<boolean>(false);

  const { mutate: mutateDeleteExpense, isPending: isPendingDeleteExpense } =
    useMutation({
      mutationFn: (id: string) => deleteExpenseById(id),
      onSuccess: () => {
        toast.success("Delete expense successfully.");
      },
      onError: (err: AxiosError<{ message: string }>) => {
        toast.error(err?.response?.data?.message || "Delete expense failed.");
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["getAllExpense"] });
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
        <ExpenseModal
          id={id}
          isOpen={isModalEditOpen}
          setOpen={setModalEditOpen}
        />
      )}

      {isModalDeleteOpen && (
        <ConfirmModal
          isOpen={isModalDeleteOpen}
          setOpen={setModalDeleteOpen}
          isLoading={isPendingDeleteExpense}
          title="Are you sure you want to delete it?"
          description="This action cannot be undone. This will permanently delete your expense and remove your data from our servers."
          confirmBtnLabel="Delete"
          confirmBtnClassName={buttonVariants({ variant: "destructive" })}
          onConfirm={() => mutateDeleteExpense(id)}
        />
      )}
    </>
  );
};
