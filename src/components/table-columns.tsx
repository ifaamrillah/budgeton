/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ColumnProps extends Omit<ColumnDef<unknown>, "cell" | "meta"> {
  accessorKey: string;
  widthAuto?: boolean;
  width?: number;
  cell?: ({ row }: { row: any }) => React.ReactNode;
}

const getWidthClass = (
  defaultWidth: number,
  widthAuto: boolean,
  customWidth?: number
) => (widthAuto ? "w-auto" : `w-[${customWidth || defaultWidth}px]`);

export const NoColumn = ({
  accessorKey,
  widthAuto = false,
  width,
  ...props
}: ColumnProps): ColumnDef<unknown> => ({
  accessorKey,
  cell: ({ row }) => row.index + 1,
  meta: {
    className: cn(getWidthClass(60, widthAuto, width)),
  },
  ...props,
});

export const NameColumn = ({
  accessorKey,
  widthAuto = false,
  width,
  ...props
}: ColumnProps): ColumnDef<unknown> => ({
  accessorKey,
  meta: {
    className: cn(getWidthClass(250, widthAuto, width)),
  },
  ...props,
});

export const DateColumn = ({
  accessorKey,
  widthAuto = false,
  width,
  dateFormat = "d MMM yyyy",
  ...props
}: ColumnProps & {
  dateFormat?: string;
}): ColumnDef<unknown> => ({
  accessorKey,
  cell: ({ row }) => (
    <div className="text-end">
      {format(row.getValue(accessorKey), dateFormat)}
    </div>
  ),
  meta: {
    className: cn(getWidthClass(150, widthAuto, width)),
  },
  ...props,
});

export const AmountColumn = ({
  accessorKey,
  widthAuto = false,
  width,
  ...props
}: ColumnProps): ColumnDef<unknown> => ({
  accessorKey,
  cell: ({ row }) => {
    const startingBalance = parseFloat(row.getValue(accessorKey));
    const formatted = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(startingBalance);
    return formatted;
  },
  meta: {
    className: cn(getWidthClass(200, widthAuto, width)),
  },
  ...props,
});

export const DescriptionColumn = ({
  accessorKey,
  widthAuto = false,
  width,
  ...props
}: ColumnProps): ColumnDef<unknown> => ({
  accessorKey,
  cell: ({ row }) => {
    const text = row.getValue("description") as string;
    return (
      <Tooltip>
        <TooltipTrigger
          className={cn(
            "text-start max-w-[350px] truncate overflow-hidden whitespace-nowrap",
            width ? `max-w-[${width}px]` : "max-w-[350px]"
          )}
          title={text}
        >
          {text}
        </TooltipTrigger>
        <TooltipContent className="max-w-[400px]">{text}</TooltipContent>
      </Tooltip>
    );
  },
  meta: {
    className: cn(getWidthClass(250, widthAuto, width)),
  },
  ...props,
});

export const ActionColumn = ({
  accessorKey,
  widthAuto = false,
  width,
  ...props
}: ColumnProps): ColumnDef<unknown> => ({
  id: "actions",
  accessorKey,
  meta: {
    className: cn(getWidthClass(60, widthAuto, width)),
  },
  ...props,
});

export const DefaultColumn = ({
  accessorKey,
  widthAuto = false,
  width,
  ...props
}: ColumnProps): ColumnDef<unknown> => ({
  accessorKey,
  meta: {
    className: cn(getWidthClass(150, widthAuto, width)),
  },
  ...props,
});
