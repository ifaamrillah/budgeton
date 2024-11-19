"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

import IncomeModal from "./income-modal";

export const IncomeTable = () => {
  const [isOpenModal, setOpenModal] = useState<boolean>(false);

  return (
    <>
      <div className="flex justify-end gap-4">
        <Button onClick={() => setOpenModal(true)}>
          <PlusCircle /> Add Income
        </Button>
      </div>
      {isOpenModal && (
        <IncomeModal isOpen={isOpenModal} setOpen={setOpenModal} />
      )}
    </>
  );
};
