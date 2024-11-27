"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { getAccountOptions } from "@/services/account-service";

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
import { FormDate } from "@/components/form/form-date";
import { FormTextArea } from "@/components/form/form-textarea";
import { FormCombobox } from "@/components/form/form-combobox";
import { FormCurrency } from "@/components/form/form-currency";
import { TransferValidator, TypeTransferValidator } from "@/lib/validator";

interface TransferModalProps {
  id?: string;
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const TransferModal = ({ isOpen, setOpen }: TransferModalProps) => {
  const form = useForm<TypeTransferValidator>({
    resolver: zodResolver(TransferValidator),
    defaultValues: {
      date: new Date(),
      description: "",
      amountIn: 0,
      amountOut: 0,
      fromAccount: {
        value: "",
        label: "",
      },
      toAccount: {
        value: "",
        label: "",
      },
      fee: 0,
    },
  });

  const amountOut = form.watch("amountOut");
  const amountIn = form.watch("amountIn");

  // Calculate and set fee
  useEffect(() => {
    const calculatedFee = amountOut - amountIn;
    form.setValue("fee", calculatedFee);
  }, [amountOut, amountIn, form]);

  const onSubmit = (values: TypeTransferValidator) => {
    console.log(values);
  };

  return (
    <Credenza open={isOpen} onOpenChange={setOpen}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Add New Transfer</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 my-4"
            >
              <FormDate form={form} name="date" label="Date" required />
              <FormTextArea
                form={form}
                name="description"
                label="Description"
                placeholder="Enter your transfer details"
              />
              <FormCombobox
                form={form}
                name="fromAccount"
                label="From Account"
                required
                placeholder="Select Account"
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
              />
              <FormCurrency
                form={form}
                name="amountOut"
                label="Amount Out"
                required
              />
              <FormCombobox
                form={form}
                name="toAccount"
                label="To Account"
                required
                placeholder="Select Account"
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
              />
              <FormCurrency
                form={form}
                name="amountIn"
                label="Amount In"
                required
              />
              <FormCurrency form={form} name="fee" label="Fee" disabled />
            </form>
          </Form>
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button variant="outline">Cancel</Button>
          </CredenzaClose>
          <Button onClick={() => form.handleSubmit(onSubmit)()}>Save</Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};
