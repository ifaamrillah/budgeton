import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { AccountValidator } from "@/lib/validator";

import { authorizeAndValidateUser } from "@/server/auth-server";
import { calculateAccountBalance } from "@/server/account-server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authorization
  const authResult = await authorizeAndValidateUser();
  if ("status" in authResult) return authResult;

  // Params
  const id = (await params).id;

  // Get account by id
  const getAccountById = await db.account.findUnique({
    where: {
      id,
    },
    include: {
      incomes: { select: { amount: true } },
      expenses: { select: { amount: true } },
      outgoingTransfers: { select: { amountOut: true } },
      incomingTransfers: { select: { amountIn: true } },
    },
  });
  if (!getAccountById) {
    return NextResponse.json(
      { message: `Account with id: "${id}" was not found.` },
      { status: 404 }
    );
  }

  const accountWithBalance = calculateAccountBalance(getAccountById);

  return NextResponse.json(
    {
      message: `Get account with id: "${id}" successfully.`,
      data: accountWithBalance,
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
  const { user } = authResult;

  // Params
  const id = (await params).id;

  // Check id is valid
  const getAccountById = await db.account.findUnique({
    where: { id },
    select: {
      id: true,
    },
  });
  if (!getAccountById) {
    return NextResponse.json(
      { message: `Account with id: "${id}" was not found.` },
      { status: 404 }
    );
  }

  // Body
  const body = await req.json();

  // Field validation
  const validatedFields = AccountValidator.safeParse(body);
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

  // Check name is unique
  const existingAccountName = await db.account.findUnique({
    where: {
      userId_name: {
        userId: user.id,
        name: body.name,
      },
    },
    select: {
      id: true,
      name: true,
    },
  });
  if (existingAccountName && existingAccountName?.id !== id) {
    return NextResponse.json(
      { message: `Account with name: "${body.name}" already exists.` },
      { status: 409 }
    );
  }

  // Update account by id
  const updateAccountById = await db.account.update({
    where: {
      id,
    },
    data: validatedFields.data,
  });
  if (updateAccountById) {
    return NextResponse.json(
      {
        message: "Edit account successfully.",
        data: updateAccountById,
      },
      { status: 200 }
    );
  }

  // Internal server error
  return NextResponse.json(
    { message: "Edit account failed." },
    { status: 500 }
  );
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authorization
  const authResult = await authorizeAndValidateUser();
  if ("status" in authResult) return authResult;

  // Params
  const id = (await params).id;

  // Check id is valid
  const getAccountById = await db.account.findUnique({
    where: { id },
    select: {
      id: true,
      incomes: {
        select: {
          id: true,
        },
      },
      expenses: {
        select: {
          id: true,
        },
      },
      incomingTransfers: {
        select: {
          id: true,
        },
      },
      outgoingTransfers: {
        select: {
          id: true,
        },
      },
    },
  });
  if (!getAccountById) {
    return NextResponse.json(
      {
        message: `Account with id: "${id}" was not found.`,
      },
      { status: 404 }
    );
  }

  // Check account has relations.

  const hasRelations =
    getAccountById.incomes.length > 0 ||
    getAccountById.expenses.length > 0 ||
    getAccountById.incomingTransfers.length > 0 ||
    getAccountById.outgoingTransfers.length > 0;

  if (hasRelations) {
    return NextResponse.json(
      {
        message:
          "Account has connected transactions. Please remove the associated transactions.",
      },
      { status: 409 }
    );
  }

  // Delate account by id
  const deleteAccountById = await db.account.delete({
    where: {
      id,
    },
  });
  if (deleteAccountById) {
    return NextResponse.json(
      {
        message: "Delete account successfully.",
        data: deleteAccountById,
      },
      { status: 200 }
    );
  }

  // Internal server error
  return NextResponse.json(
    {
      message: "Edit account failed.",
    },
    { status: 500 }
  );
}
