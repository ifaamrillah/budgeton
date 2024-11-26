import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { getAccountOptions } from "@/services/account-service";
import { createExpense } from "@/services/expense-service";

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
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const ExpenseModal = ({ isOpen, setOpen }: ExpenseModalProps) => {
  const queryClient = useQueryClient();

  const form = useForm<TypeExpenseValidator>({
    resolver: zodResolver(ExpenseValidator),
    defaultValues: {
      date: new Date(),
      description: "",
      amount: 0,
      account: {
        value: "",
        label: "",
      },
    },
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

  const onSubmit = (values: TypeExpenseValidator) => {
    mutateCreateExpense(values);
  };

  return (
    <Credenza open={isOpen} onOpenChange={setOpen}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Create Expense</CredenzaTitle>
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
                disabled={isPendingCreateExpense}
              />
              <FormTextArea
                form={form}
                name="description"
                label="Description"
                placeholder="Enter your expense details"
                disabled={isPendingCreateExpense}
              />
              <FormCurrency
                form={form}
                name="amount"
                label="Amount"
                required
                disabled={isPendingCreateExpense}
              />
              <FormCombobox
                form={form}
                name="account"
                label="Account"
                required
                placeholder="Select account"
                fetchOptions={(search) =>
                  getAccountOptions({
                    filter: {
                      name: search,
                      status: true,
                    },
                  })
                }
                disabled={isPendingCreateExpense}
              />
            </form>
          </Form>
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button variant="outline" disabled={isPendingCreateExpense}>
              Cancel
            </Button>
          </CredenzaClose>
          <Button
            onClick={() => form.handleSubmit(onSubmit)()}
            disabled={isPendingCreateExpense}
          >
            {isPendingCreateExpense ? "Saving..." : "Save"}
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};
