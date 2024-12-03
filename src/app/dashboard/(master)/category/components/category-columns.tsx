import { ColumnDef } from "@tanstack/react-table";

import {
  DefaultColumn,
  NameColumn,
  NoColumn,
} from "@/components/table-columns";
import { Badge } from "@/components/ui/badge";

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
];
