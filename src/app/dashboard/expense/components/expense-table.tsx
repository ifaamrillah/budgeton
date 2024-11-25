"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

import { ExpenseModal } from "./expense-modal";

export const ExpenseTable = () => {
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  return (
    <>
      <div className="flex justify-end gap-4">
        <Button onClick={() => setOpenModal(true)}>
          <PlusCircle /> Add Expense
        </Button>
      </div>
      <div>Table</div>
      {isOpenModal && (
        <ExpenseModal isOpen={isOpenModal} setOpen={setOpenModal} />
      )}
    </>
  );
};
