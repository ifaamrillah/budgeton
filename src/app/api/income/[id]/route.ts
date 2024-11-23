import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import { IncomeValidator } from "@/lib/validator";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check Authorization
  const user = await currentUser();
  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized access." },
      { status: 401 }
    );
  }

  // Check Synchronization
  const existingUser = await db.user.findUnique({
    where: { id: user.id },
  });
  if (!existingUser) {
    return NextResponse.json(
      { message: "Users are not synchronized" },
      { status: 422 }
    );
  }

  // Check Expired Plan
  if (existingUser.expiredPlan && existingUser.plan !== "LIFETIME") {
    const expiredDate = new Date(existingUser.expiredPlan);
    const currentDate = new Date();
    if (expiredDate < currentDate) {
      return NextResponse.json(
        { message: "User plan has expired." },
        { status: 403 }
      );
    }
  }

  // Params
  const id = (await params).id;

  // Get Income By Id
  const getById = await db.income.findUnique({
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
  if (!getById) {
    return NextResponse.json(
      {
        message: `Income with id: "${id}" was not found.`,
      },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      message: `Get income with id: "${id}" successfully.`,
      data: getById,
    },
    { status: 200 }
  );
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check Authorization
  const user = await currentUser();
  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized access." },
      { status: 401 }
    );
  }

  // Check Synchronization
  const existingUser = await db.user.findUnique({
    where: { id: user.id },
  });
  if (!existingUser) {
    return NextResponse.json(
      { message: "Users are not synchronized" },
      { status: 422 }
    );
  }

  // Check Expired Plan
  if (existingUser.expiredPlan && existingUser.plan !== "LIFETIME") {
    const expiredDate = new Date(existingUser.expiredPlan);
    const currentDate = new Date();
    if (expiredDate < currentDate) {
      return NextResponse.json(
        { message: "User plan has expired." },
        { status: 403 }
      );
    }
  }

  // Params
  const id = (await params).id;

  // Check id is valid
  const getById = await db.income.findUnique({
    where: { id },
  });
  if (!getById) {
    return NextResponse.json(
      {
        message: `Income with id: "${id}" was not found.`,
      },
      { status: 404 }
    );
  }

  // Body
  const body = await req.json();
  if (body.date) body.date = new Date(body.date);

  // Field Validation
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

  // Update Income
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

  // Internal Server Error
  return NextResponse.json(
    {
      message: "Edit income failed.",
    },
    { status: 500 }
  );
}
