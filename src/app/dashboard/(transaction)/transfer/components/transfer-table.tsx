"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

import { TransferModal } from "./transfer-modal";

export const TransferTable = () => {
  const [isOpenModal, setOpenModal] = useState<boolean>(false);

  return (
    <>
      <div className="flex justify-end gap-4">
        <Button onClick={() => setOpenModal(true)}>
          <PlusCircle /> Add Transfer
        </Button>
      </div>

      {isOpenModal && (
        <TransferModal isOpen={isOpenModal} setOpen={setOpenModal} />
      )}
    </>
  );
};
