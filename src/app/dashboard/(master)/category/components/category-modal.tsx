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

interface CategoryModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export const CategoryModal = ({ isOpen, setOpen }: CategoryModalProps) => {
  return (
    <Credenza open={isOpen} onOpenChange={setOpen}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Add New Category</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody>Category Modal</CredenzaBody>
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
