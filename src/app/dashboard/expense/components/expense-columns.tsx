import { ColumnDef } from "@tanstack/react-table";
import { Settings, SquarePen, Trash2 } from "lucide-react";

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
import { Button } from "@/components/ui/button";

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
    cell: () => <ActionButton />,
  }),
];

const ActionButton = () => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <Settings className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <SquarePen className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
