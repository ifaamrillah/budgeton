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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

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

  const onSubmit = async (values: TypeAccountValidator) => {
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
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Bank Account"
                        {...field}
                        disabled={
                          isPendingCreateAccount || isPendingUpdateAccount
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startingBalance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Starting Balance</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-muted-foreground font-medium text-sm">
                            Rp
                          </span>
                        </div>
                        <Input
                          id="currency"
                          type="text"
                          placeholder="10,000"
                          className="pl-10"
                          value={
                            field.value === 0 || field.value
                              ? new Intl.NumberFormat().format(
                                  Number(field.value)
                                )
                              : ""
                          }
                          onChange={(e) => {
                            const rawAmount = e.target.value.replace(/\D/g, "");
                            const finalAmount =
                              rawAmount === "" ? 0 : Number(rawAmount);
                            field.onChange(finalAmount);
                            const formattedAmount =
                              new Intl.NumberFormat().format(finalAmount);
                            e.target.value = formattedAmount;
                          }}
                          disabled={
                            isPendingCreateAccount || isPendingUpdateAccount
                          }
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Status</FormLabel>
                    <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormDescription>
                          You can make account active or inactive.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={
                            isPendingCreateAccount || isPendingUpdateAccount
                          }
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
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
