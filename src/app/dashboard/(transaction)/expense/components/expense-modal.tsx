import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { getAccountOptions } from "@/services/account-service";
import { getCategoryOptions } from "@/services/category-service";
import {
  createExpense,
  getExpenseById,
  updateExpenseById,
} from "@/services/expense-service";

import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormCurrency } from "@/components/form/form-currency";
import { FormDate } from "@/components/form/form-date";
import { FormTextArea } from "@/components/form/form-textarea";
import { FormCombobox } from "@/components/form/form-combobox";
import { ExpenseValidator, TypeExpenseValidator } from "@/lib/validator";

interface ExpenseModalProps {
  id?: string;
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const ExpenseModal = ({ id, isOpen, setOpen }: ExpenseModalProps) => {
  const queryClient = useQueryClient();

  const form = useForm<TypeExpenseValidator>({
    resolver: zodResolver(ExpenseValidator),
    defaultValues: {
      date: new Date(),
      description: "",
      amount: 0,
    },
  });

  const { data, isSuccess } = useQuery({
    queryKey: ["getExpenseById", id],
    queryFn: () => getExpenseById(id),
    enabled: !!id,
  });

  const { mutate: mutateCreateExpense, isPending: isPendingCreateExpense } =
    useMutation({
      mutationFn: (values: TypeExpenseValidator) => createExpense(values),
      onSuccess: () => {
        toast.success("Create expense successfully.");
      },
      onError: (err: AxiosError<{ message: string }>) => {
        toast.error(err?.response?.data?.message || "Create expense failed.");
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["getAllExpense"] });
        setOpen(false);
      },
    });

  const { mutate: mutateUpdateExpense, isPending: isPendingUpdateExpense } =
    useMutation({
      mutationFn: (values: TypeExpenseValidator) =>
        updateExpenseById(id as string, values),
      onSuccess: () => {
        toast.success("Edit expense successfully.");
      },
      onError: (err: AxiosError<{ message: string }>) => {
        toast.error(err?.response?.data?.message || "Edit expense failed.");
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["getAllExpense"] });
        setOpen(false);
      },
    });

  useEffect(() => {
    if (id && data?.data) {
      form.reset({
        date: new Date(data?.data?.date),
        description: data?.data?.description,
        amount: +data?.data?.amount,
        category: {
          value: data?.data?.category?.id,
          label: data?.data?.category?.name,
        },
        account: {
          value: data?.data?.account?.id,
          label: data?.data?.account?.name,
        },
      });
    }
  }, [id, data, form]);

  const onSubmit = (values: TypeExpenseValidator) => {
    if (id) {
      mutateUpdateExpense(values);
    } else {
      mutateCreateExpense(values);
    }
  };

  if (id && !isSuccess) return null;

  return (
    <Credenza open={isOpen} onOpenChange={setOpen}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>{id ? "Edit" : "Add New"} Expense</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 my-4"
            >
              <FormDate
                form={form}
                name="date"
                label="Date"
                required
                disabled={isPendingCreateExpense || isPendingUpdateExpense}
              />
              <FormTextArea
                form={form}
                name="description"
                label="Description"
                placeholder="Enter your expense details"
                disabled={isPendingCreateExpense || isPendingUpdateExpense}
              />
              <FormCurrency
                form={form}
                name="amount"
                label="Amount"
                required
                disabled={isPendingCreateExpense || isPendingUpdateExpense}
              />
              <FormCombobox
                form={form}
                name="account"
                label="Account"
                required
                placeholder="Select account"
                fetchOptions={(search) =>
                  getAccountOptions({
                    pagination: {
                      pageIndex: 1,
                      pageSize: 10,
                    },
                    filter: {
                      name: search,
                      status: true,
                    },
                  })
                }
                disabled={isPendingCreateExpense || isPendingUpdateExpense}
              />
              <FormCombobox
                form={form}
                name="category"
                label="Category"
                placeholder="Select category"
                disabled={isPendingCreateExpense || isPendingUpdateExpense}
                fetchOptions={(search) =>
                  getCategoryOptions({
                    pagination: {
                      pageIndex: 1,
                      pageSize: 10,
                    },
                    filter: {
                      name: search,
                      status: true,
                    },
                  })
                }
                allowClear
              />
            </form>
          </Form>
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button
              variant="outline"
              disabled={isPendingCreateExpense || isPendingUpdateExpense}
            >
              Cancel
            </Button>
          </CredenzaClose>
          <Button
            onClick={() => form.handleSubmit(onSubmit)()}
            disabled={isPendingCreateExpense || isPendingUpdateExpense}
          >
            {isPendingCreateExpense || isPendingUpdateExpense
              ? "Saving..."
              : "Save"}
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};
