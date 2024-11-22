"use client";

import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { getAccountOptions } from "@/services/account";
import { createIncome } from "@/services/income";
import {
  IncomeValidator,
  TypeIncomeValidator,
} from "@/validator/account-validator";

import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import { Form } from "@/components/ui/form";
import { FormCurrency } from "@/components/form/form-currency";
import { FormDate } from "@/components/form/form-date";
import { FormTextArea } from "@/components/form/form-textarea";
import { FormCombobox } from "@/components/form/form-combobox";

interface IncomeModalProps {
  id?: string;
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function IncomeModal({ id, isOpen, setOpen }: IncomeModalProps) {
  const queryClient = useQueryClient();

  const form = useForm<TypeIncomeValidator>({
    resolver: zodResolver(IncomeValidator),
    defaultValues: {
      date: new Date(),
      description: "",
      amount: 0,
    },
  });

  const { mutate: mutateCreateIncome, isPending: isPendingCreateAccount } =
    useMutation({
      mutationFn: (values: TypeIncomeValidator) => createIncome(values),
      onSuccess: () => {
        toast.success("Create income successfully.");
      },
      onError: (err: AxiosError<{ message: string }>) => {
        toast.error(err?.response?.data?.message || "Create income failed.");
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["income"] });
        setOpen(false);
      },
    });

  const onSubmit = (values: TypeIncomeValidator) => {
    mutateCreateIncome(values);
  };

  return (
    <Credenza open={isOpen} onOpenChange={setOpen}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>{id ? "Edit" : "Add New"} Income</CredenzaTitle>
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
                disabled={isPendingCreateAccount}
              />
              <FormTextArea
                form={form}
                name="description"
                label="Description"
                placeholder="Enter your income details"
                disabled={isPendingCreateAccount}
              />
              <FormCurrency
                form={form}
                name="amount"
                label="Amount"
                required
                disabled={isPendingCreateAccount}
              />
              <FormCombobox
                form={form}
                name="accountId"
                label="Account"
                required
                placeholder="Select account"
                disabled={isPendingCreateAccount}
                fetchOptions={(search) =>
                  getAccountOptions({
                    filter: {
                      name: search,
                      status: true,
                    },
                  })
                }
              />
            </form>
          </Form>
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button variant="outline" disabled={isPendingCreateAccount}>
              Cancel
            </Button>
          </CredenzaClose>
          <Button
            onClick={() => form.handleSubmit(onSubmit)()}
            disabled={isPendingCreateAccount}
          >
            {isPendingCreateAccount ? "Saving..." : "Save"}
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
