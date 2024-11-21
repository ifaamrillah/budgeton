"use client";

import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { getAccountOptions } from "@/services/account";
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

export default function IncomeModal({ id, isOpen, setOpen }: IncomeModalProps) {
  const form = useForm<TypeIncomeValidator>({
    resolver: zodResolver(IncomeValidator),
    defaultValues: {
      date: new Date(),
      description: "",
      amount: 0,
    },
  });

  const onSubmit = (values: TypeIncomeValidator) => {
    console.log(values);
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
              <FormDate form={form} name="date" label="Date" required />
              <FormTextArea
                form={form}
                name="description"
                label="Description"
                required
                placeholder="Enter your income details"
              />
              <FormCurrency form={form} name="amount" label="Amount" required />
              <FormCombobox
                form={form}
                name="accountId"
                label="Account"
                required
                placeholder="Select account"
                optionFn={getAccountOptions}
              />
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
}
