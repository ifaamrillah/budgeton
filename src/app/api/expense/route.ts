import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { ExpenseValidator } from "@/lib/validator";

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
      userId: user.id,
    };
  };

  // Create expense
  const createExpense = await db.expense.create({
    data: transformFields(),
  });
  if (createExpense) {
    return NextResponse.json(
      {
        message: "Create expense successfully.",
        data: createExpense,
      },
      { status: 200 }
    );
  }

  //   Internal server error
  return NextResponse.json(
    {
      message: "Create expense failed.",
    },
    { status: 500 }
  );
}
