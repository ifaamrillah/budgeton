"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AxiosError } from "axios";

import {
  createAccount,
  getAccountById,
  updateAccountById,
} from "@/services/account";
import {
  AccountValidator,
  TypeAccountValidator,
} from "@/validator/account-validator";

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
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form/form-input";
import { FormCurrency } from "@/components/form/form-currency";
import { FormSwitch } from "@/components/form/form-switch";

interface AccountModalProps {
  id?: string;
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const AccountModal = ({ id, isOpen, setOpen }: AccountModalProps) => {
  const queryClient = useQueryClient();

  const form = useForm<TypeAccountValidator>({
    resolver: zodResolver(AccountValidator),
    defaultValues: {
      name: "",
      startingBalance: 0,
      status: true,
    },
  });

  const { data, isSuccess } = useQuery({
    queryKey: ["account", id],
    queryFn: () => getAccountById(id),
    enabled: !!id,
  });

  const { mutate: mutateCreateAccount, isPending: isPendingCreateAccount } =
    useMutation({
      mutationFn: (values: TypeAccountValidator) => createAccount(values),
      onSuccess: () => {
        toast.success("Create account successfully.");
      },
      onError: (err: AxiosError<{ message: string }>) => {
        toast.error(err?.response?.data?.message || "Create account failed.");
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["account"] });
        setOpen(false);
      },
    });

  const { mutate: mutateUpdateAccount, isPending: isPendingUpdateAccount } =
    useMutation({
      mutationFn: (values: TypeAccountValidator) =>
        updateAccountById(id as string, values),
      onSuccess: () => {
        toast.success("Edit account successfully.");
      },
      onError: (err: AxiosError<{ message: string }>) => {
        toast.error(err?.response?.data?.message || "Edit account failed.");
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["account"] });
        setOpen(false);
      },
    });

  useEffect(() => {
    if (id && data?.data) {
      form.reset({
        name: data?.data.name,
        startingBalance: +data?.data.startingBalance,
        status: data?.data.status,
      });
    }
  }, [id, data, form]);

  const onSubmit = (values: TypeAccountValidator) => {
    if (id) {
      mutateUpdateAccount(values);
    } else {
      mutateCreateAccount(values);
    }
  };

  if (id && !isSuccess) return null;

  return (
    <Credenza open={isOpen} onOpenChange={setOpen}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>{id ? "Edit" : "Add New"} Account</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormInput
                form={form}
                name="name"
                label="Name"
                placeholder="Account name"
                required
                disabled={isPendingCreateAccount || isPendingUpdateAccount}
              />
              <FormCurrency
                form={form}
                name="startingBalance"
                label="Starting Balance"
                required
                disabled={isPendingCreateAccount || isPendingUpdateAccount}
              />
              <FormSwitch
                form={form}
                name="status"
                label="Status"
                required
                placeholder="You can make account active or inactive."
                disabled={isPendingCreateAccount || isPendingUpdateAccount}
              />
            </form>
          </Form>
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button
              variant="outline"
              disabled={isPendingCreateAccount || isPendingUpdateAccount}
            >
              Cancel
            </Button>
          </CredenzaClose>
          <Button
            onClick={() => form.handleSubmit(onSubmit)()}
            disabled={isPendingCreateAccount || isPendingUpdateAccount}
          >
            {isPendingCreateAccount || isPendingUpdateAccount
              ? "Saving..."
              : "Save"}
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};
