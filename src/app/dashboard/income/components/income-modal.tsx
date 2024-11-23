"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { getAccountOptions } from "@/services/account";
import {
  createIncome,
  getIncomeById,
  updateIncomeById,
} from "@/services/income";
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
      accountId: "",
    },
  });

  const { data, isSuccess } = useQuery({
    queryKey: ["income", id],
    queryFn: () => getIncomeById(id),
    enabled: !!id,
  });

  const { mutate: mutateCreateIncome, isPending: isPendingCreateIncome } =
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

  const { mutate: mutateUpdateIncome, isPending: isPendingUpdateIncome } =
    useMutation({
      mutationFn: (values: TypeIncomeValidator) =>
        updateIncomeById(id as string, values),
      onSuccess: () => {
        toast.success("Edit income successfully.");
      },
      onError: (err: AxiosError<{ message: string }>) => {
        toast.error(err?.response?.data?.message || "Edit income failed.");
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["income"] });
        setOpen(false);
      },
    });

  useEffect(() => {
    if (id && data?.data) {
      form.reset({
        date: new Date(data?.data?.date),
        description: data?.data?.description,
        amount: +data?.data?.amount,
        accountId: data?.data?.account?.id,
      });
    }
  }, [id, data, form]);

  const onSubmit = (values: TypeIncomeValidator) => {
    if (id) {
      mutateUpdateIncome(values);
    } else {
      mutateCreateIncome(values);
    }
  };

  if (id && !isSuccess) return null;

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
                disabled={isPendingCreateIncome || isPendingUpdateIncome}
              />
              <FormTextArea
                form={form}
                name="description"
                label="Description"
                placeholder="Enter your income details"
                disabled={isPendingCreateIncome || isPendingUpdateIncome}
              />
              <FormCurrency
                form={form}
                name="amount"
                label="Amount"
                required
                disabled={isPendingCreateIncome || isPendingUpdateIncome}
              />
              <FormCombobox
                form={form}
                name="accountId"
                label="Account"
                required
                placeholder="Select account"
                disabled={isPendingCreateIncome || isPendingUpdateIncome}
                defaultValue={{
                  value: data?.data?.account?.id,
                  label: data?.data?.account?.name,
                }}
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
            <Button
              variant="outline"
              disabled={isPendingCreateIncome || isPendingUpdateIncome}
            >
              Cancel
            </Button>
          </CredenzaClose>
          <Button
            onClick={() => form.handleSubmit(onSubmit)()}
            disabled={isPendingCreateIncome || isPendingUpdateIncome}
          >
            {isPendingCreateIncome || isPendingUpdateIncome
              ? "Saving..."
              : "Save"}
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
