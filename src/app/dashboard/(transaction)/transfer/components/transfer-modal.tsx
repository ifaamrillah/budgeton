"use client";

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

interface TransferModalProps {
  id?: string;
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const TransferModal = ({ isOpen, setOpen }: TransferModalProps) => {
  return (
    <Credenza open={isOpen} onOpenChange={setOpen}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Add New Transfer</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody>Halo</CredenzaBody>
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
