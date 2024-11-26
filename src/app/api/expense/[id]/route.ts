import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

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
