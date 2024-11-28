import { ColumnDef } from "@tanstack/react-table";

import {
  AmountColumn,
  DateColumn,
  DescriptionColumn,
  NameColumn,
  NoColumn,
} from "@/components/table-columns";

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
];
