"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Settings, SquarePen, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ActionColumn,
  AmountColumn,
  DateColumn,
  DescriptionColumn,
  NameColumn,
  NoColumn,
} from "@/components/table-columns";
import { Button } from "@/components/ui/button";

import { TransferModal } from "./transfer-modal";

export const transferColumns: ColumnDef<unknown>[] = [
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
    accessorKey: "amountOut",
    header: "Amount Out",
    enableSorting: true,
  }),
  NameColumn({
    accessorKey: "fromAccount.name",
    header: "From Account",
  }),
  AmountColumn({
    accessorKey: "amountIn",
    header: "Amount In",
    enableSorting: true,
  }),
  NameColumn({
    accessorKey: "toAccount.name",
    header: "To Account",
  }),
  AmountColumn({
    accessorKey: "fee",
    header: "Fee",
    enableSorting: true,
  }),
  ActionColumn({
    accessorKey: "actions",
    header: "Action",
    cell: ({ row }) => <ActionButton id={row.getValue("id")} />,
  }),
];

const ActionButton = ({ id }: { id: string }) => {
  const [isModalEditOpen, setModalEditOpen] = useState<boolean>(false);

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
          <DropdownMenuItem className="text-red-500 cursor-pointer">
            <Trash2 className="size-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isModalEditOpen && (
        <TransferModal
          id={id}
          isOpen={isModalEditOpen}
          setOpen={setModalEditOpen}
        />
      )}
    </>
  );
};
