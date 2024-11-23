"use client";

import { useState } from "react";
import { Income } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Settings, SquarePen, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { deleteIncomeById } from "@/services/income-service";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { Button, buttonVariants } from "@/components/ui/button";

import { IncomeModal } from "./income-modal";

export const incomeColumns: ColumnDef<Income>[] = [
  {
    accessorKey: "id",
    header: "No",
    cell: ({ row }) => row.index + 1,
    meta: {
      className: "w-[60px]",
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    enableSorting: true,
    meta: {
      className: "w-[110px]",
    },
    cell: ({ row }) => (
      <div className="text-end">
        {format(row.getValue("date"), "d MMM yyyy")}
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const text = row.getValue("description") as string;
      const maxChar = 50;
      const ellypsis =
        text?.length > maxChar ? text.slice(0, maxChar) + "..." : text;
      return (
        <Tooltip>
          <TooltipTrigger className="text-start">{ellypsis}</TooltipTrigger>
          <TooltipContent className="w-[400px]">{text}</TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    enableSorting: true,
    meta: {
      className: "w-[200px]",
    },
    cell: ({ row }) => {
      const startingBalance = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(startingBalance);
      return formatted;
    },
  },
  {
    accessorKey: "account.name",
    header: "Account",
    meta: {
      className: "w-[250px]",
    },
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

  const { mutate: mutateDeleteIncome, isPending: isPendingDeleteIncome } =
    useMutation({
      mutationFn: (id: string) => deleteIncomeById(id),
      onSuccess: () => {
        toast.success("Delete income successfully.");
      },
      onError: (err: AxiosError<{ message: string }>) => {
        toast.error(err?.response?.data?.message || "Delete income failed.");
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["getAllIncome"] });
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
        <IncomeModal
          id={id}
          isOpen={isModalEditOpen}
          setOpen={setModalEditOpen}
        />
      )}

      {isModalDeleteOpen && (
        <ConfirmModal
          isOpen={isModalDeleteOpen}
          setOpen={setModalDeleteOpen}
          isLoading={isPendingDeleteIncome}
          title="Are you sure you want to delete it?"
          description="This action cannot be undone. This will permanently delete your income and remove your data from our servers."
          confirmBtnLabel="Delete"
          confirmBtnClassName={buttonVariants({ variant: "destructive" })}
          onConfirm={() => mutateDeleteIncome(id)}
        />
      )}
    </>
  );
};
