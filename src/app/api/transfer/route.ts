import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { TransferValidator } from "@/lib/validator";

import { authorizeAndValidateUser } from "@/server/auth-server";

export async function POST(req: NextRequest) {
  // Check authorization
  const authResult = await authorizeAndValidateUser();
  if ("status" in authResult) return authResult;
  const { user } = authResult;

  // Body
  const body = await req.json();
  if (body.date) body.date = new Date(body.date);

  // Field validation
  const validatedFields = TransferValidator.safeParse(body);
  if (!validatedFields.success) {
    return NextResponse.json(
      {
        message:
          validatedFields?.error?.errors[0]?.message ||
          "Field validation error",
      },
      { status: 400 }
    );
  }

  const transformFields = () => {
    const { fromAccount, toAccount, ...newData } = validatedFields.data;

    return {
      ...newData,
      fromAccountId: fromAccount.value,
      toAccountId: toAccount.value,
      userId: user.id,
    };
  };

  // Create transfer
  const createTransfer = await db.transfer.create({
    data: transformFields(),
  });
  if (createTransfer) {
    return NextResponse.json(
      {
        message: "Create transfer successfully.",
        data: createTransfer,
      },
      { status: 201 }
    );
  }

  // Internal server error
  return NextResponse.json(
    { message: "Create transfer failed." },
    { status: 500 }
  );
}
