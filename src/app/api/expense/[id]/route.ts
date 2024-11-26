import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { ExpenseValidator } from "@/lib/validator";

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

  // Get expense by id
  const getExpenseById = await db.expense.findUnique({
    where: {
      id,
    },
    include: {
      account: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  if (!getExpenseById) {
    return NextResponse.json(
      { message: `Expense with id: "${id}" was not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      message: `Get expense with id: "${id}" successfully.`,
      data: getExpenseById,
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
  const getExpenseById = await db.expense.findUnique({
    where: { id },
    select: {
      id: true,
    },
  });
  if (!getExpenseById) {
    return NextResponse.json(
      { message: `Expense with id: "${id}" was not found.` },
      { status: 404 }
    );
  }

  // Body
  const body = await req.json();
  if (body.date) body.date = new Date(body.date);

  // Field validation
  const validatedFields = ExpenseValidator.safeParse(body);
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
    const { account, ...newData } = validatedFields.data;

    return {
      ...newData,
      accountId: account.value,
    };
  };

  // Update expense by id
  const updateExpenseById = await db.expense.update({
    where: {
      id,
    },
    data: transformFields(),
    include: {
      account: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  if (updateExpenseById) {
    return NextResponse.json(
      {
        message: "Edit expense successfully.",
        data: updateExpenseById,
      },
      { status: 200 }
    );
  }

  // Internal server error
  return NextResponse.json(
    { message: "Edit expense failed." },
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
  const getExpenseById = await db.expense.findUnique({
    where: { id },
    select: {
      id: true,
    },
  });
  if (!getExpenseById) {
    return NextResponse.json(
      { message: `Expense with id: "${id}" was not found.` },
      { status: 404 }
    );
  }

  // Delete expense by id
  const deleteExpenseById = await db.expense.delete({
    where: {
      id,
    },
  });
  if (deleteExpenseById) {
    return NextResponse.json(
      { message: "Delete expense successfully." },
      { status: 200 }
    );
  }

  // Internal server error
  return NextResponse.json(
    { message: "Delete expense failed." },
    { status: 500 }
  );
}
