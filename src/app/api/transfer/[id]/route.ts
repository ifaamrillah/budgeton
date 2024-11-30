import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { TransferValidator } from "@/lib/validator";

import { authorizeAndValidateUser } from "@/server/auth-server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authorization
  const authResult = await authorizeAndValidateUser();
  if ("status" in authResult) return authResult;

  // Params
  const id = (await params).id;

  // Get transfer by id
  const getTransferById = await db.transfer.findUnique({
    where: {
      id,
    },
    include: {
      fromAccount: {
        select: {
          id: true,
          name: true,
        },
      },
      toAccount: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  if (!getTransferById) {
    return NextResponse.json(
      { message: `Transfer with id: "${id}" was not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      message: `Get transfer with id: "${id}" successfully.`,
      data: getTransferById,
    },
    { status: 200 }
  );
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authorization
  const authResult = await authorizeAndValidateUser();
  if ("status" in authResult) return authResult;

  // Params
  const id = (await params).id;

  // Check id is valid
  const getTransferById = await db.transfer.findUnique({
    where: { id },
    select: {
      id: true,
    },
  });
  if (!getTransferById) {
    return NextResponse.json(
      { message: `Transfer with id: "${id}" was not found.` },
      { status: 404 }
    );
  }

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
    };
  };

  // Update transfer by id
  const updateTransferById = await db.transfer.update({
    where: {
      id,
    },
    data: transformFields(),
    include: {
      fromAccount: {
        select: {
          id: true,
          name: true,
        },
      },
      toAccount: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  if (updateTransferById) {
    return NextResponse.json(
      {
        message: "Edit transfer successfully.",
        data: updateTransferById,
      },
      { status: 200 }
    );
  }

  // Internal server error
  return NextResponse.json(
    { message: "Edit transfer failed." },
    { status: 500 }
  );
}
