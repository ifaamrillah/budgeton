import { Dispatch, SetStateAction } from "react";

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

interface ExpenseModalProps {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const ExpenseModal = ({ isOpen, setOpen }: ExpenseModalProps) => {
  return (
    <Credenza open={isOpen} onOpenChange={setOpen}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Create Expense</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody>Expense Modal</CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button variant="outline">Cancel</Button>
          </CredenzaClose>
          <Button>Save</Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};
