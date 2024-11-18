import { Dispatch, SetStateAction } from "react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  title: string;
  description: string;
  confirmBtnLabel: string;
  confirmBtnClassName: string;
  onConfirm: () => void;
}

export const ConfirmModal = ({
  isOpen = false,
  setOpen,
  isLoading,
  title,
  description,
  confirmBtnLabel,
  confirmBtnClassName,
  onConfirm,
}: ConfirmModalProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <Button
            className={cn(confirmBtnClassName)}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {confirmBtnLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
