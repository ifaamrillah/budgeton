"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

import { CategoryModal } from "./category-modal";

export const CategoryTable = () => {
  const [isOpenModal, setOpenModal] = useState<boolean>(false);

  return (
    <>
      <div className="flex justify-end gap-4">
        <Button onClick={() => setOpenModal(true)}>
          <PlusCircle /> Add Category
        </Button>
      </div>
      {isOpenModal && (
        <CategoryModal isOpen={isOpenModal} setOpen={setOpenModal} />
      )}
    </>
  );
};
