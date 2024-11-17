"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ChevronsUpDown,
  MoreHorizontal,
  SquarePen,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Account = {
  id: string;
  name: string;
  startingBalance: string;
  status: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export const accountColumns: ColumnDef<Account>[] = [
  {
    accessorKey: "",
    header: "No",
    size: 20,
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
  },
  {
    accessorKey: "startingBalance",
    header: "Starting balance",
    enableSorting: true,
    size: 90,
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
    size: 40,
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
    size: 20,
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <SquarePen className="size-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">
              <Trash2 className="size-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
