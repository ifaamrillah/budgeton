import { Dispatch, SetStateAction } from "react";
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

  const onSubmit = (values: TypeExpenseValidator) => {
    console.log(values);
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
              <FormDate form={form} name="date" label="Date" required />
              <FormTextArea
                form={form}
                name="description"
                label="Description"
                placeholder="Enter your income details"
              />
              <FormCurrency form={form} name="amount" label="Amount" required />
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
};
