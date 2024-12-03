"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Settings, SquarePen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { deleteCategoryById } from "@/services/category-service";

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
import { Button, buttonVariants } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";

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
  const queryClient = useQueryClient();
  const [isModalEditOpen, setModalEditOpen] = useState<boolean>(false);
  const [isModalDeleteOpen, setModalDeleteOpen] = useState<boolean>(false);

  const { mutate: mutateDeleteCategory, isPending: isPendingDeleteCategory } =
    useMutation({
      mutationFn: (id: string) => deleteCategoryById(id),
      onSuccess: () => {
        toast.success("Delete category successfully.");
      },
      onError: (err: AxiosError<{ message: string }>) => {
        toast.error(err?.response?.data?.message || "Delete category failed.");
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["getAllCategory"] });
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
        <CategoryModal
          id={id}
          isOpen={isModalEditOpen}
          setOpen={setModalEditOpen}
        />
      )}

      {isModalDeleteOpen && (
        <ConfirmModal
          isOpen={isModalDeleteOpen}
          setOpen={setModalDeleteOpen}
          isLoading={isPendingDeleteCategory}
          title="Are you sure you want to delete it?"
          description="This action cannot be undone. This will permanently delete your category and remove your data from our servers."
          confirmBtnLabel="Delete"
          confirmBtnClassName={buttonVariants({ variant: "destructive" })}
          onConfirm={() => mutateDeleteCategory(id)}
        />
      )}
    </>
  );
};
