import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { IncomeValidator } from "@/lib/validator";

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

  // Get income by id
  const getIncomeById = await db.income.findUnique({
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
  if (!getIncomeById) {
    return NextResponse.json(
      { message: `Income with id: "${id}" was not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      message: `Get income with id: "${id}" successfully.`,
      data: getIncomeById,
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
  const getIncomeById = await db.income.findUnique({
    where: { id },
  });
  if (!getIncomeById) {
    return NextResponse.json(
      { message: `Income with id: "${id}" was not found.` },
      { status: 404 }
    );
  }

  // Body
  const body = await req.json();
  if (body.date) body.date = new Date(body.date);

  // Field validation
  const validatedFields = IncomeValidator.safeParse(body);
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

  // Update income by id
  const update = await db.income.update({
    where: {
      id,
    },
    data: {
      ...validatedFields.data,
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
  if (update) {
    return NextResponse.json(
      {
        message: "Edit income successfully.",
        data: update,
      },
      { status: 200 }
    );
  }

  // Internal server error
  return NextResponse.json({ message: "Edit income failed." }, { status: 500 });
}
