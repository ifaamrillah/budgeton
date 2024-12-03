"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Settings, SquarePen, Trash2 } from "lucide-react";

import {
  ActionColumn,
  DefaultColumn,
  NameColumn,
  NoColumn,
} from "@/components/table-columns";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { CategoryModal } from "./category-modal";

export const categoryColumns: ColumnDef<unknown>[] = [
  NoColumn({
    accessorKey: "id",
    header: "No",
  }),
  DefaultColumn({
    accessorKey: "type",
    header: "Type",
    width: 150,
    cell: ({ row }) => {
      const text = row.getValue("type");
      const transformText =
        text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      return (
        <Badge
          className="rounded-full shadow-none"
          variant={text === "INCOME" ? "success" : "destructive"}
        >
          {transformText}
        </Badge>
      );
    },
  }),
  NameColumn({
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
    widthAuto: true,
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
        <CategoryModal
          id={id}
          isOpen={isModalEditOpen}
          setOpen={setModalEditOpen}
        />
      )}
    </>
  );
};
